const asyncHandler = require("../utils/asyncHandler");
const workflow = require("../services/workflowService");

const wantsJson = (req) => req.originalUrl.startsWith("/api") || req.get("accept")?.includes("application/json");

const redirectToModule = (res, moduleSlug, message) => {
  res.redirect(`/admin/${moduleSlug}?success=${encodeURIComponent(message)}`);
};

exports.list = asyncHandler(async (req, res) => {
  const result = await workflow.listRecords({
    user: req.user,
    moduleSlug: req.params.module,
    dbReady: req.app.locals.dbReady,
    limit: req.query.limit
  });
  res.json({
    module: req.params.module,
    label: result.config.label,
    fields: result.config.listFields,
    rows: result.rows
  });
});

exports.create = asyncHandler(async (req, res) => {
  const record = await workflow.createRecord(req, req.params.module);
  if (wantsJson(req)) return res.status(201).json({ record });
  redirectToModule(res, req.params.module, "Record created");
});

exports.update = asyncHandler(async (req, res) => {
  const record = await workflow.updateRecord(req, req.params.module);
  if (wantsJson(req)) return res.json({ record });
  redirectToModule(res, req.params.module, "Record updated");
});

exports.remove = asyncHandler(async (req, res) => {
  const record = await workflow.deleteRecord(req, req.params.module);
  if (wantsJson(req)) return res.json({ record });
  redirectToModule(res, req.params.module, "Record deleted");
});

exports.action = asyncHandler(async (req, res) => {
  const record = await workflow.runAction(req, req.params.module, req.params.action);
  if (wantsJson(req)) return res.json({ record });
  redirectToModule(res, req.params.module, "Action completed");
});

exports.export = asyncHandler(async (req, res) => {
  const { config, rows } = await workflow.listRecords({
    user: req.user,
    moduleSlug: req.params.module,
    dbReady: req.app.locals.dbReady,
    limit: 500
  });
  workflow.assertCan(req.user, req.params.module, "export");

  const headers = config.listFields;
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row.values.find((item) => item.name === header)?.value || "";
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",")
    )
  ];

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${req.params.module}.csv"`);
  res.send(lines.join("\n"));
});
