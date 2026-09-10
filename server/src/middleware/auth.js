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
    const userId = decoded.id || decoded._id || decoded.userId;
    const userRole = decoded.role ? String(decoded.role).toLowerCase().trim() : "student";

    req.user = {
      id: userId,
      _id: userId,
      role: userRole,
    };
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
 * Supports case-insensitive role matching (e.g., "Student" vs "student").
 * Usage: restrictTo("company"), restrictTo("student", "faculty")
 */
export const restrictTo = (...roles) => {
  const normalizedAllowed = roles.map((r) => String(r).toLowerCase().trim());
  return (req, res, next) => {
    const userRole = req.user?.role ? String(req.user.role).toLowerCase().trim() : "";
    if (!req.user || (!normalizedAllowed.includes(userRole) && userRole !== "admin")) {
      return res.status(403).json({
        message: `Forbidden. Your role (${req.user?.role || "unknown"}) does not have permission to perform this action.`,
      });
    }
    next();
  };
};
