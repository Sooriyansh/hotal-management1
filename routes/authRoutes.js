const express = require("express");
const authController = require("../controllers/authController");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/login", authController.loginForm);
router.post("/login", authController.login);
router.get("/register", authController.registerForm);
router.post("/register", authController.register);
router.get("/forgot", authController.forgotForm);
router.post("/forgot", authController.forgot);
router.get("/profile", requireAuth, authController.profile);
router.post("/profile", requireAuth, authController.updateProfile);
router.post("/logout", authController.logout);

module.exports = router;
