export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED";

export interface Payment {
  id: number;
  enrollment_id: number;
  user_id: number;
  amount: number;
  transaction_id: string;
  payment_method: string;
  status: PaymentStatus;
  created_at: Date;
  updated_at: Date;
}