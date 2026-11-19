
import { Request, Response } from "express";

import * as courseService from "../services/course.service";

// CREATE COURSE
export const createCourse = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, description, price, status = "draft" } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.length > 150 ||
      !["string", "undefined"].includes(typeof description) ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !["draft", "published", "archived"].includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid course information",
      });
    }

    const course = await courseService.createCourse(
      title.trim(),
      description?.trim() || "",
      price,
      status
    );

    return res.status(201).json({
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET ALL COURSES
export const getAllCourses = async (
  req: Request,
  res: Response
) => {
  try {
    const courses = await courseService.getAllCourses();

    return res.status(200).json({
      message: "Courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET COURSE BY ID
export const getCourseById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    const course = await courseService.getCourseById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json({
      message: "Course retrieved successfully",
      data: course,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE COURSE
export const updateCourse = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { title, description, price, status } = req.body;

    if (typeof id !== "string" || !/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.length > 150 ||
      typeof description !== "string" ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !["draft", "published", "archived"].includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid course information",
      });
    }

    const course = await courseService.updateCourse(
      id,
      title.trim(),
      description.trim(),
      price,
      status
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json({
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// DELETE COURSE
export const deleteCourse = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    const course = await courseService.deleteCourse(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json({
      message: "Course deleted successfully",
      data: course,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
