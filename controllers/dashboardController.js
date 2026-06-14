const asyncHandler = require("../utils/asyncHandler");
const { demo } = require("../services/catalogService");
const workflow = require("../services/workflowService");

const managerRoles = [
  "Super Admin",
  "Hotel Manager",
  "Restaurant Manager",
  "Receptionist",
  "Chef",
  "Waiter",
  "Spa Manager",
  "Event Manager"
];

exports.index = asyncHandler(async (req, res) => {
  if (managerRoles.includes(req.user.role)) {
    return res.redirect("/admin");
  }

  const customerModules = ["room-bookings", "table-bookings", "orders", "spa-bookings", "event-bookings", "payments", "notifications"];
  const live = {};

  if (req.app.locals.dbReady) {
    await Promise.all(
      customerModules.map(async (moduleSlug) => {
        if (!workflow.can(req.user.role, moduleSlug, "read")) return;
        const result = await workflow.listRecords({
          user: req.user,
          moduleSlug,
          dbReady: req.app.locals.dbReady,
          limit: 10
        });
        live[moduleSlug] = result.rows;
      })
    );
  }

  res.render("dashboards/customer", {
    title: "Customer Dashboard",
    description: "Bookings, reservations, orders, memberships, rewards, invoices, wishlist, and profile.",
    dashboard: demo.dashboard,
    memberships: demo.memberships,
    live
  });
});

exports.runAction = asyncHandler(async (req, res) => {
  await workflow.runAction(req, req.params.module, req.params.action);
  res.redirect(`/dashboard?success=${encodeURIComponent("Request updated")}`);
});

exports.updateRecord = asyncHandler(async (req, res) => {
  await workflow.updateRecord(req, req.params.module);
  res.redirect(`/dashboard?success=${encodeURIComponent("Record updated")}`);
});
