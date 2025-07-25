import jwt from "jsonwebtoken";
import config from "../config.js";

function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  // Debug: print token and secret used for verification
  console.log("[ADMIN MIDDLEWARE] Token received:", JSON.stringify(token));
  console.log("[ADMIN MIDDLEWARE] Secret used for verification:", JSON.stringify(config.JWT_ADMIN_PASSWORD));

  try {
    const decoded = jwt.verify(token, config.JWT_ADMIN_PASSWORD);
    console.log("[ADMIN MIDDLEWARE] Decoded payload:", decoded);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    console.log("[ADMIN MIDDLEWARE] Error verifying token:", error);
    return res.status(401).json({ errors: "Invalid token or expired" });
  }
}

export default adminMiddleware;