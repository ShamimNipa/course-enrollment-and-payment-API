import { Router } from "express";

import {
  createPayment,
  confirmMockPayment
} from "../controllers/payment.controller";

import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/initiate", createPayment);

router.post("/:id/mock-success", confirmMockPayment);

export default router;