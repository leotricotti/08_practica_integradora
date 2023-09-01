//Mostrar resultado operación por SweetAlert2
const showResult = (result) => {
  if (result) {
    Swal.fire({
      icon: "success",
      title: result,
      showConfirmButton: false,
      timer: 2000,
    });
  } else
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Algo salió mal! Vuelve a intentarlo",
      showConfirmButton: true,
      confirmButtonText: "Aceptar",
    });
};
