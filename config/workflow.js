const models = require("../models");

const ACTIONS = ["create", "read", "update", "delete", "approve", "reject", "assign", "complete", "export"];

const ROLE_LABELS = [
  "Customer",
  "Hotel Manager",
  "Restaurant Manager",
  "Chef",
  "Waiter",
  "Spa Manager",
  "Receptionist",
  "Event Manager",
  "Super Admin"
];

const field = (name, label, type = "text", options = []) => ({ name, label, type, options });

const MODULES = {
  users: {
    label: "Users",
    model: models.User,
    icon: "users",
    ownerField: "_id",
    fields: [
      field("name", "Name"),
      field("email", "Email", "email"),
      field("password", "Password", "password"),
      field("phone", "Phone"),
      field("role", "Role", "select", ROLE_LABELS),
      field("membershipTier", "Membership", "select", ["None", "Silver", "Gold", "Platinum", "Diamond"]),
      field("loyaltyPoints", "Loyalty Points", "number"),
      field("isActive", "Active", "boolean")
    ],
    listFields: ["name", "email", "role", "membershipTier", "isActive"]
  },
  rooms: {
    label: "Rooms",
    model: models.Room,
    icon: "bed-double",
    fields: [
      field("name", "Name"),
      field("slug", "Slug"),
      field("category", "Category", "select", ["Deluxe", "Executive", "Family", "Suite", "Presidential"]),
      field("basePrice", "Base Price", "number"),
      field("capacity", "Capacity", "number"),
      field("roomSize", "Room Size"),
      field("amenities", "Amenities", "tags"),
      field("isPublished", "Published", "boolean")
    ],
    listFields: ["name", "category", "basePrice", "capacity", "isPublished"]
  },
  "room-bookings": {
    label: "Room Bookings",
    model: models.RoomBooking,
    icon: "calendar-check",
    ownerField: "user",
    fields: [
      field("bookingNo", "Booking No"),
      field("guestName", "Guest Name"),
      field("email", "Email", "email"),
      field("phone", "Phone"),
      field("checkIn", "Check In", "date"),
      field("checkOut", "Check Out", "date"),
      field("guests", "Guests", "number"),
      field("roomCategory", "Room Category"),
      field("assignedRoom", "Assigned Room"),
      field("status", "Status", "select", ["Pending", "Confirmed", "Checked In", "Checked Out", "Cancelled", "Refunded"]),
      field("total", "Total", "number")
    ],
    listFields: ["bookingNo", "guestName", "roomCategory", "checkIn", "checkOut", "status", "total"],
    statusActions: {
      approve: { status: "Confirmed", title: "Booking approved" },
      reject: { status: "Cancelled", title: "Booking rejected" },
      assign: { status: "Confirmed", title: "Room assigned" },
      "check-in": { status: "Checked In", title: "Guest checked in" },
      complete: { status: "Checked Out", title: "Guest checked out" },
      cancel: { status: "Cancelled", title: "Booking cancelled" }
    }
  },
  "menu-items": {
    label: "Menu Items",
    model: models.FoodItem,
    icon: "utensils",
    fields: [
      field("name", "Name"),
      field("slug", "Slug"),
      field("category", "Category", "select", ["Breakfast", "Lunch", "Dinner", "Indian", "Chinese", "Italian", "Desserts", "Beverages"]),
      field("price", "Price", "number"),
      field("calories", "Calories", "number"),
      field("ingredients", "Ingredients", "tags"),
      field("allergens", "Allergens", "tags"),
      field("chefNotes", "Chef Notes", "textarea"),
      field("isVegetarian", "Vegetarian", "boolean"),
      field("isAvailable", "Available", "boolean")
    ],
    listFields: ["name", "category", "price", "isVegetarian", "isAvailable"]
  },
  tables: {
    label: "Tables",
    model: models.Table,
    icon: "table-2",
    fields: [
      field("code", "Code"),
      field("seats", "Seats", "number"),
      field("zone", "Zone"),
      field("status", "Status", "select", ["Available", "Reserved", "Occupied", "Cleaning", "Blocked"])
    ],
    listFields: ["code", "zone", "seats", "status"]
  },
  "table-bookings": {
    label: "Table Reservations",
    model: models.TableBooking,
    icon: "calendar-days",
    ownerField: "user",
    fields: [
      field("bookingNo", "Booking No"),
      field("guestName", "Guest Name"),
      field("email", "Email", "email"),
      field("phone", "Phone"),
      field("reservationDate", "Date", "date"),
      field("reservationTime", "Time"),
      field("guests", "Guests", "number"),
      field("mealType", "Meal Type", "select", ["Breakfast", "Lunch", "Dinner", "Chef Table", "High Tea"]),
      field("status", "Status", "select", ["Pending", "Confirmed", "Seated", "Completed", "Cancelled"])
    ],
    listFields: ["bookingNo", "guestName", "reservationDate", "reservationTime", "mealType", "status"],
    statusActions: {
      approve: { status: "Confirmed", title: "Reservation approved" },
      reject: { status: "Cancelled", title: "Reservation rejected" },
      assign: { status: "Confirmed", title: "Table assigned" },
      complete: { status: "Completed", title: "Reservation completed" },
      cancel: { status: "Cancelled", title: "Reservation cancelled" }
    }
  },
  orders: {
    label: "Food Orders",
    model: models.FoodOrder,
    icon: "chef-hat",
    ownerField: "user",
    fields: [
      field("orderNo", "Order No"),
      field("orderType", "Order Type", "select", ["Table Order", "Room Service", "Online Delivery"]),
      field("kitchenStatus", "Kitchen Status", "select", ["Received", "Pending", "Accepted", "Preparing", "Plating", "Ready", "Served", "Delivered", "Cancelled"]),
      field("subtotal", "Subtotal", "number"),
      field("gst", "GST", "number"),
      field("total", "Total", "number")
    ],
    listFields: ["orderNo", "orderType", "kitchenStatus", "subtotal", "total"],
    statusActions: {
      approve: { kitchenStatus: "Accepted", title: "Order accepted" },
      accept: { kitchenStatus: "Accepted", title: "Order accepted" },
      preparing: { kitchenStatus: "Preparing", title: "Order preparing" },
      ready: { kitchenStatus: "Ready", title: "Order ready" },
      complete: { kitchenStatus: "Served", title: "Order served" },
      reject: { kitchenStatus: "Cancelled", title: "Order cancelled" },
      cancel: { kitchenStatus: "Cancelled", title: "Order cancelled" }
    }
  },
  "spa-services": {
    label: "Spa Services",
    model: models.SpaService,
    icon: "sparkles",
    fields: [
      field("name", "Name"),
      field("slug", "Slug"),
      field("durationMinutes", "Duration", "number"),
      field("price", "Price", "number"),
      field("therapistRoles", "Therapist Roles", "tags"),
      field("inclusions", "Inclusions", "tags"),
      field("privateSuite", "Private Suite", "boolean"),
      field("isActive", "Active", "boolean")
    ],
    listFields: ["name", "durationMinutes", "price", "privateSuite", "isActive"]
  },
  "spa-bookings": {
    label: "Spa Bookings",
    model: models.SpaBooking,
    icon: "flower-2",
    ownerField: "user",
    fields: [
      field("bookingNo", "Booking No"),
      field("guestName", "Guest Name"),
      field("scheduledAt", "Scheduled At", "datetime-local"),
      field("suitePreference", "Suite"),
      field("amount", "Amount", "number"),
      field("status", "Status", "select", ["Pending", "Confirmed", "Completed", "Cancelled"])
    ],
    listFields: ["bookingNo", "guestName", "scheduledAt", "suitePreference", "amount", "status"],
    statusActions: {
      approve: { status: "Confirmed", title: "Spa booking approved" },
      reject: { status: "Cancelled", title: "Spa booking rejected" },
      assign: { status: "Confirmed", title: "Therapist assigned" },
      complete: { status: "Completed", title: "Spa booking completed" },
      cancel: { status: "Cancelled", title: "Spa booking cancelled" }
    }
  },
  events: {
    label: "Event Packages",
    model: models.Event,
    icon: "party-popper",
    fields: [
      field("name", "Name"),
      field("slug", "Slug"),
      field("category", "Category", "select", ["Wedding", "Corporate", "Birthday", "Conference", "Private Dining"]),
      field("capacity", "Capacity", "number"),
      field("basePrice", "Base Price", "number"),
      field("packageFeatures", "Features", "tags"),
      field("isActive", "Active", "boolean")
    ],
    listFields: ["name", "category", "capacity", "basePrice", "isActive"]
  },
  "event-bookings": {
    label: "Event Bookings",
    model: models.EventBooking,
    icon: "calendar-range",
    ownerField: "user",
    fields: [
      field("bookingNo", "Booking No"),
      field("guestName", "Guest Name"),
      field("eventDate", "Event Date", "date"),
      field("guests", "Guests", "number"),
      field("customQuote", "Quote", "number"),
      field("depositAmount", "Deposit", "number"),
      field("status", "Status", "select", ["Inquiry", "Quoted", "Confirmed", "Completed", "Cancelled"])
    ],
    listFields: ["bookingNo", "guestName", "eventDate", "guests", "customQuote", "status"],
    statusActions: {
      approve: { status: "Confirmed", title: "Event approved" },
      reject: { status: "Cancelled", title: "Event rejected" },
      quote: { status: "Quoted", title: "Event quote ready" },
      assign: { status: "Confirmed", title: "Event hall assigned" },
      complete: { status: "Completed", title: "Event completed" },
      cancel: { status: "Cancelled", title: "Event booking cancelled" }
    }
  },
  payments: {
    label: "Payments",
    model: models.Payment,
    icon: "credit-card",
    ownerField: "user",
    fields: [
      field("paymentNo", "Payment No"),
      field("amount", "Amount", "number"),
      field("currency", "Currency"),
      field("method", "Method", "select", ["Card", "UPI", "Net Banking", "Wallet", "Cash", "UI Demo"]),
      field("status", "Status", "select", ["Pending", "Authorized", "Paid", "Failed", "Refunded"]),
      field("invoiceNo", "Invoice No")
    ],
    listFields: ["paymentNo", "amount", "currency", "method", "status", "invoiceNo"],
    statusActions: {
      approve: { status: "Paid", title: "Payment successful" },
      reject: { status: "Failed", title: "Payment failed" },
      complete: { status: "Paid", title: "Payment completed" }
    }
  },
  reviews: {
    label: "Reviews",
    model: models.Review,
    icon: "star",
    ownerField: "user",
    fields: [
      field("userName", "User Name"),
      field("targetType", "Target", "select", ["Room", "FoodItem", "Restaurant", "SpaService", "Event"]),
      field("rating", "Rating", "number"),
      field("comment", "Comment", "textarea"),
      field("isApproved", "Approved", "boolean")
    ],
    listFields: ["userName", "targetType", "rating", "comment", "isApproved"],
    statusActions: {
      approve: { isApproved: true, title: "Review approved" },
      reject: { isApproved: false, title: "Review rejected" }
    }
  },
  notifications: {
    label: "Notifications",
    model: models.Notification,
    icon: "bell",
    ownerField: "user",
    fields: [
      field("role", "Role"),
      field("title", "Title"),
      field("message", "Message", "textarea"),
      field("type", "Type", "select", ["Booking", "Order", "Payment", "Membership", "System", "Concierge"]),
      field("severity", "Severity", "select", ["Success", "Warning", "Info", "Error"])
    ],
    listFields: ["title", "message", "role", "type", "severity", "readAt"]
  },
  "activity-logs": {
    label: "Activity Logs",
    model: models.ActivityLog,
    icon: "history",
    fields: [],
    listFields: ["actorName", "actorRole", "action", "module", "targetLabel", "createdAt"],
    readOnly: true
  }
};

const ROLE_PERMISSIONS = {
  Customer: {
    "room-bookings": ["create", "read", "update", "delete"],
    "table-bookings": ["create", "read", "update", "delete"],
    orders: ["create", "read", "update", "delete"],
    "spa-bookings": ["create", "read", "update", "delete"],
    "event-bookings": ["create", "read", "update", "delete"],
    reviews: ["create", "read", "update", "delete"],
    notifications: ["read", "update", "delete"],
    payments: ["read", "export"]
  },
  "Hotel Manager": {
    rooms: ACTIONS,
    "room-bookings": ACTIONS,
    users: ["read", "update", "export"],
    notifications: ["read", "update"],
    "activity-logs": ["read", "export"]
  },
  "Restaurant Manager": {
    "menu-items": ACTIONS,
    tables: ACTIONS,
    "table-bookings": ACTIONS,
    orders: ACTIONS,
    notifications: ["read", "update"],
    "activity-logs": ["read", "export"]
  },
  Chef: {
    orders: ["read", "update", "approve", "reject", "complete"],
    "menu-items": ["create", "read", "update"],
    notifications: ["read", "update"]
  },
  Waiter: {
    tables: ["read", "update"],
    "table-bookings": ["read", "update", "assign", "complete"],
    orders: ["create", "read", "update", "complete"],
    payments: ["create", "read", "update", "export"],
    notifications: ["read", "update"]
  },
  "Spa Manager": {
    "spa-services": ACTIONS,
    "spa-bookings": ACTIONS,
    notifications: ["read", "update"],
    "activity-logs": ["read", "export"]
  },
  Receptionist: {
    users: ["create", "read", "update"],
    rooms: ["read", "update"],
    "room-bookings": ACTIONS,
    payments: ["create", "read", "update", "export"],
    notifications: ["read", "update"],
    "activity-logs": ["read", "export"]
  },
  "Event Manager": {
    events: ACTIONS,
    "event-bookings": ACTIONS,
    notifications: ["read", "update"],
    "activity-logs": ["read", "export"]
  },
  "Super Admin": Object.keys(MODULES).reduce((acc, slug) => {
    acc[slug] = ACTIONS;
    return acc;
  }, {})
};

const can = (role, moduleSlug, action) => {
  const allowed = ROLE_PERMISSIONS[role]?.[moduleSlug] || [];
  return allowed.includes(action);
};

const visibleModulesFor = (role) => {
  const permissions = ROLE_PERMISSIONS[role] || {};
  return Object.entries(MODULES)
    .filter(([slug]) => can(role, slug, "read"))
    .map(([slug, config]) => ({ slug, ...config, permissions: permissions[slug] || [] }));
};

module.exports = {
  ACTIONS,
  MODULES,
  ROLE_LABELS,
  ROLE_PERMISSIONS,
  can,
  visibleModulesFor
};
