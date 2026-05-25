import db from '../db.js';
import { validateUserData } from '../validations/userValidation.js';

export async function getAllUsers() {

  const [users] = await db.query(

    'SELECT * FROM users'

  );

  return users;

}

export async function getUserById(id) {

  const [users] = await db.query(

    'SELECT * FROM users WHERE id = ?',

    [id]

  );

  return users[0];

}

export async function createUser(userData) {
  validateUserData(userData);

  const { name, email } = userData;

  const [existingUsers] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (existingUsers.length > 0) {
    throw new Error('Email já cadastrado');
  }

  const [result] = await db.query(
    `INSERT INTO users
     (name, email)
     VALUES (?, ?)`,
    [name, email]
  );

  return result.insertId;
}

export async function updateUser(id, userData) {
  validateUserData(userData);

  const { name, email } = userData;

  const [existingUsers] = await db.query(
    `SELECT * FROM users
     WHERE email = ? AND id != ?`,
    [email, id]
  );

  if (existingUsers.length > 0) {
    throw new Error('Email já cadastrado');
  }

  const [result] = await db.query(
    `UPDATE users
     SET name = ?, email = ?
     WHERE id = ?`,
    [name, email, id]
  );

  return result;
}


export async function deleteUser(id) {

  const [result] = await db.query(

    'DELETE FROM users WHERE id = ?',

    [id]

  );

  return result;

}
