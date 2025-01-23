import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; // Import the cors package
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from "jsonwebtoken";

const app = express();
const PORT = 3000;
const SECRET_KEY = "123@"; // Use a secure key in production

// Enable CORS
app.use(cors());

// Database Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = path.join(__dirname, "data/users.json");
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { users: [] }); // Provide default data

// Middleware
app.use(bodyParser.json());

// Load database before handling requests
app.use(async (req, res, next) => {
  await db.read();
  db.data = db.data || { users: [] }; // Default structure if file is empty
  next();
});

// Login Endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = db.data.users.find(user => user.email === email && user.password === password);

  if (user) {
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// Middleware to Verify Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user; // Attach user details to the request object
    next();
  });
};
// routers

// Fetch User Details
app.get("/user", authenticateToken, async (req, res) => {
  const user = db.data.users.find(user => user._id === req.user.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});


// Check Account Balance
app.get("/user/balance", authenticateToken, async (req, res) => {
  const user = db.data.users.find(user => user._id === req.user.id);
  if (user) {
    const balance = parseFloat(user.balance.replace(/[$,]/g, ""));
    res.json({ balance: balance.toFixed(2) });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
app.post("/user/balance", authenticateToken, async (req, res) => {
  const { password } = req.body;
  const user = db.data.users.find(user => user._id === req.user.id);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const balance = parseFloat(user.balance.replace(/[$,]/g, ""));
  res.json({ balance: balance.toFixed(2) });
});

// Update User Details
app.put("/user", authenticateToken, async (req, res) => {
  const user = db.data.users.find(user => user._id === req.user.id);
  if (user) {
    Object.assign(user, req.body); 
    await db.write(); 
    res.json({ message: "User details updated successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Delete User
app.delete("/user", authenticateToken, async (req, res) => {
  const userIndex = db.data.users.findIndex(user => user._id === req.user.id);
  if (userIndex !== -1) {
    db.data.users.splice(userIndex, 1);
    await db.write();
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
// port 300 server

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});