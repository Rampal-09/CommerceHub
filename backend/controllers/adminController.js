import Product from "../modals/productSchema.js";
import Category from "../modals/categorySchema.js";
import Order from "../modals/orderSchema.js";
import User from "../modals/userModal.js";

/**
 * Get aggregated admin dashboard statistics & analytics
 * GET /api/v1/admin/dashboard
 */
export const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });

    // Calculate total revenue from non-cancelled orders
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$grandTotal" } } },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Low stock products (< 10 stock)
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .select("title stock price thumbnail category")
      .populate("category", "name")
      .limit(5)
      .lean();

    // 5 Most recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .lean();

    // Order status breakdown counts
    const statusCounts = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    const orderStatusBreakdown = {
      Placed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    statusCounts.forEach((item) => {
      if (item._id && orderStatusBreakdown[item._id] !== undefined) {
        orderStatusBreakdown[item._id] = item.count;
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCategories,
        totalUsers,
        orderStatusBreakdown,
      },
      lowStockProducts,
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all platform orders for admin management with filtering & search
 * GET /api/v1/admin/orders
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (search) {
      query.orderNumber = { $regex: search.trim(), $options: "i" };
    }

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limitNum) || 1;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("user", "name email")
      .lean();

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalOrders,
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status by Admin
 * PATCH /api/v1/admin/orders/:id
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed values: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "Delivered") {
      order.deliveredAt = new Date();
    } else if (orderStatus === "Cancelled") {
      order.cancelledAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to '${orderStatus}' successfully.`,
      order,
    });
  } catch (error) {
    next(error);
  }
};
