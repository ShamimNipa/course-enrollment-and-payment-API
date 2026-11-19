
import { Router } from "express";

import * as courseController from "../controllers/course.controller";

const router = Router();

// CREATE
router.post("/", courseController.createCourse);

// READ ALL
router.get("/", courseController.getAllCourses);

// READ ONE
router.get("/:id", courseController.getCourseById);

// UPDATE
router.put("/:id", courseController.updateCourse);

// DELETE
router.delete("/:id", courseController.deleteCourse);

export default router;
