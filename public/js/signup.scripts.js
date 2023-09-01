// Dirije a la página de login
const moveToLogin = () => {
  window.location.href = "/";
};

// Redireecionar a la pagina para recuperar contraseña
const moveToForgot = () => {
  window.location.href = "/forgot";
};

// Redireecionar a la pagina de login con github
const moveToGithub = () => {
  window.location.href = "/api/sessions/github";
};

// Función para crear un usuario
async function postSignup(first_name, last_name, age, username, password) {
  const data = {
    first_name,
    last_name,
    age,
    email: username,
    password,
  };

  const response = await fetch("/api/sessions/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (response.status === 200) {
    Swal.fire({
      icon: "success",
      title: "Usuario creado correctamente",
      showConfirmButton: false,
      timer: 1500,
    });
    moveToLogin();
  } else if (response.status === 500) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "El usuario ya existe.",
      showConfirmButton: true,
      confirmButtonText: "Recuperar contraseña",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        moveToForgot();
      } else if (result.isDenied) {
        moveToRegister();
      }
    });
    return false;
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al crear el usuario",
    });
    return false;
  }
}

// Escucha el evento submit del formulario de registro
const signupForm = document.getElementById("signup-form");

// Captura los datos del formulario de registro
signupForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const first_name = document.getElementById("first_name").value;
  const last_name = document.getElementById("last_name").value;
  const age = document.getElementById("age").value;

  // Envía los datos del formulario de registro y crea un usuario
  postSignup(first_name, last_name, age, username, password);
});
