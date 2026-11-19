import { pool } from "../config/db";

// 1. Enroll a student in a course
export const enrollStudent = async (
  userId: number,
  courseId: number
) => {
  // Check whether the course exists
  const courseResult = await pool.query(
    "SELECT id FROM courses WHERE id = $1",
    [courseId]
  );

  if (courseResult.rows.length === 0) {
    throw new Error("COURSE_NOT_FOUND");
  }

  // Check whether the student is already actively enrolled
  const existingEnrollment = await pool.query(
    `SELECT id FROM enrollments
     WHERE userid = $1
     AND courseid = $2
     AND status = 'active'`,
    [userId, courseId]
  );

  if (existingEnrollment.rows.length > 0) {
    throw new Error("ALREADY_ENROLLED");
  }

  // Create enrollment
  const result = await pool.query(
    `INSERT INTO enrollments
     (userid, courseid, status)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, courseId, "active"]
  );

  return result.rows[0];
};


// 2. Get all enrollments of a student
export const getMyEnrollments = async (userId: number) => {
  const result = await pool.query(
    `SELECT
       e.id,
       e.userid,
       e.courseid,
       e.status,
       e.enrolled_at,
       c.title,
       c.description,
       c.price
     FROM enrollments e
     JOIN courses c ON e.courseid = c.id
     WHERE e.userid = $1
     ORDER BY e.enrolled_at DESC`,
    [userId]
  );

  return result.rows;
};


// 3. Get a specific enrollment
export const getEnrollmentById = async (
  enrollmentId: number,
  userId: number
) => {
  const result = await pool.query(
    `SELECT
       e.id,
       e.userid,
       e.courseid,
       e.status,
       e.enrolled_at,
       c.title,
       c.description,
       c.price
     FROM enrollments e
     JOIN courses c ON e.courseid = c.id
     WHERE e.id = $1
     AND e.userid = $2`,
    [enrollmentId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error("ENROLLMENT_NOT_FOUND");
  }

  return result.rows[0];
};


// 4. Cancel enrollment
export const cancelEnrollment = async (
  enrollmentId: number,
  userId: number
) => {
  const result = await pool.query(
    `UPDATE enrollments
     SET status = 'cancelled'
     WHERE id = $1
     AND userid = $2
     AND status = 'active'
     RETURNING *`,
    [enrollmentId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error("ENROLLMENT_NOT_FOUND");
  }

  return result.rows[0];
};