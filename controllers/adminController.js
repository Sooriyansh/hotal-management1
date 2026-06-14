const asyncHandler = require("../utils/asyncHandler");
const { demo } = require("../services/catalogService");
const workflow = require("../services/workflowService");

exports.index = asyncHandler(async (req, res) => {
  const modules = workflow.visibleModulesFor(req.user.role);
  const metrics = await workflow.dashboardMetrics(req.app.locals.dbReady);

  res.render("dashboards/admin", {
    title: "Luxury Analytics Dashboard",
    description: "Revenue, occupancy, booking trends, customer growth, memberships, and operational control.",
    analytics: demo.analytics,
    metrics,
    modules,
    rooms: demo.rooms,
    tables: demo.tableMap,
    orders: demo.dashboard.bookings
  });
});

exports.module = asyncHandler(async (req, res) => {
  const moduleSlug = req.params.module;
  const { config, rows } = await workflow.listRecords({
    user: req.user,
    moduleSlug,
    dbReady: req.app.locals.dbReady,
    limit: 100
  });

  res.render("dashboards/module", {
    title: `${config.label} Management`,
    description: `Manage ${config.label.toLowerCase()} records, permissions, workflow status, and audit actions.`,
    moduleSlug,
    moduleConfig: config,
    moduleName: config.label,
    modules: workflow.visibleModulesFor(req.user.role),
    rows,
    can: (action) => workflow.can(req.user.role, moduleSlug, action)
  });
});

exports.createRecord = asyncHandler(async (req, res) => {
  await workflow.createRecord(req, req.params.module);
  res.redirect(`/admin/${req.params.module}?success=${encodeURIComponent("Record created")}`);
});

exports.updateRecord = asyncHandler(async (req, res) => {
  await workflow.updateRecord(req, req.params.module);
  res.redirect(`/admin/${req.params.module}?success=${encodeURIComponent("Record updated")}`);
});

exports.deleteRecord = asyncHandler(async (req, res) => {
  await workflow.deleteRecord(req, req.params.module);
  res.redirect(`/admin/${req.params.module}?success=${encodeURIComponent("Record deleted")}`);
});

exports.runAction = asyncHandler(async (req, res) => {
  await workflow.runAction(req, req.params.module, req.params.action);
  res.redirect(`/admin/${req.params.module}?success=${encodeURIComponent("Workflow action completed")}`);
});
