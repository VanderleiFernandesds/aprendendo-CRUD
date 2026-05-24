import db from '../db.js';

export async function getUsers(req, res) {
  try {
    const [users] = await db.query(
      'SELECT * FROM users'
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar utilizadores'
    });
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const [users] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: 'Utilizador não encontrado'
      });
    }

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar utilizador'
    });
  }
}

export async function createUser(req, res) {
  const { name, email } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO users
       (name, email)
       VALUES (?, ?)`,
      [name, email]
    );

    res.status(201).json({
      message: 'Utilizador criado',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao criar utilizador'
    });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE users
       SET name = ?, email = ?
       WHERE id = ?`,
      [name, email, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Utilizador não encontrado'
      });
    }

    res.json({
      message: 'Utilizador atualizado'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao atualizar utilizador'
    });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Utilizador não encontrado'
      });
    }

    res.json({
      message: 'Utilizador removido'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao remover utilizador'
    });
  }
}