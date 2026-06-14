const jwt = require("jsonwebtoken");

const COOKIE_NAME = "grand_luxury_token";

const signToken = (user) => {
  const payload = {
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role || "Customer",
    avatar: user.avatar || ""
  };

  return jwt.sign(payload, process.env.JWT_SECRET || "development-secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

const setAuthCookie = (res, token) => {
  const days = Number(process.env.COOKIE_MAX_AGE_DAYS || 7);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: days * 24 * 60 * 60 * 1000
  });
};

const getToken = (req) => {
  if (req.cookies && req.cookies[COOKIE_NAME]) return req.cookies[COOKIE_NAME];
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) return authHeader.slice(7);
  return null;
};

const attachUser = (req, res, next) => {
  const token = getToken(req);
  req.user = null;
  res.locals.user = null;

  if (!token) return next();

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || "development-secret");
    req.user = user;
    res.locals.user = user;
  } catch (error) {
    res.clearCookie(COOKIE_NAME);
  }

  next();
};

const requireAuth = (req, res, next) => {
  if (req.user) return next();
  if (req.originalUrl.startsWith("/api")) {
    return res.status(401).json({ message: "Authentication required" });
  }
  return res.redirect(`/auth/login?error=${encodeURIComponent("Please login to continue")}`);
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return requireAuth(req, res, next);
  if (roles.length === 0 || roles.includes(req.user.role)) return next();
  if (req.originalUrl.startsWith("/api")) {
    return res.status(403).json({ message: "You do not have access to this resource" });
  }
  return res.status(403).render("pages/error", {
    title: "Access Restricted",
    description: "Your membership or team role does not include this area."
  });
};

module.exports = {
  COOKIE_NAME,
  signToken,
  setAuthCookie,
  attachUser,
  requireAuth,
  authorize
};
