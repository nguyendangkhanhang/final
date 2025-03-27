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
  // getProductRecommendations,
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
// router.route("/recommendations").post(getProductRecommendations); 
export default router;
