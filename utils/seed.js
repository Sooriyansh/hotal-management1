require("dotenv").config();

const mongoose = require("mongoose");
const slugify = require("slugify");
const demo = require("../config/demoData");
const {
  User,
  Room,
  Restaurant,
  Table,
  FoodItem,
  Membership,
  SpaService,
  Event,
  Coupon,
  Gallery,
  Testimonial,
  Setting
} = require("../models");

const slug = (value) => slugify(value, { lower: true, strict: true });

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required for seeding");
  }

  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([
    User.deleteMany({}),
    Room.deleteMany({}),
    Restaurant.deleteMany({}),
    Table.deleteMany({}),
    FoodItem.deleteMany({}),
    Membership.deleteMany({}),
    SpaService.deleteMany({}),
    Event.deleteMany({}),
    Coupon.deleteMany({}),
    Gallery.deleteMany({}),
    Testimonial.deleteMany({}),
    Setting.deleteMany({})
  ]);

  await User.create([
    {
      name: "Aurelia Admin",
      email: "admin@grandluxury.example",
      password: "demo1234",
      role: "Super Admin",
      membershipTier: "Diamond",
      loyaltyPoints: 52000
    },
    {
      name: "Demo Guest",
      email: "customer@grandluxury.example",
      password: "demo1234",
      role: "Customer",
      membershipTier: "Platinum",
      loyaltyPoints: 18420
    }
  ]);

  await Room.create(
    demo.rooms.map((room) => ({
      name: room.name,
      slug: room.slug,
      category: room.category,
      description: room.description,
      images: room.gallery,
      videoUrl: room.videoUrl,
      amenities: room.amenities,
      basePrice: room.price,
      seasonalPricing: [{ label: "Peak Season", price: room.seasonalPrice }],
      discountRules: room.discount ? [{ code: "SUITESPA15", percentage: room.discount }] : [],
      capacity: room.capacity,
      roomSize: room.size,
      ratingAverage: room.rating,
      ratingCount: 120,
      tourUrl: room.tour
    }))
  );

  const restaurant = await Restaurant.create({
    name: "Grand Luxury Restaurant",
    slug: "grand-luxury-restaurant",
    description: "Chef-led fine dining with QR ordering, table reservations, and live kitchen tracking.",
    images: [demo.images.restaurant, demo.images.food],
    videoUrl: demo.heroVideo,
    cuisineTypes: demo.menuCategories,
    openingHours: [
      { day: "Daily", opens: "07:00", closes: "23:30" }
    ],
    reservationRules: {
      depositRequired: false,
      maxPartySize: 12,
      cancellationWindowHours: 6
    }
  });

  await Table.create(
    demo.tableMap.map((table) => ({
      ...table,
      restaurant: restaurant._id,
      qrCodeUrl: `/restaurant?table=${table.code}`
    }))
  );

  await FoodItem.create(
    demo.foodItems.map((item) => ({
      name: item.name,
      slug: slug(item.name),
      category: item.category,
      image: item.image,
      ingredients: item.ingredients,
      calories: item.calories,
      allergens: item.allergens,
      price: item.price,
      chefNotes: item.chefNote,
      ratingAverage: item.rating,
      ratingCount: 80
    }))
  );

  await Membership.create(
    demo.memberships.map((tier) => ({
      tier: tier.name,
      price: tier.price,
      pointsAwarded: tier.points,
      benefits: tier.benefits,
      diningDiscount: tier.name === "Silver" ? 5 : 10,
      spaCredits: tier.name === "Platinum" ? 150 : tier.name === "Diamond" ? 400 : 0
    }))
  );

  await SpaService.create(
    demo.spaServices.map((service) => ({
      name: service.name,
      slug: slug(service.name),
      image: service.image,
      durationMinutes: service.duration,
      price: service.price,
      inclusions: service.inclusions,
      privateSuite: service.name.includes("Suite")
    }))
  );

  await Event.create(
    demo.events.map((event) => ({
      name: event.name,
      slug: slug(event.name),
      category: event.name.includes("Wedding")
        ? "Wedding"
        : event.name.includes("Corporate")
          ? "Corporate"
          : "Birthday",
      image: event.image,
      capacity: event.capacity,
      basePrice: event.price,
      packageFeatures: event.features
    }))
  );

  await Coupon.create(
    demo.offers.map((offer) => ({
      code: offer.code,
      description: offer.name,
      discountType: "Percentage",
      discountValue: offer.discount,
      appliesTo: "All",
      endsAt: new Date(Date.now() + offer.endsInHours * 60 * 60 * 1000)
    }))
  );

  await Gallery.create(
    Object.entries(demo.images).map(([title, imageUrl], index) => ({
      title,
      imageUrl,
      category: "Homepage",
      sortOrder: index
    }))
  );

  await Testimonial.create(demo.testimonials);

  await Setting.create([
    {
      key: "homepage.hero",
      group: "Homepage",
      value: {
        headline: "Grand Luxury Hotel & Restaurant",
        tagline: "Experience Luxury Beyond Imagination",
        videoUrl: demo.heroVideo
      }
    },
    {
      key: "system.currency",
      group: "System",
      value: "USD"
    }
  ]);

  console.log("Grand Luxury demo data seeded");
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
