import db from '../db.js';

export async function getUsers(req, res) {

  const [users] = await db.query(

    'SELECT * FROM users'

  );

  res.json(users);

}