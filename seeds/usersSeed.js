import db from "../db.js";

async function seedUsers() {
  try {
    await db.query("DELETE FROM users");

    await db.query(
      `INSERT INTO users

      (name, email, status)

      VALUES

      (?, ?, ?),

      (?, ?, ?),

      (?, ?, ?)`,

      [
        "João Silva",
        "joao@email.com",
        "active",

        "Maria Souza",
        "maria@email.com",
        "active",

        "Carlos Lima",
        "carlos@email.com",
        "active",
      ],
    );

    console.log("Seed executada sucesso");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

seedUsers();
