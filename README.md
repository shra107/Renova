# 🌿 RENOVA – Decorate, Reuse, Renew

> **Making celebrations sustainable, one decoration at a time.**

RENOVA is a full-stack web application for renting eco-friendly event decorations. Instead of buying single-use decorations that end up in landfills, customers can rent beautiful, reusable setups for birthdays, anniversaries, festivals, housewarmings, and baby showers — and return them after the event.

---

## 🌍 The Problem We Solve

Every year, millions of kilograms of decoration waste end up in landfills after just one event. RENOVA eliminates that by providing a **rent → use → return → reuse** cycle, keeping decorations in circulation and out of the trash.

---

## ✨ Features

### 👤 User Side
- **Browse Themes** — 3 categories with 5 themes each (15 total), each with Classic / Premium / Minimalist variations
- **Theme Details** — Image gallery, pricing, included items
- **Booking Flow** — Fill personal + event details → UPI QR payment → Order confirmation
- **My Bookings Dashboard** — Track all orders with live status (Pending / Confirmed / Rejected)
- **Profile Dropdown** — Shows name, email, phone from registration; logout button
- **Eco-Impact Page** — Deep-dive into RENOVA's Reuse, Recycle, Renew process with stats and progress bars

### 🔐 Admin Panel (Hidden)
- **Dashboard** — Live stats: total orders, confirmed, pending, active users
- **Manage Images** — View/edit theme images, add new themes per category
- **Manage Orders** — Full order table with Accept / Reject actions
- **Users Data** — All registered users with booking history modal

### 🎨 Design
- 3D interactive decoration card on the home page (mouse-hover tilt effect)
- Floating eco badges (Bio Balloons, Fresh Flowers, LED Lights)
- 3D balloon background animation on home page
- Fully responsive — mobile + desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, Tailwind CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL (mysql2) |
| Auth | localStorage-based session (role: user / admin) |
| Fonts & Icons | Google Fonts (Poppins), Font Awesome 6 |

---

## 📁 Project Structure

```
renova/
├── renova final.html   # Main single-page application
├── login-final.html    # Login & Registration page
├── index.js            # Express backend + all API routes
├── package.json        # Dependencies
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MySQL running locally

### 1. Clone the repo
```bash
git clone https://github.com/shra107/Renova.git
cd Renova
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup MySQL Database
Create a database named `renova` and run:
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(15),
  password VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(15),
  address TEXT,
  event_date DATE,
  time_slot VARCHAR(50),
  theme_name VARCHAR(200),
  payment_status VARCHAR(50),
  order_status VARCHAR(50)
);
```

### 4. Update DB credentials in `index.js`
```js
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password",  // ← change this
  database: "renova"
});
```

### 5. Run the server
```bash
node index.js
```

### 6. Open in browser
| Page | URL |
|------|-----|
| Login / Register | http://localhost:3000/login |
| Main Website | http://localhost:3000/renova |

### 7. Create Admin Account (one-time)
Visit: `http://localhost:3000/create-admin`

This creates:
- **Email:** admin@renova.com
- **Password:** admin123

Login with these credentials → Admin Panel button appears in the navbar automatically.

---

## 🎯 Theme Categories

| Category | Themes |
|----------|--------|
| 🎂 Birthday & Anniversary | Princess, Unicorn, Romantic Candle, Golden Anniversary, Kids Cartoon |
| 🎇 Festival | Diwali Floral, Ganesh Chaturthi, Navratri Garba, Makar Sankranti, Holi Color Splash |
| 🏡 Housewarming & Baby Shower | Griha Pravesh, Suhagraat, Baby Shower Teddy/Little Krishna, Welcome Baby, Rainbow/Moon & Stars |

Each theme has **3 variations**: Classic · Premium · Minimalist

---

## ♻️ The RENOVA 3R Cycle

1. **REUSE** — After every event, all items are collected, inspected, cleaned, repaired, and stored for the next booking
2. **RECYCLE** — Items beyond repair are sorted by material and sent to certified recycling facilities
3. **RENEW** — Trees are planted, natural materials are used, and worn-out fabrics are donated to local artisans

**Impact so far:** 12,000+ kg waste prevented · 98% reuse rate · 500+ events greened · 50+ trees planted

---

## 📸 Screenshots

> Home page with 3D decoration card, Eco-Impact page, Theme browsing, Booking flow, Admin panel

---

## 👩‍💻 Developer

**Shraddha** — Built with 💚 for a greener planet

---

## 📄 License

This project is for educational purposes.
