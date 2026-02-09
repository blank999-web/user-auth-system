const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db.connect");

const router = express.Router();
const JWT_SECRET = "my_super_secret_key";


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Access token required" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  });
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};


async function createUserHandler(req, res) {
  const { username, password, role, department } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users (username, password, role, department) VALUES (?, ?, ?, ?)";

    db.execute(query, [username, hashedPassword, role, department], (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Username already exists" });
        }
        return res.status(500).json({ message: "Database error" });
      }

      
      const token = jwt.sign(
        { username, role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(201).json({
        message: "User registered successfully",
        token
      });
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

router.post("/register", createUserHandler);
router.post("/users", createUserHandler);


router.post("/login", (req, res) => {
  const { username, password, token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Registration token required" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const query = "SELECT * FROM users WHERE username = ?";

  db.execute(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

   
    if (decoded.role !== user.role) {
      return res.status(403).json({ message: "Role mismatch detected" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

  
    const loginToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
        department: user.department
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token: loginToken
    });
  });
});


router.get("/users", authenticateToken, adminOnly, (req, res) => {
  const query = "SELECT id, username, role, department FROM users";

  db.execute(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    return res.json({ users: results });
  });
});

module.exports = router;
