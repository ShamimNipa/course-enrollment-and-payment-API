
import { pool } from "../config/db";

// CREATE COURSE
export const createCourse = async (
  title: string,
  description: string,
  price: number,
  status: string
) => {
  const query = `
    INSERT INTO courses (title, description, price, status)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const result = await pool.query(query, [
    title,
    description,
    price,
    status,
  ]);

  return result.rows[0];
};

// GET ALL COURSES
export const getAllCourses = async () => {
  const query = `
    SELECT * FROM courses
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);

  return result.rows;
};

// GET COURSE BY ID
export const getCourseById = async (id: string) => {
  const query = `
    SELECT * FROM courses
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

// UPDATE COURSE
export const updateCourse = async (
  id: string,
  title: string,
  description: string,
  price: number,
  status: string
) => {
  const query = `
    UPDATE courses
    SET
      title = $1,
      description = $2,
      price = $3,
      status = $4,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *
  `;

  const result = await pool.query(query, [
    title,
    description,
    price,
    status,
    id,
  ]);

  return result.rows[0];
};

// DELETE COURSE
export const deleteCourse = async (id: string) => {
  const query = `
    DELETE FROM courses
    WHERE id = $1
    RETURNING *
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};
