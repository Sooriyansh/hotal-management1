# Grand Luxury Hotel & Restaurant

A cinematic Node.js, Express.js, EJS, MongoDB, Mongoose, Tailwind CSS, GSAP, JWT, and Socket.io hospitality management platform.

## Key Features

### 🏨 Hotel & Room Management
- **Room Catalog:** Browse luxury rooms with detailed views.
- **Booking System:** Real-time room availability and booking management.
- **Virtual Tour:** Immersive virtual tour of the property.
- **Concierge Service:** AI-powered butler UI for guest assistance.

### 🍽️ Restaurant & Dining
- **Digital Menu:** Interactive food and beverage catalog.
- **Table Reservations:** Real-time table availability and booking.
- **Food Ordering:** Integrated food cart and ordering system.
- **Kitchen Tracking:** Live order tracking via Socket.io.

### 💆 Spa & Wellness
- **Spa Services:** Catalog of wellness and spa treatments.
- **Booking System:** Scheduling and management of spa appointments.

### 📅 Events & Offers
- **Event Management:** Quote requests and booking for special events.
- **Promotions:** Coupon system with countdown timers and special offers.

### 👥 User & Membership
- **Role-Based Access:** Separate experiences for Admin and Customers.
- **VIP Memberships:** Tiered membership levels with reward points.
- **Authentication:** Secure JWT-based login, registration, and profile management.
- **Customer Dashboard:** Manage bookings, orders, invoices, and wishlists.

### 🛠️ Administration & Operations
- **Admin Dashboard:** Comprehensive analytics for revenue, occupancy, and growth.
- **Management Modules:** Centralized control for rooms, menu, tables, and users.
- **Activity Logging:** Tracking system activities for security and auditing.
- **Notification System:** Real-time alerts via Socket.io.

### 🌐 General Features
- **Blog & News:** Content management for hotel updates and blogs.
- **Gallery & Testimonials:** Showcase of property images and guest reviews.
- **Newsletter:** Subscription system for marketing updates.
- **Contact System:** Integrated contact forms and inquiry management.
- **Demo Mode:** Fallback to demo data when MongoDB is disconnected.

## What Is Included


## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`.

Demo accounts:

- Admin: `admin@grandluxury.example` / `demo1234`
- Customer: `customer@grandluxury.example` / `demo1234`

If MongoDB is unavailable, these accounts still work in demo mode with any password that has at least 4 characters.

## MongoDB Seed

Set `MONGO_URI` in `.env`, then run:

```bash
npm run seed
```

This creates rooms, menus, tables, memberships, spa services, events, coupons, gallery items, testimonials, settings, and demo users.

## Useful Routes

- `/` home
- `/rooms` room catalog and booking
- `/restaurant` menu, table reservation, cart, and table map
- `/virtual-tour` tour viewer
- `/concierge` AI butler UI
- `/memberships` VIP tiers
- `/spa` spa booking
- `/events` event quote requests
- `/offers` coupons and countdowns
- `/dashboard` role-aware dashboard
- `/admin` management dashboard
- `/api/availability/rooms`
- `/api/availability/tables`
- `/api/menu`
- `/api/analytics`

## Notes

The payment layer is intentionally UI/demo only, matching the brief. The project is structured so a real payment gateway can be attached through the `Payment` model and booking controllers without changing the public experience.
