//Funcion que envia los datos al backend
async function postForgot(username, newPassword) {
  const response = await fetch("api/sessions/forgot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, newPassword }),
  });

  const result = await response.json();
  return result;
}

//Capturamos el formulario de login
const loginForm = document.getElementById("login-form");

//Funcion que captura los datos y actualiza la contraseña
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const newPassword = document.getElementById("new-password").value;

  if (password !== newPassword) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Las contraseñas no coinciden. Por favor, inténtelo de nuevo",
      showConfirmButton: false,
      timer: 1800,
    });
  } else {
    postForgot(username, newPassword)
      .then(() =>
        Swal.fire({
          icon: "success",
          title: "Contraseña actualizada con éxito",
          showConfirmButton: false,
          timer: 1800,
        }).then(() => {
          window.location.href = "/";
        })
      )
      .catch(() =>
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ha ocurrido un error. Por favor, inténtelo de nuevo",
          showConfirmButton: false,
          timer: 1800,
        })
      );
  }
});

// Función para mostrar la contraseña
const newEyeOpen = document.getElementById("new-eye-open");
const newPassword = document.getElementById("new-password");
const newEyeClose = document.getElementById("new-eye-close");
const newEyeContainer = document.getElementById("new-eye-container");

const showNewPassword = () => {
  if (newEyeOpen.classList.contains("show-password")) {
    newPassword.type = "text";
  } else {
    newPassword.type = "password";
  }
};

newEyeContainer.addEventListener("click", () => {
  newEyeOpen.classList.toggle("show-password");
  newEyeClose.classList.toggle("show-password");
  showNewPassword();
});
