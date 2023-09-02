//Cerrar sesión
const logout = async () => {
  const response = await fetch("/api/sessions/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response) {
    Swal.fire({
      icon: "success",
      title: "Gracias por utilizar nuestros servicios",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      localStorage.removeItem("currentPage");
      window.location.href = "/";
    });
  }
  return response;
};
