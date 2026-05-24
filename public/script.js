const API_URL = 'http://localhost:3000/users';

let editingUserId = null;

const userTableBody = document.getElementById('userTableBody');
const userModal = document.getElementById('userModal');
const userForm = document.getElementById('userForm');
const modalTitle = document.getElementById('modalTitle');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const saveButton = document.getElementById('saveButton');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');

async function loadUsers() {
  const response = await fetch(API_URL);
  const users = await response.json();

  userTableBody.innerHTML = '';

  users.forEach((user) => {
    userTableBody.innerHTML += `
      <tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          <span class="status">Ativo</span>
        </td>
        <td>
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
}

function openModal() {
  userModal.classList.add('show');
}

function closeModal() {
  userModal.classList.remove('show');

  userForm.reset();

  editingUserId = null;

  modalTitle.innerText = 'Novo Utilizador';
  saveButton.innerText = 'Salvar';
}

openModalBtn.addEventListener('click', openModal);

closeModalBtn.addEventListener('click', closeModal);

userForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = nameInput.value;
  const email = emailInput.value;

  const method = editingUserId ? 'PUT' : 'POST';

  const url = editingUserId
    ? `${API_URL}/${editingUserId}`
    : API_URL;

  saveButton.disabled = true;
  saveButton.innerText = 'Salvando...';

  await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      email
    })
  });

  showToast(
    editingUserId
      ? 'Utilizador atualizado com sucesso'
      : 'Utilizador criado com sucesso'
  );

  closeModal();

  loadUsers();

  saveButton.disabled = false;
  saveButton.innerText = 'Salvar';
});

document.addEventListener('click', async (event) => {
  const button = event.target;

  const id = button.dataset.id;

  if (button.classList.contains('btn-delete')) {
    await deleteUser(id);
  }

  if (button.classList.contains('btn-edit')) {
    await editUser(id);
  }
});

async function deleteUser(id) {
  const confirmDelete = confirm('Deseja excluir este utilizador?');

  if (!confirmDelete) return;

  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  showToast('Utilizador removido com sucesso');

  loadUsers();
}

async function editUser(id) {
  const response = await fetch(`${API_URL}/${id}`);
  const user = await response.json();

  nameInput.value = user.name;
  emailInput.value = user.email;

  editingUserId = id;

  modalTitle.innerText = 'Editar Utilizador';
  saveButton.innerText = 'Atualizar';

  openModal();
}

function showToast(message) {
  const toast = document.getElementById('toast');

  toast.innerText = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

loadUsers();

