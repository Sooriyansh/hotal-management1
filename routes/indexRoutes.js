const express = require("express");
const pageController = require("../controllers/pageController");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/", pageController.home);
router.get("/rooms", pageController.rooms);
router.get("/rooms/:slug", pageController.roomDetail);
router.post("/rooms/:slug/wishlist", requireAuth, pageController.addWishlist);
router.post("/rooms/book", requireAuth, pageController.createRoomBooking);
router.get("/restaurant", pageController.restaurant);
router.post("/restaurant/reserve", requireAuth, pageController.reserveTable);
router.get("/virtual-tour", pageController.virtualTour);
router.get("/concierge", pageController.concierge);
router.get("/memberships", pageController.memberships);
router.get("/spa", pageController.spa);
router.post("/spa/book", requireAuth, pageController.bookSpa);
router.get("/events", pageController.events);
router.post("/events/book", requireAuth, pageController.bookEvent);
router.get("/offers", pageController.offers);
router.get("/contact", pageController.contact);
router.post("/contact", pageController.submitContact);
router.post("/newsletter", pageController.newsletter);
router.post("/reviews", requireAuth, pageController.submitReview);
router.get("/invoices/:module/:id", requireAuth, pageController.downloadInvoice);

module.exports = router;
