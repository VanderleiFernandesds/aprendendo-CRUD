import db from '../db.js';

export async function createUser(req, res) {

  const {

    name,
    email

  } = req.body;

  const [result] = await db.query(

    `INSERT INTO users
    (name, email)
    VALUES (?, ?)`,
    
    [name, email]

  );

  res.status(201).json({

    message:

    'Utilizador criado',

    id: result.insertId

  });

}


export async function getUsers(req, res) {

  const [users] = await db.query(

    'SELECT * FROM users'

  );

  res.json(users);

}


export async function updateUser(req, res) {

  const { id } = req.params;

  const {

    name,
    email

  } = req.body;

  const [result] = await db.query(

    `UPDATE users
     SET name = ?, email = ?
     WHERE id = ?`,

    [name, email, id]

  );

  res.json({

    message:

    'Utilizador atualizado'

  });

}


export async function deleteUser(req, res) {

  const { id } = req.params;

  await db.query(

    'DELETE FROM users WHERE id = ?',

    [id]

  );

  res.json({

    message:

    'Utilizador removido'

  });

}