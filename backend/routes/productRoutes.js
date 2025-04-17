import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// controllers
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  updateProductQuantity,
} from "../controllers/productController.js";
import { authenticate, authenticateAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

router.route("/").get(fetchProducts).post(authenticateAdmin, formidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts);
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticateAdmin, formidable(), updateProductDetails)
  .delete(authenticateAdmin, removeProduct);

router.route("/filtered-products").post(filterProducts);
router.route("/:id/quantity").put(authenticate, updateProductQuantity);

export default router;
