import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware";

import {
  createEnrollment,
  getMyEnrollmentList,
  getEnrollmentDetails,
  cancelMyEnrollment,
} from "../controllers/enrollment.controller";

const router = Router();

// All enrollment routes require authentication
router.use(authenticate);

// POST /api/enrollments
router.post("/", createEnrollment);

// GET /api/enrollments/my
router.get("/my", getMyEnrollmentList);

// GET /api/enrollments/:id
router.get("/:id", getEnrollmentDetails);

// DELETE /api/enrollments/:id
router.delete("/:id", cancelMyEnrollment);

export default router;