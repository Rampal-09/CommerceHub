import jwt from "jsonwebtoken";
import User from "../modals/userModal.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallbacksecret");

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid or expired token.",
    });
  }
};

export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const roles = allowedRoles.flat();

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user missing.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to perform this action.`,
      });
    }

    next();
  };
};
