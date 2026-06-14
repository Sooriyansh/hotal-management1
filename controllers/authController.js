const crypto = require("crypto");
const asyncHandler = require("../utils/asyncHandler");
const { User, ActivityLog } = require("../models");
const { signToken, setAuthCookie, COOKIE_NAME } = require("../middlewares/auth");

const demoUsers = {
  "admin@grandluxury.example": {
    id: "demo-admin",
    name: "Aurelia Admin",
    email: "admin@grandluxury.example",
    role: "Super Admin",
    avatar: ""
  },
  "customer@grandluxury.example": {
    id: "demo-customer",
    name: "Demo Guest",
    email: "customer@grandluxury.example",
    role: "Customer",
    avatar: ""
  }
};

exports.loginForm = (req, res) => {
  res.render("auth/login", {
    title: "Login",
    description: "Access your bookings, orders, rewards, and dashboards."
  });
};

exports.registerForm = (req, res) => {
  res.render("auth/register", {
    title: "Create Account",
    description: "Join Grand Luxury for personalized room, dining, spa, and reward experiences."
  });
};

exports.forgotForm = (req, res) => {
  res.render("auth/forgot", {
    title: "Forgot Password",
    description: "Request a secure password reset."
  });
};

exports.profile = asyncHandler(async (req, res) => {
  let activityLogs = [
    { action: "Logged in", at: "Today" },
    { action: "Viewed Luxury Suite", at: "Yesterday" },
    { action: "Joined newsletter", at: "This week" }
  ];

  if (req.app.locals.dbReady) {
    activityLogs = await ActivityLog.find({ actor: req.user.id })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean()
      .then((logs) =>
        logs.map((log) => ({
          action: `${log.action} ${log.module}`,
          at: log.createdAt.toLocaleString()
        }))
      );
  }

  res.render("auth/profile", {
    title: "Profile Management",
    description: "Update your avatar, preferences, and guest profile.",
    activityLogs
  });
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!req.app.locals.dbReady) {
    const user = {
      id: `demo-${Date.now()}`,
      name,
      email,
      phone,
      role: role || "Customer"
    };
    setAuthCookie(res, signToken(user));
    return res.redirect("/dashboard?success=Demo account created");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.redirect(`/auth/register?error=${encodeURIComponent("Email is already registered")}`);
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: role || "Customer"
  });

  setAuthCookie(res, signToken(user));
  res.redirect("/dashboard?success=Welcome to Grand Luxury");
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!req.app.locals.dbReady) {
    const demoUser = demoUsers[email] || demoUsers["customer@grandluxury.example"];
    if (password && password.length >= 4) {
      setAuthCookie(res, signToken(demoUser));
      return res.redirect("/dashboard?success=Demo login active");
    }
    return res.redirect(`/auth/login?error=${encodeURIComponent("Use any password with 4 or more characters in demo mode")}`);
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.redirect(`/auth/login?error=${encodeURIComponent("Invalid email or password")}`);
  }

  user.lastLoginAt = new Date();
  user.activityLogs.push({
    action: "Login",
    ip: req.ip,
    userAgent: req.get("user-agent")
  });
  await user.save();
  await ActivityLog.create({
    actor: user._id,
    actorName: user.name,
    actorRole: user.role,
    action: "login",
    module: "auth",
    targetId: user._id.toString(),
    targetLabel: user.email,
    ip: req.ip,
    userAgent: req.get("user-agent")
  });

  setAuthCookie(res, signToken(user));
  res.redirect("/dashboard?success=Welcome back");
});

exports.forgot = asyncHandler(async (req, res) => {
  if (req.app.locals.dbReady) {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      user.resetPasswordToken = crypto.randomBytes(24).toString("hex");
      user.resetPasswordExpires = Date.now() + 1000 * 60 * 30;
      await user.save();
    }
  }

  res.redirect(`/auth/forgot?success=${encodeURIComponent("If the email exists, a reset link has been prepared.")}`);
});

exports.updateProfile = asyncHandler(async (req, res) => {
  if (req.app.locals.dbReady && req.user?.id) {
    const update = {
      name: req.body.name,
      phone: req.body.phone,
      avatar: req.body.avatar || "",
      "preferences.roomType": req.body.roomType,
      "preferences.cuisine": req.body.cuisine,
      "preferences.pillow": req.body.pillow
    };
    await User.findByIdAndUpdate(req.user.id, update, { new: true });
    await ActivityLog.create({
      actor: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: "update",
      module: "profile",
      targetId: req.user.id,
      targetLabel: req.body.name || req.user.name,
      ip: req.ip,
      userAgent: req.get("user-agent")
    });
  }

  const nextUser = {
    ...req.user,
    name: req.body.name || req.user.name,
    avatar: req.body.avatar || req.user.avatar
  };
  setAuthCookie(res, signToken(nextUser));
  res.redirect(`/auth/profile?success=${encodeURIComponent("Profile updated")}`);
});

exports.logout = (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.redirect("/?success=You have been logged out");
};
