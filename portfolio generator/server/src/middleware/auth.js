import jwt from "jsonwebtoken";

/**
 * JWT auth middleware.
 * Expects: Authorization: Bearer <token>
 * Attaches decoded payload to req.user.
 * Returns 401 if missing or invalid.
 */
const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
};

export default auth;
