const API_URL = "http://localhost:3000/users";

let editingUserId = null;
let deletingUserId = null;

const userTableBody = document.getElementById("userTableBody");
const userModal = document.getElementById("userModal");
const deleteModal = document.getElementById("deleteModal");
const userForm = document.getElementById("userForm");
const modalTitle = document.getElementById("modalTitle");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveButton = document.getElementById("saveButton");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");

function formatDate(date) {
  return new Date(date).toLocaleString("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  });
}

async function loadUsers() {
  try {
    const response = await fetch(API_URL);
    const users = await response.json();

    userTableBody.innerHTML = "";

    users.forEach((user) => {
      userTableBody.innerHTML += `
        <tr>
          <td>${formatDate(user.created_at)}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>
            <span class="status">Ativo</span>
          </td>
          <td class="actions">
            <button class="btn-edit" data-id="${user.id}">
              Editar
            </button>
            <button class="btn-delete" data-id="${user.id}">
              Excluir
            </button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    showToast("Erro ao carregar utilizadores");
  }
}

function openModal() {
  userModal.classList.add("show");
}

function closeModal() {
  userModal.classList.remove("show");
  userForm.reset();
  editingUserId = null;
  modalTitle.innerText = "Novo Utilizador";
  saveButton.innerText = "Salvar";
}

openModalBtn.addEventListener("click", () => {
  openModal();
});

closeModalBtn.addEventListener("click", () => {
  closeModal();
});

userForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = nameInput.value;
  const email = emailInput.value;

  if (!name || !email) {
    showToast("Preencha todos os campos");
    return;
  }

  const method = editingUserId ? "PUT" : "POST";
  const url = editingUserId ? `${API_URL}/${editingUserId}` : API_URL;

  try {
    saveButton.disabled = true;
    saveButton.innerText = "Salvando...";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
      }),
    });

    showToast(
      editingUserId
        ? "Utilizador atualizado com sucesso"
        : "Utilizador criado com sucesso",
    );

    closeModal();
    loadUsers();
  } catch (error) {
    showToast("Erro ao salvar utilizador");
  } finally {
    saveButton.disabled = false;
    saveButton.innerText = editingUserId ? "Atualizar" : "Salvar";
  }
});

document.addEventListener("click", async (event) => {
  const button = event.target;
  const id = button.dataset.id;

  if (button.classList.contains("btn-delete")) {
    deleteUser(id);
  }

  if (button.classList.contains("btn-edit")) {
    editUser(id);
  }
});

function deleteUser(id) {
  deletingUserId = id;
  deleteModal.classList.add("show");
}

cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.classList.remove("show");
  deletingUserId = null;
});

confirmDeleteBtn.addEventListener("click", async () => {
  if (!deletingUserId) return;

  try {
    await fetch(`${API_URL}/${deletingUserId}`, {
      method: "DELETE",
    });

    showToast("Utilizador removido com sucesso");
    deleteModal.classList.remove("show");
    deletingUserId = null;
    loadUsers();
  } catch (error) {
    showToast("Erro ao remover utilizador");
  }
});

async function editUser(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const user = await response.json();

    nameInput.value = user.name;
    emailInput.value = user.email;
    editingUserId = id;
    modalTitle.innerText = "Editar Utilizador";
    saveButton.innerText = "Atualizar";

    openModal();
  } catch (error) {
    showToast("Erro ao carregar utilizador");
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

loadUsers();
