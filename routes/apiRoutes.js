const express = require("express");
const apiController = require("../controllers/apiController");
const workflowController = require("../controllers/workflowController");
const { requireAuth, authorize } = require("../middlewares/auth");

const router = express.Router();

router.get("/availability/rooms", apiController.roomAvailability);
router.get("/availability/tables", apiController.tableAvailability);
router.get("/menu", apiController.menu);
router.post("/orders/food", requireAuth, apiController.foodOrder);
router.get("/workflow/:module", requireAuth, workflowController.list);
router.post("/workflow/:module", requireAuth, workflowController.create);
router.patch("/workflow/:module/:id", requireAuth, workflowController.update);
router.put("/workflow/:module/:id", requireAuth, workflowController.update);
router.delete("/workflow/:module/:id", requireAuth, workflowController.remove);
router.post("/workflow/:module/:id/actions/:action", requireAuth, workflowController.action);
router.post("/concierge/message", apiController.concierge);
router.get("/analytics", requireAuth, authorize("Super Admin", "Hotel Manager", "Restaurant Manager"), apiController.analytics);

module.exports = router;
