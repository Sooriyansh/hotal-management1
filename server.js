require("dotenv").config();
const { getConciergeReply } = require("./services/geminiService");
const path = require("path");
const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const methodOverride = require("method-override");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/database");
const { attachUser, COOKIE_NAME } = require("./middlewares/auth");
const { setupChangeStreams } = require("./services/changeStreamService");
const indexRoutes = require("./routes/indexRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.APP_URL || "*",
    methods: ["GET", "POST"]
  }
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.locals.site = {
  name: "Grand Luxury Hotel & Restaurant",
  tagline: "Experience Luxury Beyond Imagination",
  phone: "+1 212 555 0198",
  email: "concierge@grandluxury.example",
  address: "1 Imperial Avenue, New York, NY",
  currency: "$"
};

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);
app.use(cors());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use((req, res, next) => {
  req.io = io;
  res.locals.currentPath = req.path;
  res.locals.success = req.query.success || "";
  res.locals.error = req.query.error || "";
  next();
});

app.use(attachUser);
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/admin", adminRoutes);
app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).render("pages/404", {
    title: "Page Not Found",
    description: "The requested experience could not be found."
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).render("pages/error", {
    title: "Service Momentarily Unavailable",
    description: err.message || "Our team has been notified."
  });
});

const parseCookies = (header = "") =>
  header.split(";").reduce((acc, item) => {
    const [key, ...value] = item.trim().split("=");
    if (key) acc[key] = decodeURIComponent(value.join("="));
    return acc;
  }, {});

io.use((socket, next) => {
  const cookies = parseCookies(socket.handshake.headers.cookie || "");
  const token = cookies[COOKIE_NAME];

  if (token) {
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET || "development-secret");
    } catch (error) {
      socket.user = null;
    }
  }

  next();
});

// io.on("connection", (socket) => {
//   if (socket.user?.id) socket.join(`user:${socket.user.id}`);
//   if (socket.user?.role) socket.join(`role:${socket.user.role}`);

//   socket.emit("notification", {
//     title: "Concierge connected",
//     message: "Live availability, table status, and order tracking are online."
//   });

//   socket.on("joinBooking", (bookingId) => {
//     socket.join(`booking:${bookingId}`);
//   });

//   socket.on("conciergeMessage", (payload) => {
//     socket.emit("conciergeReply", {
//       text: `I found a ${payload.intent || "luxury"} option for you. Shall I prepare a reservation summary?`,
//       at: new Date().toISOString()
//     });
//   });
// });


io.on("connection", (socket) => {
  if (socket.user?.id) socket.join(`user:${socket.user.id}`);
  if (socket.user?.role) socket.join(`role:${socket.user.role}`);

  socket.emit("notification", {
    title: "Concierge connected",
    message: "Live availability, table status, and order tracking are online."
  });

  socket.on("joinBooking", (bookingId) => {
    socket.join(`booking:${bookingId}`);
  });

  socket.on("conciergeMessage", async (payload) => {
    try {
      const reply = await getConciergeReply(payload.message);

      socket.emit("conciergeReply", {
        text: reply,
        at: new Date().toISOString()
      });

    } catch (error) {
      console.error(error);

      socket.emit("conciergeReply", {
        text: "Unable to process your request.",
        at: new Date().toISOString()
      });
    }
  });
});
const start = async () => {
  app.locals.dbReady = await connectDB();
  app.locals.changeStreams = app.locals.dbReady ? setupChangeStreams(io) : [];
  const port = process.env.PORT || 8080;
  server.listen(port, () => {
    console.log(`Grand Luxury running at http://localhost:${port}`);
  });
};

start();
