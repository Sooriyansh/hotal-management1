const asyncHandler = require("../utils/asyncHandler");
const { calculateInvoice } = require("../utils/invoice");
const workflow = require("../services/workflowService");
const {
  demo,
  getRooms,
  getRoom,
  getFoodItems,
  getTables,
  getMemberships,
  getSpaServices,
  getEvents,
  getTestimonials
} = require("../services/catalogService");
const {
  RoomBooking,
  TableBooking,
  SpaBooking,
  EventBooking,
  Contact,
  Newsletter,
  Room,
  Review,
  User
} = require("../models");

exports.home = asyncHandler(async (req, res) => {
  const [rooms, foods, testimonials] = await Promise.all([
    getRooms(req.app),
    getFoodItems(req.app),
    getTestimonials(req.app)
  ]);

  res.render("pages/home", {
    title: "Grand Luxury Hotel & Restaurant",
    description: "A cinematic 5-star hospitality platform for rooms, dining, spa, events, and AI concierge.",
    heroVideo: demo.heroVideo,
    images: demo.images,
    stats: demo.stats,
    rooms: rooms.slice(0, 3),
    foodItems: foods.slice(0, 3),
    offers: demo.offers,
    testimonials
  });
});

exports.rooms = asyncHandler(async (req, res) => {
  const rooms = await getRooms(req.app);
  res.render("pages/rooms", {
    title: "Luxury Rooms & Suites",
    description: "Compare rooms, pricing, amenities, availability, reviews, and 360 tours.",
    rooms
  });
});

exports.roomDetail = asyncHandler(async (req, res) => {
  const room = await getRoom(req.app, req.params.slug);
  if (!room) {
    return res.status(404).render("pages/404", {
      title: "Room Not Found",
      description: "That room category is not currently published."
    });
  }

  res.render("pages/room-detail", {
    title: `${room.name} Booking`,
    description: room.description,
    room,
    relatedRooms: (await getRooms(req.app)).filter((item) => item.slug !== room.slug).slice(0, 3)
  });
});

exports.addWishlist = asyncHandler(async (req, res) => {
  if (req.app.locals.dbReady) {
    const room = await Room.findOne({ slug: req.params.slug });
    if (room) {
      await User.findByIdAndUpdate(req.user.id, { $addToSet: { wishlist: room._id } });
      await workflow.createActivity(req, {
        action: "update",
        module: "wishlist",
        targetId: room._id.toString(),
        targetLabel: room.name
      });
      req.io.to(`user:${req.user.id}`).emit("notification", {
        title: "Wishlist updated",
        message: `${room.name} was added to your wishlist.`,
        severity: "Success"
      });
    }
  }

  res.redirect(`/rooms/${req.params.slug}?success=${encodeURIComponent("Added to wishlist")}`);
});

exports.createRoomBooking = asyncHandler(async (req, res) => {
  const subtotal = Number(req.body.nights || 1) * Number(req.body.price || 390);
  const invoice = calculateInvoice({ subtotal, discount: Number(req.body.discount || 0) });
  let bookingNo = `RB-${Date.now().toString().slice(-6)}`;
  let booking = null;

  if (req.app.locals.dbReady) {
    booking = await RoomBooking.create({
      bookingNo,
      user: req.user?.id,
      guestName: req.body.guestName || req.user?.name,
      email: req.body.email || req.user?.email,
      phone: req.body.phone,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      guests: req.body.guests,
      roomCategory: req.body.roomCategory,
      couponCode: req.body.couponCode,
      subtotal: invoice.subtotal,
      discount: invoice.discount,
      gst: invoice.gst,
      total: invoice.total,
      invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
      status: "Pending"
    });
    bookingNo = booking.bookingNo;
    await workflow.createActivity(req, {
      action: "create",
      module: "room-bookings",
      targetId: booking._id.toString(),
      targetLabel: booking.bookingNo,
      metadata: { total: invoice.total }
    });
    await workflow.notifyRelated(req, "room-bookings", "created", booking, "New room booking");
    workflow.emitWorkflow(req, "room-bookings", "create", booking);
  }

  req.io.emit("notification", {
    title: "New room booking",
    message: `${req.body.roomCategory || "Luxury room"} request ${bookingNo} is ready for review.`
  });

  res.redirect(`/dashboard?success=${encodeURIComponent(`Booking ${bookingNo} created. Invoice total ${invoice.total}.`)}`);
});

exports.restaurant = asyncHandler(async (req, res) => {
  const [foodItems, tables] = await Promise.all([getFoodItems(req.app), getTables(req.app)]);
  res.render("pages/restaurant", {
    title: "Restaurant, QR Ordering & Reservations",
    description: "Reserve tables, browse menus, place room service orders, and follow kitchen status.",
    categories: demo.menuCategories,
    foodItems,
    tables,
    image: demo.images.restaurant
  });
});

exports.reserveTable = asyncHandler(async (req, res) => {
  let bookingNo = `TB-${Date.now().toString().slice(-6)}`;
  let booking = null;

  if (req.app.locals.dbReady) {
    booking = await TableBooking.create({
      bookingNo,
      user: req.user?.id,
      guestName: req.body.guestName || req.user?.name,
      email: req.body.email || req.user?.email,
      phone: req.body.phone,
      reservationDate: req.body.reservationDate,
      reservationTime: req.body.reservationTime,
      guests: req.body.guests,
      mealType: req.body.mealType,
      notes: req.body.notes,
      status: "Pending"
    });
    bookingNo = booking.bookingNo;
    await workflow.createActivity(req, {
      action: "create",
      module: "table-bookings",
      targetId: booking._id.toString(),
      targetLabel: booking.bookingNo,
      metadata: { guests: booking.guests }
    });
    await workflow.notifyRelated(req, "table-bookings", "created", booking, "New table reservation");
    workflow.emitWorkflow(req, "table-bookings", "create", booking);
  }

  req.io.emit("tableStatus", { bookingNo, status: "Pending" });
  res.redirect(`/restaurant?success=${encodeURIComponent(`Table reservation ${bookingNo} received.`)}`);
});

exports.virtualTour = asyncHandler(async (req, res) => {
  res.render("pages/virtual-tour", {
    title: "Virtual 360 Tours",
    description: "Explore rooms, suites, restaurant, spa, pool, and reception through interactive tour panels.",
    tourStops: demo.tourStops
  });
});

exports.concierge = asyncHandler(async (req, res) => {
  res.render("pages/concierge", {
    title: "AI Butler Concierge",
    description: "AI booking support for rooms, dining, travel guide, FAQ, and WhatsApp-ready assistance.",
    suggestions: [
      "Plan a Diamond anniversary weekend",
      "Find a family room with pool access",
      "Reserve chef table after spa",
      "Create a wedding quote"
    ]
  });
});

exports.memberships = asyncHandler(async (req, res) => {
  res.render("pages/memberships", {
    title: "VIP Memberships",
    description: "Silver, Gold, Platinum, and Diamond loyalty programs with rewards tracking.",
    memberships: await getMemberships(req.app)
  });
});

exports.spa = asyncHandler(async (req, res) => {
  res.render("pages/spa", {
    title: "Spa & Wellness",
    description: "Massage booking, therapy sessions, private spa suites, and wellness memberships.",
    services: await getSpaServices(req.app)
  });
});

exports.bookSpa = asyncHandler(async (req, res) => {
  let booking = null;
  if (req.app.locals.dbReady) {
    booking = await SpaBooking.create({
      bookingNo: `SB-${Date.now().toString().slice(-6)}`,
      user: req.user?.id,
      guestName: req.body.guestName || req.user?.name,
      scheduledAt: req.body.scheduledAt,
      suitePreference: req.body.suitePreference,
      amount: req.body.amount,
      status: "Pending"
    });
    await workflow.createActivity(req, {
      action: "create",
      module: "spa-bookings",
      targetId: booking._id.toString(),
      targetLabel: booking.bookingNo,
      metadata: { amount: booking.amount }
    });
    await workflow.notifyRelated(req, "spa-bookings", "created", booking, "New spa booking");
    workflow.emitWorkflow(req, "spa-bookings", "create", booking);
  }
  res.redirect(`/spa?success=${encodeURIComponent("Spa booking request received.")}`);
});

exports.events = asyncHandler(async (req, res) => {
  res.render("pages/events", {
    title: "Events & Celebrations",
    description: "Wedding hall booking, corporate events, birthdays, conference rooms, quotes, and payments.",
    events: await getEvents(req.app)
  });
});

exports.bookEvent = asyncHandler(async (req, res) => {
  let booking = null;
  if (req.app.locals.dbReady) {
    booking = await EventBooking.create({
      bookingNo: `EB-${Date.now().toString().slice(-6)}`,
      user: req.user?.id,
      guestName: req.body.guestName || req.user?.name,
      eventDate: req.body.eventDate,
      guests: req.body.guests,
      notes: req.body.notes,
      status: "Inquiry"
    });
    await workflow.createActivity(req, {
      action: "create",
      module: "event-bookings",
      targetId: booking._id.toString(),
      targetLabel: booking.bookingNo,
      metadata: { guests: booking.guests }
    });
    await workflow.notifyRelated(req, "event-bookings", "created", booking, "New event request");
    workflow.emitWorkflow(req, "event-bookings", "create", booking);
  }
  res.redirect(`/events?success=${encodeURIComponent("Event quote request sent to the planning desk.")}`);
});

exports.offers = asyncHandler(async (req, res) => {
  res.render("pages/offers", {
    title: "Luxury Offers",
    description: "Dynamic offers, countdowns, coupon codes, suite weekends, chef tables, and event prestige.",
    offers: demo.offers
  });
});

exports.contact = asyncHandler(async (req, res) => {
  res.render("pages/contact", {
    title: "Contact Concierge",
    description: "Send a request to reservations, events, dining, or the private concierge desk."
  });
});

exports.submitContact = asyncHandler(async (req, res) => {
  if (req.app.locals.dbReady) {
    await Contact.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      message: req.body.message,
      source: req.body.source || "Contact"
    });
  }
  res.redirect(`/contact?success=${encodeURIComponent("Your message reached the concierge desk.")}`);
});

exports.newsletter = asyncHandler(async (req, res) => {
  if (req.app.locals.dbReady) {
    await Newsletter.findOneAndUpdate(
      { email: req.body.email },
      { email: req.body.email, name: req.body.name, isSubscribed: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  res.redirect(`/?success=${encodeURIComponent("You are on the Grand Luxury list.")}`);
});

exports.submitReview = asyncHandler(async (req, res) => {
  if (req.app.locals.dbReady) {
    const review = await Review.create({
      user: req.user?.id,
      userName: req.user?.name || req.body.userName,
      targetType: req.body.targetType || "Room",
      rating: req.body.rating,
      comment: req.body.comment,
      isApproved: false
    });
    await workflow.createActivity(req, {
      action: "create",
      module: "reviews",
      targetId: review._id.toString(),
      targetLabel: review.userName,
      metadata: { rating: review.rating }
    });
    await workflow.notifyRelated(req, "reviews", "created", review, "New review submitted");
    workflow.emitWorkflow(req, "reviews", "create", review);
  }

  res.redirect(`${req.get("referer") || "/dashboard"}?success=${encodeURIComponent("Review submitted for approval")}`);
});

exports.downloadInvoice = asyncHandler(async (req, res) => {
  const moduleMap = {
    "room-bookings": RoomBooking,
    "table-bookings": TableBooking,
    "spa-bookings": SpaBooking,
    "event-bookings": EventBooking
  };
  const Model = moduleMap[req.params.module];
  if (!Model || !req.app.locals.dbReady) {
    return res.status(404).render("pages/404", {
      title: "Invoice Not Found",
      description: "That invoice is not available."
    });
  }

  const record = await Model.findOne({ _id: req.params.id, user: req.user.id }).lean();
  if (!record) {
    return res.status(404).render("pages/404", {
      title: "Invoice Not Found",
      description: "That invoice is not available for your account."
    });
  }

  const lines = [
    siteLine(req),
    `Invoice: ${record.invoiceNo || record.bookingNo}`,
    `Guest: ${record.guestName || req.user.name}`,
    `Status: ${record.status}`,
    `Total: ${record.total || record.amount || record.customQuote || 0}`
  ];

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", `attachment; filename="${record.invoiceNo || record.bookingNo}.txt"`);
  res.send(lines.join("\n"));
});

const siteLine = (req) => `${req.app.locals.site.name} / ${req.app.locals.site.email}`;
