const heroVideo =
  "https://videos.pexels.com/video-files/2611025/2611025-uhd_2560_1440_30fps.mp4";

const images = {
  hero:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=85",
  lobby:
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=85",
  deluxe:
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1400&q=85",
  executive:
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=85",
  family:
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=85",
  suite:
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1400&q=85",
  presidential:
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=85",
  restaurant:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85",
  spa:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85",
  pool:
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=85",
  food:
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=85",
  dessert:
    "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=85",
  event:
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=85"
};

const stats = [
  { value: 50000, suffix: "+", label: "Happy Guests" },
  { value: 120, suffix: "+", label: "Luxury Rooms" },
  { value: 25, suffix: "+", label: "Awards" },
  { value: 15, suffix: "", label: "Years Experience" }
];

const rooms = [
  {
    name: "Deluxe Room",
    slug: "deluxe-room",
    category: "Deluxe",
    price: 390,
    seasonalPrice: 440,
    discount: 12,
    rating: 4.8,
    size: "430 sq ft",
    capacity: 2,
    image: images.deluxe,
    gallery: [images.deluxe, images.lobby, images.pool],
    videoUrl: heroVideo,
    description:
      "A warm private retreat with city views, marble bath, pillow menu, and evening turndown.",
    amenities: ["King bed", "Rain shower", "Smart climate", "Mini bar", "Butler chat"],
    availability: "Available tonight",
    tour: "Deluxe Room Tour"
  },
  {
    name: "Executive Room",
    slug: "executive-room",
    category: "Executive",
    price: 520,
    seasonalPrice: 610,
    discount: 10,
    rating: 4.9,
    size: "560 sq ft",
    capacity: 3,
    image: images.executive,
    gallery: [images.executive, images.restaurant, images.pool],
    videoUrl: heroVideo,
    description:
      "Business-ready luxury with a lounge desk, skyline seating, espresso bar, and priority check-in.",
    amenities: ["Club lounge", "Workspace", "Espresso", "Airport assist", "Bath ritual"],
    availability: "4 rooms left",
    tour: "Executive Room Tour"
  },
  {
    name: "Family Room",
    slug: "family-room",
    category: "Family",
    price: 640,
    seasonalPrice: 710,
    discount: 8,
    rating: 4.7,
    size: "720 sq ft",
    capacity: 5,
    image: images.family,
    gallery: [images.family, images.food, images.pool],
    videoUrl: heroVideo,
    description:
      "Two connected sleeping zones, kid amenities, dining nook, and flexible arrival support.",
    amenities: ["Two zones", "Kids welcome kit", "Sofa bed", "Dining nook", "Laundry assist"],
    availability: "Available this weekend",
    tour: "Family Room Tour"
  },
  {
    name: "Luxury Suite",
    slug: "luxury-suite",
    category: "Suite",
    price: 980,
    seasonalPrice: 1180,
    discount: 15,
    rating: 5,
    size: "980 sq ft",
    capacity: 4,
    image: images.suite,
    gallery: [images.suite, images.spa, images.restaurant],
    videoUrl: heroVideo,
    description:
      "A full suite experience with private lounge, spa credits, chef amenities, and late checkout.",
    amenities: ["Private lounge", "Spa credit", "Chef amenity", "Late checkout", "Smart key"],
    availability: "2 suites left",
    tour: "Luxury Suite Tour"
  },
  {
    name: "Presidential Suite",
    slug: "presidential-suite",
    category: "Presidential",
    price: 2400,
    seasonalPrice: 2900,
    discount: 0,
    rating: 5,
    size: "2100 sq ft",
    capacity: 6,
    image: images.presidential,
    gallery: [images.presidential, images.lobby, images.event],
    videoUrl: heroVideo,
    description:
      "The signature residence with private elevator, dining salon, personal butler, and chef table access.",
    amenities: ["Private elevator", "Butler", "Dining salon", "Terrace", "Security liaison"],
    availability: "On request",
    tour: "Presidential Suite Tour"
  }
];

const menuCategories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Indian",
  "Chinese",
  "Italian",
  "Desserts",
  "Beverages"
];

const foodItems = [
  {
    name: "Saffron Royal Thali",
    category: "Indian",
    price: 42,
    calories: 820,
    rating: 4.9,
    image: images.food,
    allergens: ["Dairy", "Nuts"],
    ingredients: ["Saffron rice", "Paneer", "Dal makhani", "Seasonal breads"],
    chefNote: "Balanced spices, served with tableside ghee."
  },
  {
    name: "Truffle Handmade Ravioli",
    category: "Italian",
    price: 38,
    calories: 610,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=85",
    allergens: ["Gluten", "Dairy"],
    ingredients: ["Ricotta", "Black truffle", "Sage butter"],
    chefNote: "Finished with aged parmesan and micro basil."
  },
  {
    name: "Imperial Dim Sum Basket",
    category: "Chinese",
    price: 34,
    calories: 520,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85",
    allergens: ["Shellfish", "Soy"],
    ingredients: ["Prawn", "Mushroom", "Chili oil", "Ginger"],
    chefNote: "Steamed to order with three signature sauces."
  },
  {
    name: "Gold Leaf Chocolate Sphere",
    category: "Desserts",
    price: 24,
    calories: 460,
    rating: 5,
    image: images.dessert,
    allergens: ["Dairy", "Egg"],
    ingredients: ["Dark chocolate", "Raspberry", "Vanilla cream"],
    chefNote: "Warm ganache pour at the table."
  }
];

const tableMap = [
  { code: "T1", seats: 2, status: "Available", zone: "Window" },
  { code: "T2", seats: 4, status: "Reserved", zone: "Garden" },
  { code: "T3", seats: 6, status: "Available", zone: "Chef Counter" },
  { code: "T4", seats: 8, status: "Occupied", zone: "Private Salon" },
  { code: "T5", seats: 4, status: "Available", zone: "Terrace" },
  { code: "T6", seats: 2, status: "Cleaning", zone: "Bar" }
];

const memberships = [
  {
    name: "Silver",
    price: 199,
    points: 2500,
    benefits: ["5% dining discount", "Member-only offers", "Express concierge"]
  },
  {
    name: "Gold",
    price: 499,
    points: 8000,
    benefits: ["Free room upgrade", "10% dining discount", "Late checkout"]
  },
  {
    name: "Platinum",
    price: 999,
    points: 18000,
    benefits: ["Priority booking", "Spa credits", "Airport transfer"]
  },
  {
    name: "Diamond",
    price: 2400,
    points: 52000,
    benefits: ["Private butler", "Chef table access", "Presidential arrival"]
  }
];

const spaServices = [
  {
    name: "Royal Renewal Massage",
    duration: 90,
    price: 220,
    image: images.spa,
    inclusions: ["Aromatherapy", "Steam ritual", "Herbal tea"]
  },
  {
    name: "Couple Private Spa Suite",
    duration: 120,
    price: 480,
    image: images.spa,
    inclusions: ["Private suite", "Rose bath", "Champagne service"]
  },
  {
    name: "Jet Lag Recovery Therapy",
    duration: 60,
    price: 170,
    image: images.spa,
    inclusions: ["Lymphatic massage", "Oxygen mist", "Sleep blend"]
  }
];

const events = [
  {
    name: "Wedding Hall Prestige",
    price: 12000,
    capacity: 420,
    image: images.event,
    features: ["Crystal ballroom", "Custom menu", "Dedicated planner", "Payment tracking"]
  },
  {
    name: "Corporate Summit",
    price: 6800,
    capacity: 180,
    image: images.lobby,
    features: ["Conference rooms", "AV suite", "Executive dining", "Breakout lounges"]
  },
  {
    name: "Birthday Private Salon",
    price: 2800,
    capacity: 60,
    image: images.restaurant,
    features: ["Private salon", "Dessert theatre", "Live music", "Custom quote"]
  }
];

const offers = [
  {
    name: "Suite + Spa Weekend",
    code: "SUITESPA15",
    discount: 15,
    endsInHours: 42,
    image: images.suite
  },
  {
    name: "Chef's Table For Two",
    code: "CHEFTABLE",
    discount: 20,
    endsInHours: 30,
    image: images.restaurant
  },
  {
    name: "Wedding Hall Prestige",
    code: "PRESTIGE10",
    discount: 10,
    endsInHours: 86,
    image: images.event
  }
];

const tourStops = [
  { name: "Reception Tour", image: images.lobby, hotspots: 5 },
  { name: "Deluxe Room Tour", image: images.deluxe, hotspots: 4 },
  { name: "Executive Room Tour", image: images.executive, hotspots: 4 },
  { name: "Family Room Tour", image: images.family, hotspots: 6 },
  { name: "Luxury Suite Tour", image: images.suite, hotspots: 7 },
  { name: "Presidential Suite Tour", image: images.presidential, hotspots: 9 },
  { name: "Restaurant Tour", image: images.restaurant, hotspots: 6 },
  { name: "Spa Tour", image: images.spa, hotspots: 5 },
  { name: "Swimming Pool Tour", image: images.pool, hotspots: 4 }
];

const testimonials = [
  {
    name: "Maya R.",
    role: "Diamond Member",
    quote: "The butler team anticipated everything before we asked.",
    rating: 5
  },
  {
    name: "Daniel K.",
    role: "Event Host",
    quote: "Our summit felt private, polished, and impossibly smooth.",
    rating: 5
  },
  {
    name: "Aarav S.",
    role: "Food Guest",
    quote: "The chef's table was theatre, technique, and comfort together.",
    rating: 5
  }
];

const analytics = {
  totalRevenue: 1284000,
  hotelRevenue: 856000,
  restaurantRevenue: 302000,
  roomOccupancy: 84,
  bookingTrends: [42, 54, 62, 70, 78, 86, 91],
  customerGrowth: 18,
  membershipStatistics: { silver: 940, gold: 510, platinum: 210, diamond: 64 },
  orderStatistics: { pending: 24, preparing: 18, served: 162, delivered: 88 }
};

const dashboard = {
  bookings: [
    { id: "RB-2401", name: "Luxury Suite", date: "2026-06-20", status: "Confirmed", total: 1960 },
    { id: "RB-2402", name: "Chef's Table", date: "2026-06-21", status: "Pending", total: 210 },
    { id: "RB-2403", name: "Royal Renewal Massage", date: "2026-06-22", status: "Confirmed", total: 220 }
  ],
  invoices: [
    { id: "INV-8810", amount: 1960, status: "Paid" },
    { id: "INV-8811", amount: 210, status: "Due" }
  ],
  notifications: [
    "Your suite upgrade request is under review.",
    "Diamond chef table slots opened for Friday.",
    "Spa credit expires in 12 days."
  ]
};

module.exports = {
  heroVideo,
  images,
  stats,
  rooms,
  menuCategories,
  foodItems,
  tableMap,
  memberships,
  spaServices,
  events,
  offers,
  tourStops,
  testimonials,
  analytics,
  dashboard
};
