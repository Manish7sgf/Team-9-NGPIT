/**
 * Global Express error handler.
 * Catches anything passed via next(err).
 */
const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);
  if (err.stack) console.error(err.stack.split("\n").slice(0, 4).join("\n"));

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({ success: false, error: message });
};

export default errorHandler;
