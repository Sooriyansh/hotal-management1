const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/", requireAuth, dashboardController.index);
router.put("/:module/:id", requireAuth, dashboardController.updateRecord);
router.post("/:module/:id/actions/:action", requireAuth, dashboardController.runAction);

module.exports = router;
