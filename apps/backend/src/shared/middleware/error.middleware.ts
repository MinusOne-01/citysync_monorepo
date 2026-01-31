import { Request, Response, NextFunction } from "express";
import { AppError } from "../configs/errors";

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If it's our custom AppError, use its status code
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Handle Prisma errors specifically (optional but helpful)
  if (err.message.includes("Prisma")) {
    return res.status(500).json({
      status: "error",
      message: "Database operation failed",
    });
  }

  // Fallback for unknown bugs (don't leak sensitive stack traces in production!)
  console.error("UNDEFINED ERROR 💥:", err);
  res.status(500).json({
    status: "error",
    message: "Something went very wrong",
  });
};