const asyncHandler = require("../utils/asyncHandler");
const { calculateInvoice } = require("../utils/invoice");
const { getRooms, getTables, getFoodItems, demo } = require("../services/catalogService");
const workflow = require("../services/workflowService");
const { FoodOrder } = require("../models");

exports.roomAvailability = asyncHandler(async (req, res) => {
  const rooms = await getRooms(req.app);
  res.json({
    updatedAt: new Date(),
    rooms: rooms.map((room) => ({
      name: room.name,
      category: room.category,
      price: room.price,
      availability: room.availability
    }))
  });
});

exports.tableAvailability = asyncHandler(async (req, res) => {
  res.json({
    updatedAt: new Date(),
    tables: await getTables(req.app)
  });
});

exports.menu = asyncHandler(async (req, res) => {
  res.json({
    categories: demo.menuCategories,
    items: await getFoodItems(req.app)
  });
});

exports.foodOrder = asyncHandler(async (req, res) => {
  const items = req.body.items || [];
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  const invoice = calculateInvoice({ subtotal });
  let orderNo = `FO-${Date.now().toString().slice(-6)}`;

  if (req.app.locals.dbReady) {
    const order = await FoodOrder.create({
      orderNo,
      user: req.user?.id,
      items,
      orderType: req.body.orderType || "Room Service",
      subtotal: invoice.subtotal,
      gst: invoice.gst,
      total: invoice.total,
      kitchenStatus: "Received"
    });
    orderNo = order.orderNo;
    await workflow.createActivity(req, {
      action: "create",
      module: "orders",
      targetId: order._id.toString(),
      targetLabel: order.orderNo,
      metadata: { total: invoice.total }
    });
    await workflow.notifyRelated(req, "orders", "created", order, "New food order");
    workflow.emitWorkflow(req, "orders", "create", order);
  }

  req.io.emit("orderTracking", {
    orderNo,
    status: "Received",
    message: "Kitchen has received the order."
  });

  res.status(201).json({ orderNo, invoice, status: "Received" });
});

exports.concierge = asyncHandler(async (req, res) => {
  const message = (req.body.message || "").toLowerCase();
  let recommendation = "I recommend the Luxury Suite with chef table dining and a private spa slot.";

  if (message.includes("family")) {
    recommendation = "The Family Room with pool access, early dining, and a kid welcome kit is the best match.";
  }
  if (message.includes("wedding")) {
    recommendation = "Wedding Hall Prestige is available with custom menu planning and payment tracking.";
  }
  if (message.includes("business") || message.includes("conference")) {
    recommendation = "The Corporate Summit package includes conference rooms, AV suite, and executive dining.";
  }

  res.json({
    answer: recommendation,
    actions: ["Check availability", "Prepare quote", "Notify concierge"]
  });
});

exports.analytics = asyncHandler(async (req, res) => {
  res.json(demo.analytics);
});
