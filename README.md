# Grand Luxury Hotel & Restaurant

A cinematic Node.js, Express.js, EJS, MongoDB, Mongoose, Tailwind CSS, GSAP, JWT, and Socket.io hospitality management platform.

## What Is Included

- Luxury public website with video hero, room booking, restaurant reservations, food cart, virtual tours, concierge chat, memberships, spa, events, offers, contact, and newsletter.
- JWT cookie authentication with login, register, forgot password token preparation, profile management, avatar URL support, and role based access control.
- Admin dashboard for revenue, hotel revenue, restaurant revenue, occupancy, booking trends, customer growth, memberships, order statistics, and management modules.
- Customer dashboard for bookings, restaurant reservations, food orders, membership, reward points, invoices, wishlist, notifications, and profile links.
- Mongoose schemas for all requested collections: users, rooms, roomBookings, restaurants, tables, tableBookings, foodItems, foodOrders, memberships, membershipTransactions, spaServices, spaBookings, events, eventBookings, payments, coupons, reviews, galleries, testimonials, notifications, blogs, contacts, newsletters, and settings.
- Socket.io hooks for live notifications, room/table availability, kitchen order tracking, and concierge events.
- Demo data fallback when MongoDB is not connected, so the UI remains usable immediately.

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
