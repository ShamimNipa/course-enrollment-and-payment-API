import { pool } from "../config/db";
// CREATE PAYMENT
export const createPayment = async (
  enrollmentId: number,
  amount: number,
  transactionId: string
) => {
  const query = `
    INSERT INTO payments (
      enrollment_id,
      amount,
      currency,
      payment_provider,
      transaction_id,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    enrollmentId,
    amount,
    "BDT",
    "SIMULATED",
    transactionId,
    "pending"
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

// FIND PAYMENT BY ID
export const findPaymentById = async (paymentId: number) => {
  const query = `
    SELECT *
    FROM payments
    WHERE id = $1;
  `;

  const result = await pool.query(query, [paymentId]);

  return result.rows[0];
};

// UPDATE PAYMENT STATUS
export const updatePaymentStatus = async (
  paymentId: number,
  status: string
) => {
  const query = `
    UPDATE payments
    SET status = $1
    WHERE id = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [status, paymentId]);

  return result.rows[0];
};
