import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import DiscountCode from "../models/discountModel.js";

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      couponId,
      discountPercentage,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    } else {
      // Tính toán lại các giá trị để đảm bảo chính xác
      const discountAmount = (itemsPrice * (discountPercentage || 0)) / 100;
      const totalAfterDiscount = itemsPrice - discountAmount;
      const finalShippingPrice = totalAfterDiscount >= 1000000 ? 0 : 30000;
      const finalTotal = totalAfterDiscount + finalShippingPrice;

      const order = new Order({
        orderItems: orderItems.map((x) => ({
          name: x.name,
          qty: x.qty,
          image: x.image,
          price: x.price,
          product: x.product,
          selectedSize: x.selectedSize,
        })),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice: finalShippingPrice,
        totalPrice: finalTotal,
        couponId,
        discountAmount,
        discountPercentage: discountPercentage || 0,
      });

      const createdOrder = await order.save();

      // Nếu có sử dụng mã giảm giá, cập nhật usedCount
      if (couponId) {
        await DiscountCode.findByIdAndUpdate(
          couponId,
          { $inc: { usedCount: 1 } },
          { new: true }
        );
      }

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calcualteTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Update product quantities
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          // Update size quantity
          if (product.sizeQuantities && product.sizeQuantities[item.selectedSize] !== undefined) {
            const currentSizeQty = product.sizeQuantities[item.selectedSize];
            if (currentSizeQty < item.qty) {
              throw new Error(`Not enough quantity for size ${item.selectedSize} of product ${item.name}`);
            }
            product.sizeQuantities[item.selectedSize] = currentSizeQty - item.qty;
          }

          // Update total quantity
          const totalSizeQuantities = Object.values(product.sizeQuantities).reduce((sum, qty) => sum + qty, 0);
          product.quantity = totalSizeQuantities;
          
          await product.save();
        }
      }

      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.status = "Delivered"; // Cập nhật trạng thái đơn hàng

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Nếu trạng thái mới là "Delivered" và phương thức thanh toán là "Cash on Delivery"
    if (status === "Delivered" && order.paymentMethod === "Cash on Delivery" && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json({ success: true, message: "Status Updated", order: updatedOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  updateStatus,
};