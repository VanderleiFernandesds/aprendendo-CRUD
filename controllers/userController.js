import db from "../db.js";

export const getUsers = async (
  req,

  res,
) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao buscar utilizadores",
    });
  }
};

export const createUser = async (
  req,

  res,
) => {
  const { name, email } = req.body;

  try {
    await db.query(
      `INSERT INTO users

       (name, email)

       VALUES (?, ?)`,

      [name, email],
    );

    res.status(201).json({
      message: "Utilizador criado",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao criar utilizador",
    });
  }
};

export const updateUser = async (
  req,

  res,
) => {
  const { id } = req.params;

  const { name, email } = req.body;

  try {
    await db.query(
      `UPDATE users

       SET name = ?, email = ?

       WHERE id = ?`,

      [name, email, id],
    );

    res.json({
      message: "Utilizador atualizado",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao atualizar",
    });
  }
};

export const deleteUser = async (
  req,

  res,
) => {
  const { id } = req.params;

  try {
    await db.query(
      "DELETE FROM users WHERE id = ?",

      [id],
    );

    res.json({
      message: "Utilizador removido",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao remover",
    });
  }
};
