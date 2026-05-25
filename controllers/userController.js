import {
  getAllUsers,
  getUserById as getUserByIdService,
  createUser as createUserService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from "../services/userService.js";

import { asyncHandler } from "../middlewares/asyncHandler.js";

export async function getUsers(req, res) {
  const users = await getAllUsers();

  res.json(users);
}

export async function getUserById(req, res) {
  try {
    const user = await getUserByIdService(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Utilizador não encontrado",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function createUser(req, res) {
  try {
    const id = await createUserService(req.body);

    res.status(201).json({
      message: "Utilizador criado",
      id,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

export async function updateUser(req, res) {
  try {
    const result = await updateUserService(req.params.id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Utilizador não encontrado",
      });
    }

    res.json({
      message: "Utilizador atualizado",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const result = await deleteUserService(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Utilizador não encontrado",
      });
    }

    res.json({
      message: "Utilizador removido",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
