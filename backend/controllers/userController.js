import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import dotenv from "dotenv";

dotenv.config();


// CHỨC NĂNG CHO USER

// Đăng ký tài khoản user
const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        throw new Error("Please fill all the inputs.");
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) res.status(400).send("User already exists");
      
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        createToken(res, newUser._id);
    
        res.status(201).json({
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        });
      } catch (error) {
        res.status(400);
        throw new Error("Invalid user data");
      }
});

// Đăng nhập user (Chặn admin đăng nhập ở đây)
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.isAdmin) {
      res.status(403).json({ message: "Admins cannot log in here." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (isPasswordValid) {
      createToken(res, existingUser._id);
      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      });
      return;
    }
  }

  res.status(401).json({ message: "Invalid email or password" });
});

// Đăng xuất user
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// Lấy thông tin profile user
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

// Cập nhật profile user
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


// CHỨC NĂNG CHO ADMIN


// Đăng nhập Admin 
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = createToken(res, "admin123"); // Fake userId cho admin

    return res.status(200).json({
      _id: "admin123",
      username: "Admin",
      email: process.env.ADMIN_EMAIL,
      isAdmin: true,
      token, // 🔥 Thêm token vào response JSON
    });
  }

  res.status(403).json({ message: "Access Denied. Admins only." });
});

// Lấy danh sách tất cả users (Chỉ Admin mới có quyền)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// Xóa user theo ID (Không thể xóa admin)
const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

// Lấy thông tin user theo ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Cập nhật thông tin user (Chỉ admin mới có quyền)
const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { 
  createUser, loginUser, logoutCurrentUser, getCurrentUserProfile, updateCurrentUserProfile,
  loginAdmin, getAllUsers, deleteUserById, getUserById, updateUserById
};
