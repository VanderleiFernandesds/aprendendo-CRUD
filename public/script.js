const API_URL = 'http://localhost:3000/users';

let usersData = [];
let editingUserId = null;
let deletingUserId = null;
let currentPage = 1;
const limit = 5;

const userTableBody = document.getElementById('userTableBody');
const userModal = document.getElementById('userModal');
const deleteModal = document.getElementById('deleteModal');
const userForm = document.getElementById('userForm');
const modalTitle = document.getElementById('modalTitle');

const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const saveButton = document.getElementById('saveButton');

const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');

const toast = document.getElementById('toast');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('searchInput');

const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageNumber = document.getElementById('pageNumber');

function formatDate(date) {
  return new Date(date).toLocaleString("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  });
}

async function loadUsers() {
  try {
    loading.style.display = 'block';

    const response = await fetch(
      `${API_URL}?page=${currentPage}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Erro ao carregar utilizadores');
    }

    const users = await response.json();

    usersData = users;

    renderUsers(usersData);

    pageNumber.innerText = `Página ${currentPage}`;
  } catch (error) {
    showToast(error.message);
  } finally {
    loading.style.display = 'none';
  }
}

function renderUsers(users) {
  userTableBody.innerHTML = '';

  if (users.length === 0) {
    userTableBody.innerHTML = `
      <tr>
        <td colspan="4">
          Nenhum utilizador encontrado
        </td>
      </tr>
    `;

    return;
  }

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
          <button
            class="btn-edit"
            data-id="${user.id}"
          >
            Editar
          </button>

          <button
            class="btn-delete"
            data-id="${user.id}"
          >
            Excluir
          </button>
        </td>
      </tr>
    `;
  });
}

function openUserModal() {
  userModal.classList.add('show');
}

function closeUserModal() {
  userModal.classList.remove('show');

  userForm.reset();

  editingUserId = null;

  modalTitle.innerText = 'Novo Utilizador';
  saveButton.innerText = 'Salvar';
  saveButton.disabled = false;
}

openModalBtn.addEventListener('click', () => {
  openUserModal();
});

closeModalBtn.addEventListener('click', () => {
  closeUserModal();
});

userForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) {
    showToast('Preencha todos os campos');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    showToast('Email inválido');
    return;
  }

  const method = editingUserId ? 'PUT' : 'POST';

  const url = editingUserId
    ? `${API_URL}/${editingUserId}`
    : API_URL;

  try {
    saveButton.disabled = true;
    saveButton.innerText = 'Salvando...';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.message);
    }

    showToast(
      editingUserId
        ? 'Utilizador atualizado'
        : 'Utilizador criado'
    );

    closeUserModal();

    loadUsers();
  } catch (error) {
    showToast(error.message);
  } finally {
    saveButton.disabled = false;
    saveButton.innerText = editingUserId ? 'Atualizar' : 'Salvar';
  }
});

document.addEventListener('click', async (event) => {
  const button = event.target;
  const id = button.dataset.id;

  if (button.classList.contains('btn-edit')) {
    await editUser(id);
  }

  if (button.classList.contains('btn-delete')) {
    openDeleteModal(id);
  }
});

async function editUser(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error('Erro ao carregar utilizador');
    }

    const user = await response.json();

    nameInput.value = user.name;
    emailInput.value = user.email;

    editingUserId = id;

    modalTitle.innerText = 'Editar Utilizador';
    saveButton.innerText = 'Atualizar';

    openUserModal();
  } catch (error) {
    showToast(error.message);
  }
}

function openDeleteModal(id) {
  deletingUserId = id;

  deleteModal.classList.add('show');
}

function closeDeleteModal() {
  deletingUserId = null;

  deleteModal.classList.remove('show');
}

cancelDeleteBtn.addEventListener('click', () => {
  closeDeleteModal();
});

confirmDeleteBtn.addEventListener('click', async () => {
  if (!deletingUserId) return;

  try {
    const response = await fetch(`${API_URL}/${deletingUserId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao remover utilizador');
    }

    showToast('Utilizador removido');

    closeDeleteModal();

    loadUsers();
  } catch (error) {
    showToast(error.message);
  }
});

searchInput.addEventListener('input', () => {
  const value = searchInput.value.toLowerCase();

  const filteredUsers = usersData.filter((user) => {
    return (
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value)
    );
  });

  renderUsers(filteredUsers);
});

nextPageBtn.addEventListener('click', () => {
  currentPage++;

  loadUsers();
});

prevPageBtn.addEventListener('click', () => {
  if (currentPage === 1) return;

  currentPage--;

  loadUsers();
});

function showToast(message) {
  toast.innerText = message;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

loadUsers();



