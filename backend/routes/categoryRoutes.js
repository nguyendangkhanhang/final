import express from "express";
const router = express.Router();

import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";

import { authenticate, authenticateAdmin } from "../middlewares/authMiddleware.js";

router.route("/").post(authenticateAdmin, createCategory);
router.route("/:categoryId").put(authenticateAdmin, updateCategory);
router.route("/:categoryId").delete(authenticateAdmin, removeCategory);

router.route("/categories").get(listCategory);
router.route("/:id").get(readCategory);

export default router;
