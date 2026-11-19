
import { pool } from "../config/db";
import bcrypt from "bcrypt";

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserInput {
    name: string;
    email: string;
}

// CREATE USER
export const createUser = async (userData: CreateUserInput) => {
    const { name, email, password } = userData;

    const hashedPassword = await bcrypt.hash(password, 12);

    const query = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email;
    `;

    const values = [name, email, hashedPassword];
    const result = await pool.query(query, values);

    return result.rows[0];
};

// GET ALL USERS
export const getAllUsers = async () => {
    const query = `
        SELECT id, name, email
        FROM users
        ORDER BY id ASC;
    `;

    const result = await pool.query(query);

    return result.rows;
};

// GET USER BY ID
export const getUserById = async (id: number) => {
    const query = `
        SELECT id, name, email
        FROM users
        WHERE id = $1;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
};

// UPDATE USER
export const updateUser = async (
    id: number,
    userData: UpdateUserInput
) => {
    const { name, email } = userData;

    const query = `
        UPDATE users
        SET name = $1, email = $2
        WHERE id = $3
        RETURNING id, name, email;
    `;

    const values = [name, email, id];

    const result = await pool.query(query, values);

    return result.rows[0] || null;
};

// DELETE USER
export const deleteUser = async (id: number) => {
    const query = `
        DELETE FROM users
        WHERE id = $1
        RETURNING id, name, email;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
};
