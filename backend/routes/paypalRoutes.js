import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Order from "../models/orderModel.js"; // Đảm bảo đúng đường dẫn

dotenv.config();

const router = express.Router();

// PayPal API URL (Sandbox)
const PAYPAL_API = "https://api-m.sandbox.paypal.com";

// Lấy PayPal Access Token
const getPayPalAccessToken = async () => {
  try {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64");

    const { data } = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return data.access_token;
  } catch (error) {
    console.error("Error getting PayPal Access Token:", error.response?.data || error.message);
    throw new Error("Cannot get Access Token from PayPal");
  }
};

// Tạo đơn hàng PayPal
router.post("/create-order", async (req, res) => {
  const { amount, orderId } = req.body;

  console.log("📦 Creating PayPal order with orderId:", orderId);

  if (!orderId) {
    return res.status(400).json({ message: "Missing orderId in request." });
  }

  try {
    const accessToken = await getPayPalAccessToken();

    const { data } = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
          },
        ],
        application_context: {
          return_url: `http://192.168.1.32:5000/api/paypal/success?orderId=${orderId}`,
          cancel_url: "http://192.168.1.32:5000/api/paypal/cancel",
          user_action: "PAY_NOW",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("✅ PayPal Order Created:", data);

    const approvalUrl = data.links?.find(link => link.rel === "approve")?.href;

    if (!approvalUrl) {
      throw new Error("Cannot find approvalUrl from PayPal API");
    }

    res.json({ orderID: data.id, approvalUrl });
  } catch (error) {
    console.error("Error creating PayPal order:", error.response?.data || error.message);
    res.status(500).json({ message: "Error creating PayPal order" });
  }
});

// Xử lý callback sau khi thanh toán thành công
router.get("/success", async (req, res) => {
  const { token, orderId } = req.query;

  console.log("📥 PayPal callback /success with token:", token);
  console.log("📥 orderId from query:", orderId);

  if (!token || !orderId) {
    return res.status(400).send("Missing token or orderId");
  }

  try {
    const accessToken = await getPayPalAccessToken();

    const { data } = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("✅ Payment successful:", data);

    const order = await Order.findById(orderId);

    if (order) {
      order.isPaid = true;
      order.paidAt = data.update_time;
      order.paymentResult = {
        id: data.id,
        status: data.status,
        email_address: data.payer.email_address,
      };
      await order.save();

      res.send("Payment successful! Thank you for your purchase.");
    } else {
      res.status(404).send("Order not found.");
    }
  } catch (error) {
    console.error("❌ Error confirming payment:", error.response?.data || error.message);
    res.status(500).send("Error confirming payment.");
  }
});

// Khi người dùng huỷ thanh toán
router.get("/cancel", (req, res) => {
  res.send("You have cancelled the payment.");
});

export default router;