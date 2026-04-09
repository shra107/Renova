const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(express.static(__dirname));
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "shraddha",
  database: "renova"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed ❌");
  } else {
    console.log("MySQL connected successfully ✅");
    // Ensure role column exists
    db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'", () => {});
  }
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/test", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;

  const sql = "INSERT INTO messages (name, message) VALUES (?, ?)";

  db.query(sql, [name, message], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error saving data ❌");
    } else {
      res.send("Data saved in database ✅");
    }
  });
});
app.get("/messages", (req, res) => {
  const sql = "SELECT * FROM messages";

  db.query(sql, (err, result) => {
    if (err) {
      res.send("Error fetching data ❌");
    } else {
      res.json(result);
    }
  });
});
app.post("/api/bookings", (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    event_date,
    time_slot,
    theme_name,
  } = req.body;

  const sql = `
    INSERT INTO bookings 
    (name,email,phone, address, event_date, time_slot, theme_name, payment_status, order_status)
    VALUES (?, ?,?, ?, ?, ?, ?, 'Pending', 'Pending')
  `;

  db.query(
    sql,
    [name,email, phone, address, event_date, time_slot, theme_name],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false });
      }

      res.json({ success: true });
    }
  );
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login-final.html"));
});
app.get("/renova", (req, res) => {
  res.sendFile(path.join(__dirname, "renova final.html"));
});
// GET ALL BOOKINGS (Admin)
app.get("/api/admin/bookings", (req, res) => {
  db.query("SELECT * FROM bookings ORDER BY id DESC", (err, results) => {
    if (err) return res.json({ success: false });
    res.json(results);
  });
});

// Admin Accept / Reject Booking
app.put("/api/admin/update-booking/:id", (req, res) => {
  const { action } = req.body;
  let payment_status = "Pending";
  let order_status = "Pending";

  if (action === "accept") {
    payment_status = "Paid";
    order_status = "Confirmed";
  } else if (action === "reject") {
    order_status = "Rejected";
  }

  db.query(
    "UPDATE bookings SET payment_status=?, order_status=? WHERE id=?",
    [payment_status, order_status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Booking updated successfully" });
    }
  );
});
app.put("/api/admin/bookings/:id", (req, res) => {
  const bookingId = req.params.id;
  const { order_status, payment_status } = req.body;

  const sql = `
    UPDATE bookings 
    SET order_status = ?, payment_status = ?
    WHERE id = ?
  `;

  db.query(sql, [order_status, payment_status, bookingId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Update failed" });
    }

    res.json({ message: "Booking updated successfully" });
  });
});
// GET ALL USERS
app.get("/api/admin/users", (req, res) => {
  db.query("SELECT id, name, email, phone FROM users", (err, results) => {
    if (err) return res.json({ success: false });
    res.json(results);
  });
});

// Setup: adds role column + creates admin user
app.get("/create-admin", (req, res) => {
  db.query("ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user'", () => {
    // ignore error if column already exists
    db.query(
      `INSERT INTO users (name, email, phone, password, role)
       VALUES ('Admin', 'admin@renova.com', '9999999999', 'admin123', 'admin')
       ON DUPLICATE KEY UPDATE role='admin', password='admin123'`,
      (err) => {
        if (err) return res.send("Error: " + err.message);
        res.send("✅ Done!<br><b>Email:</b> admin@renova.com<br><b>Password:</b> admin123<br><br><a href='/login'>👉 Go to Login</a>");
      }
    );
  });
});
app.get("/api/user-bookings/:email", (req, res) => {
  db.query(
    "SELECT * FROM bookings WHERE email = ? ORDER BY id DESC",
    [req.params.email],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});
app.post("/api/register", (req, res) => {
  const { name, email, phone, password } = req.body;

  const checkQuery = "SELECT * FROM users WHERE email = ?";
  
  db.query(checkQuery, [email], (err, result) => {
    if (err) return res.status(500).json({ success: false });

    if (result.length > 0) {
      return res.json({ success: false, message: "Email exists" });
    }

    const insertQuery = `
      INSERT INTO users (name, email, phone, password)
      VALUES (?, ?, ?, ?)
    `;

    db.query(insertQuery, [name, email, phone, password], (err) => {
      if (err) return res.status(500).json({ success: false });

      res.json({ success: true });
    });
  });
});
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false });
        }
        if (result.length > 0) {
            const user = result[0];
            return res.json({
                success: true,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role || "user"
            });
        } else {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    });
});     
app.listen(3000, () => {
  console.log("Server running");
});
