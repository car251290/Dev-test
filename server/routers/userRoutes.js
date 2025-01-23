import express from "express";
import {
  fetchUserDetails,
  checkUserBalance,
  updateUserDetails,
  deleteUser,
} from "../controllers/userControllers.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// User Routes
router.get("/user", authenticateToken, fetchUserDetails);
router.post("/user/balance", authenticateToken, checkUserBalance);
router.put("/user", authenticateToken, updateUserDetails);
router.delete("/user", authenticateToken, deleteUser);

export default router;