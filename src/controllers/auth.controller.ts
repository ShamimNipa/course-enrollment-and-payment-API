import { Request, Response } from "express";
import { loginUser } from "../services/auth.service";

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Debug: check whether the request body is arriving
    console.log("LOGIN BODY:", {
      bodyKeys: Object.keys(req.body ?? {}),
      hasEmail: Boolean(req.body?.email),
      hasPassword: Boolean(req.body?.password),
    });

    const { email, password } = req.body ?? {};

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
      return;
    }

    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });

  } catch (error: any) {
    console.error("LOGIN ERROR:", error);

    if (error.message === "INVALID_CREDENTIALS") {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};