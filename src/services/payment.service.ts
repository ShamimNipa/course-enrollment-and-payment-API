

import { pool } from "../config/db";
import { randomUUID } from "crypto";

// =====================================
// INITIATE PAYMENT
// =====================================

export const initiatePayment = async (
  userId: number,
  enrollmentId: number
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Find enrollment and course price
    const enrollmentResult = await client.query(
      `SELECT
          e.id,
          e.user_id,
          e.course_id,
          e.status,
          c.price
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.id = $1 AND e.user_id = $2
       FOR UPDATE OF e`,
      [enrollmentId, userId]
    );

    if (enrollmentResult.rows.length === 0) {
      throw new Error("Enrollment not found");
    }

    const enrollment = enrollmentResult.rows[0];

    // 2. Check enrollment status
    if (enrollment.status !== "PENDING") {
      throw new Error("Enrollment is not pending");
    }

    // 3. Check course price
    if (Number(enrollment.price) <= 0) {
      throw new Error("Invalid course price");
    }

    // 4. Generate transaction ID
    const transactionId = `MOCK-${randomUUID()}`;

    // 5. Create payment record
    const paymentResult = await client.query(
      `INSERT INTO payments
       (userid, enrollmentid, amount, payment_method,
        transaction_id, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        userId,
        enrollmentId,
        enrollment.price,
        "MOCK",
        transactionId,
        "PENDING"
      ]
    );

    await client.query("COMMIT");

    return paymentResult.rows[0];

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;

  } finally {
    client.release();
  }
};


// =====================================
// COMPLETE MOCK PAYMENT
// =====================================

export const completeMockPayment = async (
  userId: number,
  paymentId: number
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Find payment belonging to this user
    const result = await client.query(
      `SELECT *
       FROM payments
       WHERE id = $1 AND userid = $2
       FOR UPDATE`,
      [paymentId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error("Payment not found");
    }

    const payment = result.rows[0];

    // 2. Check payment status
    if (payment.status !== "PENDING") {
      throw new Error("Payment is not pending");
    }

    // 3. Update payment status
    await client.query(
      `UPDATE payments
       SET status = 'SUCCESS',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [paymentId]
    );

    // 4. Confirm enrollment
    const enrollmentUpdate = await client.query(
      `UPDATE enrollments
       SET status = 'CONFIRMED'
       WHERE id = $1
       AND user_id = $2
       AND status = 'PENDING'`,
      [payment.enrollmentid, userId]
    );

    if (enrollmentUpdate.rowCount !== 1) {
      throw new Error("Could not confirm enrollment");
    }

    // 5. Save both updates
    await client.query("COMMIT");

    return {
      paymentId,
      transactionId: payment.transaction_id,
      status: "SUCCESS",
      enrollmentStatus: "CONFIRMED"
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;

  } finally {
    client.release();
  }
};
