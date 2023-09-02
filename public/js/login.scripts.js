// Redireecionar a la página de registro
const moveToSignup = () => {
  window.location.href = "/signup";
};

// Redireecionar a la página de recuperar contraseña
const moveToForgot = () => {
  window.location.href = "/forgot";
};

// Redireecionar a la pagina de login con github
const moveToGithub = () => {
  window.location.href = "/api/sessions/github";
};

//Capturar datos del formulario de registro y los envía al servidor
async function postLogin(username, password) {
  try {
    const response = await fetch("/api/sessions/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Usuario o contraseña incorrectos",
      });
      return;
    }

    const result = await response.json();

    if (!result) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Usuario o contraseña incorrectos",
      });
      return;
    }

    window.location.href = "/api/products?page=1";
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//Crea un carrito vacío en la base de datos
const createCart = async () => {
  if (localStorage.getItem("cartId")) {
    return;
  }
  const response = await fetch("/api/carts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      products: [],
    }),
  });
  const result = await response.json();
};

//Capturar datos del formulario de login y los envía al servidor
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  postLogin(username, password);
  createCart();
});
