import express from "express";
import {  
  createUser,
  loginUser,
  logoutCurrentUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  loginAdmin,
  logoutAdmin,
  getAllUsers,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";
import { authenticate, authenticateAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* 
  ======================
  User Authentication Routes
  ======================
*/

// Register a new user
router.post("/", createUser);

// Login user
router.post("/auth", loginUser);

// Logout user
router.post("/logout", logoutCurrentUser);

// Get and update user profile (protected)
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

/* 
  ======================
  Admin Authentication Routes
  ======================
*/

// Admin login
router.post("/admin/login", loginAdmin);

// Admin logout
router.post("/admin/logout", logoutAdmin);

/* 
  ======================
  Admin User Management Routes (protected by admin authentication)
  ======================
*/

// Get all users
router.get("/", authenticateAdmin, getAllUsers);

// Get, update, delete a user by ID
router
  .route("/admin/users/:id")
  .get(authenticateAdmin, getUserById)
  .put(authenticateAdmin, updateUserById)
  .delete(authenticateAdmin, deleteUserById);

export default router;
