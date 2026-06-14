const express = require("express");
const adminController = require("../controllers/adminController");
const workflowController = require("../controllers/workflowController");
const { requireAuth, authorize } = require("../middlewares/auth");

const router = express.Router();

const roles = [
  "Super Admin",
  "Hotel Manager",
  "Restaurant Manager",
  "Receptionist",
  "Chef",
  "Waiter",
  "Spa Manager",
  "Event Manager"
];

router.use(requireAuth, authorize(...roles));
router.get("/", adminController.index);
router.get("/:module/export", workflowController.export);
router.post("/:module", adminController.createRecord);
router.put("/:module/:id", adminController.updateRecord);
router.delete("/:module/:id", adminController.deleteRecord);
router.post("/:module/:id/actions/:action", adminController.runAction);
router.get("/:module", adminController.module);

module.exports = router;
