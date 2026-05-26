import db from "../db.js";
import { validateUserData } from "../validations/userValidation.js";

export async function getAllUsers(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const [users] = await db.query(
    `SELECT * FROM users

     WHERE status = 'active'

     LIMIT ? OFFSET ?`,

    [Number(limit), Number(offset)],
  );

  return users;
}
export async function getUserById(id) {
  const [users] = await db.query(
    "SELECT * FROM users WHERE id = ? AND status = 'active'",

    [id],
  );

  return users[0];
}

export async function createUser(userData) {
  validateUserData(userData);

  const { name, email } = userData;

  const [existingUsers] = await db.query(
    "SELECT * FROM users WHERE email = ? AND status = 'active'",
    [email],
  );

  if (existingUsers.length > 0) {
    throw new Error("Email já cadastrado");
  }

  const [result] = await db.query(
    `INSERT INTO users
     (name, email)
     VALUES (?, ?)`,
    [name, email],
  );

  return result.insertId;
}

export async function updateUser(id, userData) {
  validateUserData(userData);

  const { name, email } = userData;

  const [existingUsers] = await db.query(
    `SELECT * FROM users
     WHERE email = ? AND id != ? AND status = 'active'`,
    [email, id],
  );

  if (existingUsers.length > 0) {
    throw new Error("Email já cadastrado");
  }

  const [result] = await db.query(
    `UPDATE users
     SET name = ?, email = ?
     WHERE id = ? AND status = 'active'`,
    [name, email, id],
  );

  return result;
}

export async function deleteUser(id) {
  const [result] = await db.query(
    `UPDATE users
     SET status = 'inactive'
     WHERE id = ? AND status = 'active'`,

    [id],
  );

  return result;
}
