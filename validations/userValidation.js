export function validateUserData(userData) {
  const { name, email } = userData;

  if (!name || !email) {
    throw new Error('Nome e email são obrigatórios');
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new Error('Email inválido');
  }
}