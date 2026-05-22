const API_URL = "http://localhost:3000/users";

let editingUserId = null;

const userForm = document.getElementById("userForm");
const userList = document.getElementById("userList");
const button = userForm.querySelector("button");

async function loadUsers() {
  const response = await fetch(API_URL);

  const users = await response.json();

  userList.innerHTML = "";

  users.forEach((user) => {
    userList.innerHTML += `

      <div class="user-card">

        <h3>${user.name}</h3>

        <p>${user.email}</p>

      </div>

    `;
  });
}

loadUsers();

userForm.addEventListener(
  "submit",

  async (event) => {
    event.preventDefault();

    button.disabled = true;

    button.innerText = "Salvando...";

    try {
      const name = document.getElementById("name").value;

      const email = document.getElementById("email").value;

      await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
        }),
      });

      showToast("Utilizador criado com sucesso");

      userForm.reset();

      loadUsers();
    } catch (error) {
      showToast("Erro ao salvar utilizador");
    } finally {
      button.disabled = false;

      button.innerText = "Salvar Utilizador";
    }
  },
);

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.innerText = message;
}
