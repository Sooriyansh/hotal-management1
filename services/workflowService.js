const slugify = require("slugify");
const { MODULES, can, visibleModulesFor } = require("../config/workflow");
const { ActivityLog, Notification, User } = require("../models");

const managementRoles = [
  "Super Admin",
  "Hotel Manager",
  "Restaurant Manager",
  "Receptionist",
  "Chef",
  "Waiter",
  "Spa Manager",
  "Event Manager"
];

const truthy = ["true", "on", "1", "yes"];

const isObjectIdLike = (value) => /^[a-f\d]{24}$/i.test(String(value || ""));

const getConfig = (moduleSlug) => MODULES[moduleSlug];

const assertModule = (moduleSlug) => {
  const config = getConfig(moduleSlug);
  if (!config) {
    const error = new Error("Unknown workflow module");
    error.status = 404;
    throw error;
  }
  return config;
};

const assertCan = (user, moduleSlug, action) => {
  if (!user || !can(user.role, moduleSlug, action)) {
    const error = new Error("You do not have permission for this action");
    error.status = 403;
    throw error;
  }
};

const labelFor = (record) => {
  if (!record) return "";
  return (
    record.name ||
    record.bookingNo ||
    record.orderNo ||
    record.paymentNo ||
    record.email ||
    record.title ||
    record.code ||
    record._id?.toString?.() ||
    record.id
  );
};

const serializeValue = (value) => {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object" && value.toString) return value.toString();
  return value ?? "";
};

const serializeRecord = (record, config) => {
  const doc = record.toObject ? record.toObject() : record;
  return {
    id: doc._id?.toString?.() || doc.id,
    label: labelFor(doc),
    owner: doc.user?.toString?.() || doc.user || "",
    values: config.listFields.map((name) => ({
      name,
      label: config.fields.find((item) => item.name === name)?.label || name,
      value: serializeValue(doc[name])
    })),
    raw: doc
  };
};

const normalizeByType = (value, type) => {
  if (type === "number") return value === "" || value == null ? undefined : Number(value);
  if (type === "boolean") return truthy.includes(String(value).toLowerCase());
  if (type === "tags") {
    if (Array.isArray(value)) return value;
    return String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (type === "date" || type === "datetime-local") return value ? new Date(value) : undefined;
  return value;
};

const normalizeBody = (config, body, existing = null) => {
  const update = {};

  config.fields.forEach((item) => {
    if (item.name === "password" && !body[item.name]) return;

    if (item.type === "boolean") {
      if (Object.prototype.hasOwnProperty.call(body, item.name)) {
        update[item.name] = normalizeByType(body[item.name], item.type);
      }
      return;
    }

    if (Object.prototype.hasOwnProperty.call(body, item.name)) {
      const value = normalizeByType(body[item.name], item.type);
      if (value !== undefined) update[item.name] = value;
    }
  });

  if (config.fields.some((item) => item.name === "slug") && !update.slug && update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }

  if (config.fields.some((item) => item.name === "bookingNo") && !update.bookingNo && !existing) {
    update.bookingNo = `WF-${Date.now().toString().slice(-7)}`;
  }

  if (config.fields.some((item) => item.name === "orderNo") && !update.orderNo && !existing) {
    update.orderNo = `FO-${Date.now().toString().slice(-7)}`;
  }

  if (config.fields.some((item) => item.name === "paymentNo") && !update.paymentNo && !existing) {
    update.paymentNo = `PY-${Date.now().toString().slice(-7)}`;
  }

  return update;
};

const ownerFilter = (user, config) => {
  if (user.role !== "Customer" || !config.ownerField || !isObjectIdLike(user.id)) return {};
  return { [config.ownerField]: user.id };
};

const listRecords = async ({ user, moduleSlug, dbReady, limit = 50 }) => {
  const config = assertModule(moduleSlug);
  assertCan(user, moduleSlug, "read");

  if (!dbReady) return { config, rows: [] };

  const rows = await config.model
    .find(ownerFilter(user, config))
    .sort({ updatedAt: -1, createdAt: -1 })
    .limit(Number(limit) || 50)
    .lean();

  return {
    config,
    rows: rows.map((row) => serializeRecord(row, config))
  };
};

const createActivity = async (req, details) => {
  if (!req.app.locals.dbReady) return null;

  const log = await ActivityLog.create({
    actor: isObjectIdLike(req.user?.id) ? req.user.id : undefined,
    actorName: req.user?.name,
    actorRole: req.user?.role,
    action: details.action,
    module: details.module,
    targetId: details.targetId,
    targetLabel: details.targetLabel,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    metadata: details.metadata
  });

  if (isObjectIdLike(req.user?.id)) {
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        activityLogs: {
          action: `${details.action} ${details.module}`,
          ip: req.ip,
          userAgent: req.get("user-agent"),
          meta: details.metadata
        }
      }
    });
  }

  return log;
};

const emitWorkflow = (req, moduleSlug, action, record, extra = {}) => {
  const config = assertModule(moduleSlug);
  const payload = {
    module: moduleSlug,
    moduleLabel: config.label,
    action,
    record: serializeRecord(record, config),
    actor: req.user ? { id: req.user.id, name: req.user.name, role: req.user.role } : null,
    at: new Date().toISOString(),
    ...extra
  };

  req.io.emit("workflow:changed", payload);
  if (record?.user) req.io.to(`user:${record.user.toString()}`).emit("workflow:mine", payload);
  if (req.user?.role) req.io.to(`role:${req.user.role}`).emit("workflow:role", payload);

  return payload;
};

const notifyRelated = async (req, moduleSlug, action, record, title) => {
  const config = assertModule(moduleSlug);
  const targetLabel = labelFor(record);
  const message = `${config.label} ${targetLabel} ${action.replace(/-/g, " ")} by ${req.user?.name || "system"}.`;
  const notification = {
    user: isObjectIdLike(record?.user) ? record.user : undefined,
    role: record?.user ? undefined : "Super Admin",
    title: title || `${config.label} ${action}`,
    message,
    type: moduleSlug.includes("booking") ? "Booking" : moduleSlug === "orders" ? "Order" : moduleSlug === "payments" ? "Payment" : "System",
    severity: action === "reject" || action === "cancel" || action === "deleted" ? "Warning" : "Success",
    metadata: { module: moduleSlug, action, targetId: record?._id?.toString?.() }
  };

  if (req.app.locals.dbReady) await Notification.create(notification);

  req.io.emit("notification", {
    title: notification.title,
    message: notification.message,
    type: notification.type,
    severity: notification.severity,
    module: moduleSlug
  });
};

const createRecord = async (req, moduleSlug) => {
  const config = assertModule(moduleSlug);
  assertCan(req.user, moduleSlug, "create");
  if (config.readOnly) {
    const error = new Error("This module is read only");
    error.status = 400;
    throw error;
  }
  if (!req.app.locals.dbReady) {
    const error = new Error("Database is required for workflow writes");
    error.status = 503;
    throw error;
  }

  const body = normalizeBody(config, req.body);
  if (config.ownerField === "user" && req.user?.role === "Customer" && isObjectIdLike(req.user.id)) {
    body.user = req.user.id;
  }

  const record = await config.model.create(body);
  await createActivity(req, {
    action: "create",
    module: moduleSlug,
    targetId: record._id.toString(),
    targetLabel: labelFor(record),
    metadata: body
  });
  await notifyRelated(req, moduleSlug, "created", record, `${config.label} created`);
  emitWorkflow(req, moduleSlug, "create", record);
  return record;
};

const findScopedRecord = async (req, moduleSlug, action = "read") => {
  const config = assertModule(moduleSlug);
  assertCan(req.user, moduleSlug, action);
  if (!req.app.locals.dbReady) {
    const error = new Error("Database is required for workflow writes");
    error.status = 503;
    throw error;
  }

  const filter = { _id: req.params.id, ...ownerFilter(req.user, config) };
  const record = await config.model.findOne(filter);
  if (!record) {
    const error = new Error("Record not found");
    error.status = 404;
    throw error;
  }

  return { config, record };
};

const updateRecord = async (req, moduleSlug) => {
  const { config, record } = await findScopedRecord(req, moduleSlug, "update");
  if (config.readOnly) {
    const error = new Error("This module is read only");
    error.status = 400;
    throw error;
  }

  const update = normalizeBody(config, req.body, record);
  Object.assign(record, update);
  await record.save();
  await createActivity(req, {
    action: "update",
    module: moduleSlug,
    targetId: record._id.toString(),
    targetLabel: labelFor(record),
    metadata: update
  });
  await notifyRelated(req, moduleSlug, "updated", record, `${config.label} updated`);
  emitWorkflow(req, moduleSlug, "update", record);
  return record;
};

const deleteRecord = async (req, moduleSlug) => {
  const { config, record } = await findScopedRecord(req, moduleSlug, "delete");
  const copy = record.toObject();
  await record.deleteOne();
  await createActivity(req, {
    action: "delete",
    module: moduleSlug,
    targetId: copy._id.toString(),
    targetLabel: labelFor(copy),
    metadata: { deleted: true }
  });
  await notifyRelated(req, moduleSlug, "deleted", copy, `${config.label} deleted`);
  emitWorkflow(req, moduleSlug, "delete", copy);
  return copy;
};

const runAction = async (req, moduleSlug, action) => {
  const permissionAction = action === "accept" || action === "ready" || action === "preparing" || action === "check-in" || action === "quote" || action === "cancel" ? "update" : action;
  const { config, record } = await findScopedRecord(req, moduleSlug, permissionAction);
  const statusUpdate = config.statusActions?.[action];

  if (!statusUpdate) {
    const error = new Error("Action is not available for this module");
    error.status = 400;
    throw error;
  }

  Object.entries(statusUpdate).forEach(([key, value]) => {
    if (key !== "title") record[key] = value;
  });

  if (moduleSlug === "room-bookings" && action === "assign") {
    record.assignedRoom = req.body.assignedRoom || record.assignedRoom;
    record.assignedBy = isObjectIdLike(req.user?.id) ? req.user.id : record.assignedBy;
  }
  if (moduleSlug === "room-bookings" && action === "check-in") record.checkedInAt = new Date();
  if (moduleSlug === "room-bookings" && action === "complete") record.checkedOutAt = new Date();
  if (moduleSlug === "orders") {
    record.statusHistory.push({
      status: record.kitchenStatus,
      by: isObjectIdLike(req.user?.id) ? req.user.id : undefined
    });
  }

  await record.save();
  await createActivity(req, {
    action,
    module: moduleSlug,
    targetId: record._id.toString(),
    targetLabel: labelFor(record),
    metadata: { statusUpdate }
  });
  await notifyRelated(req, moduleSlug, action, record, statusUpdate.title);
  emitWorkflow(req, moduleSlug, action, record, { title: statusUpdate.title });
  return record;
};

const dashboardMetrics = async (dbReady) => {
  if (!dbReady) {
    return {
      revenue: 0,
      rooms: 0,
      bookings: 0,
      orders: 0,
      notifications: 0,
      activities: 0
    };
  }

  const [payments, rooms, bookings, orders, notifications, activities] = await Promise.all([
    MODULES.payments.model.aggregate([{ $match: { status: "Paid" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    MODULES.rooms.model.countDocuments(),
    MODULES["room-bookings"].model.countDocuments(),
    MODULES.orders.model.countDocuments(),
    MODULES.notifications.model.countDocuments({ readAt: null }),
    MODULES["activity-logs"].model.countDocuments()
  ]);

  return {
    revenue: payments[0]?.total || 0,
    rooms,
    bookings,
    orders,
    notifications,
    activities
  };
};

const relatedRolesForModule = (moduleSlug) => {
  if (moduleSlug.includes("room")) return ["Hotel Manager", "Receptionist", "Super Admin"];
  if (moduleSlug.includes("table") || moduleSlug === "orders" || moduleSlug === "menu-items") {
    return ["Restaurant Manager", "Chef", "Waiter", "Super Admin"];
  }
  if (moduleSlug.includes("spa")) return ["Spa Manager", "Super Admin"];
  if (moduleSlug.includes("event")) return ["Event Manager", "Super Admin"];
  return managementRoles;
};

module.exports = {
  can,
  getConfig,
  assertCan,
  visibleModulesFor,
  listRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  runAction,
  serializeRecord,
  createActivity,
  emitWorkflow,
  notifyRelated,
  dashboardMetrics,
  relatedRolesForModule,
  managementRoles
};
