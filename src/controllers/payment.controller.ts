
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  initiatePayment,
  completeMockPayment
} from "../services/payment.service";

export const createPayment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    const { enrollmentId } = req.body;

    if (!Number.isInteger(enrollmentId) || enrollmentId <= 0) {
      return res.status(400).json({
        message: "Valid enrollmentId is required"
      });
    }

    const payment = await initiatePayment(
      userId,
      enrollmentId
    );

    return res.status(201).json({
      message: "Payment initiated successfully",
      payment
    });

  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    });
  }
};


export const confirmMockPayment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        message: "Mock payments are disabled in production"
      });
    }

   const userId = req.user!.userId;
    const paymentId = Number(req.params.id);

    if (!Number.isInteger(paymentId) || paymentId <= 0) {
      return res.status(400).json({
        message: "Invalid payment ID"
      });
    }

    const result = await completeMockPayment(
      userId,
      paymentId
    );

    return res.status(200).json({
      message: "Mock payment completed successfully",
      result
    });

  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    });
  }
};