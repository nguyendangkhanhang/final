import express from "express";
import {  
    createUser,
    loginUser,
    logoutCurrentUser,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteUserById,
    getUserById,
    updateUserById,
    loginAdmin
} from "../controllers/userController.js";
import { authenticate, authenticateAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", createUser); // Đăng ký user
router.post("/auth", loginUser); // Đăng nhập user (Không cho admin vào)
router.post("/logout", logoutCurrentUser); // Đăng xuất
router.route("/profile").get(authenticate, getCurrentUserProfile).put(authenticate, updateCurrentUserProfile);

router.post("/admin/login", loginAdmin); // Đăng nhập admin
router.get("/", authenticateAdmin, getAllUsers);
router.route("/admin/users/:id")
  .delete(authenticateAdmin, deleteUserById)
  .get(authenticateAdmin, getUserById)
  .put(authenticateAdmin, updateUserById);

export default router;
