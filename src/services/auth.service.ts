
import { pool } from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (
  email: string,
  password: string
) => {
  // 1. Find user by email
  const result = await pool.query(
    `SELECT id, name, email, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const user = result.rows[0];

  // 2. Compare entered password with stored hash
  const isPasswordValid = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!isPasswordValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // 3. Get JWT secret
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is missing");
}
  // 4. Generate JWT token
const token = jwt.sign(
  {
    userId: user.id,
  },
  secret,
  {
    expiresIn: "1d",
  }
);

  // 5. Return user information and token
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};
