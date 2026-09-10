import jwt from "jsonwebtoken";

/**
 * Middleware to protect private routes.
 * Reads Bearer token from the Authorization header and verifies it.
 * Attaches decoded payload { id, role } to req.user.
 */
export const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server configuration error: JWT_SECRET not set." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid token. Authentication failed." });
  }
};

/**
 * Middleware factory to restrict access to specific roles.
 * Usage: restrictTo("company"), restrictTo("student", "faculty")
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden. Your role (${req.user?.role || "unknown"}) does not have permission to perform this action.`,
      });
    }
    next();
  };
};
