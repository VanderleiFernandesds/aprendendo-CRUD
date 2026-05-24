const API_URL =
  'http://localhost:3000/users';

const userTableBody =

  document.getElementById(

    'userTableBody'

  );

  async function loadUsers() {

  const response =
    await fetch(API_URL);

  const users =
    await response.json();

    userTableBody.innerHTML = '';

users.forEach((user) => {

  userTableBody.innerHTML += `

    <tr>

      <td>

        ${user.name}

      </td>

      <td>

        ${user.email}

      </td>

      <td>

        <span class="status">

          Ativo

        </span>

      </td>

      <td>

        <button class="btn-edit">

          Editar

        </button>

        <button class="btn-delete">

          Excluir

        </button>

      </td>

    </tr>

  `;

});

}

loadUsers();

