import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";

import {
  enrollStudent,
  getMyEnrollments,
  getEnrollmentById,
  cancelEnrollment,
} from "../services/enrollment.service";


// 1. Enroll in course
export const createEnrollment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.userId;
    const { courseid } = req.body;

    if (!courseid || !Number.isInteger(Number(courseid)) ||
        Number(courseid) <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid courseid is required",
      });
    }

    const enrollment = await enrollStudent(
      userId,
      Number(courseid)
    );

    return res.status(201).json({
      success: true,
      message: "Course enrollment successful",
      data: enrollment,
    });

  } catch (error: any) {
    if (error.message === "COURSE_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (error.message === "ALREADY_ENROLLED") {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to enroll in course",
    });
  }
};


// 2. Get my enrollments
export const getMyEnrollmentList = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    const enrollments = await getMyEnrollments(userId);

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve enrollments",
    });
  }
};


// 3. Get enrollment by ID
export const getEnrollmentDetails = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const enrollmentId = Number(req.params.id);
    const userId = req.user!.userId;

    if (!Number.isInteger(enrollmentId) || enrollmentId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment ID",
      });
    }

    const enrollment = await getEnrollmentById(
      enrollmentId,
      userId
    );

    return res.status(200).json({
      success: true,
      data: enrollment,
    });

  } catch (error: any) {
    if (error.message === "ENROLLMENT_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve enrollment",
    });
  }
};


// 4. Cancel enrollment
export const cancelMyEnrollment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const enrollmentId = Number(req.params.id);
    const userId = req.user!.userId;

    if (!Number.isInteger(enrollmentId) || enrollmentId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment ID",
      });
    }

    const enrollment = await cancelEnrollment(
      enrollmentId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Enrollment cancelled successfully",
      data: enrollment,
    });

  } catch (error: any) {
    if (error.message === "ENROLLMENT_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found or already cancelled",
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel enrollment",
    });
  }
};