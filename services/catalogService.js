const demo = require("../config/demoData");
const {
  Room,
  FoodItem,
  Table,
  Membership,
  SpaService,
  Event,
  Testimonial
} = require("../models");

const roomFromDb = (room) => ({
  name: room.name,
  slug: room.slug,
  category: room.category,
  price: room.basePrice,
  seasonalPrice: room.seasonalPricing?.[0]?.price || room.basePrice,
  discount: room.discountRules?.[0]?.percentage || 0,
  rating: room.ratingAverage || 4.8,
  size: room.roomSize,
  capacity: room.capacity,
  image: room.images?.[0],
  gallery: room.images || [],
  videoUrl: room.videoUrl,
  description: room.description,
  amenities: room.amenities || [],
  availability: "Live availability",
  tour: room.tourUrl || `${room.name} Tour`
});

const foodFromDb = (food) => ({
  name: food.name,
  category: food.category,
  price: food.price,
  calories: food.calories,
  rating: food.ratingAverage || 4.8,
  image: food.image,
  allergens: food.allergens || [],
  ingredients: food.ingredients || [],
  chefNote: food.chefNotes
});

const getRooms = async (app) => {
  if (!app.locals.dbReady) return demo.rooms;
  const rooms = await Room.find({ isPublished: true }).sort({ basePrice: 1 }).lean();
  return rooms.length ? rooms.map(roomFromDb) : demo.rooms;
};

const getRoom = async (app, slug) => {
  if (!app.locals.dbReady) return demo.rooms.find((room) => room.slug === slug);
  const room = await Room.findOne({ slug, isPublished: true }).lean();
  return room ? roomFromDb(room) : demo.rooms.find((item) => item.slug === slug);
};

const getFoodItems = async (app) => {
  if (!app.locals.dbReady) return demo.foodItems;
  const foods = await FoodItem.find({ isAvailable: true }).sort({ category: 1, price: 1 }).lean();
  return foods.length ? foods.map(foodFromDb) : demo.foodItems;
};

const getTables = async (app) => {
  if (!app.locals.dbReady) return demo.tableMap;
  const tables = await Table.find({}).sort({ code: 1 }).lean();
  return tables.length ? tables : demo.tableMap;
};

const getMemberships = async (app) => {
  if (!app.locals.dbReady) return demo.memberships;
  const memberships = await Membership.find({ isActive: true }).sort({ price: 1 }).lean();
  if (!memberships.length) return demo.memberships;
  return memberships.map((item) => ({
    name: item.tier,
    price: item.price,
    points: item.pointsAwarded,
    benefits: item.benefits
  }));
};

const getSpaServices = async (app) => {
  if (!app.locals.dbReady) return demo.spaServices;
  const services = await SpaService.find({ isActive: true }).sort({ price: 1 }).lean();
  if (!services.length) return demo.spaServices;
  return services.map((item) => ({
    name: item.name,
    duration: item.durationMinutes,
    price: item.price,
    image: item.image,
    inclusions: item.inclusions || []
  }));
};

const getEvents = async (app) => {
  if (!app.locals.dbReady) return demo.events;
  const events = await Event.find({ isActive: true }).sort({ basePrice: 1 }).lean();
  if (!events.length) return demo.events;
  return events.map((item) => ({
    name: item.name,
    price: item.basePrice,
    capacity: item.capacity,
    image: item.image,
    features: item.packageFeatures || []
  }));
};

const getTestimonials = async (app) => {
  if (!app.locals.dbReady) return demo.testimonials;
  const testimonials = await Testimonial.find({ isPublished: true }).sort({ sortOrder: 1 }).lean();
  return testimonials.length ? testimonials : demo.testimonials;
};

module.exports = {
  demo,
  getRooms,
  getRoom,
  getFoodItems,
  getTables,
  getMemberships,
  getSpaServices,
  getEvents,
  getTestimonials
};
