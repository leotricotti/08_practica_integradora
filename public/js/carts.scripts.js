//Incrementa la cantidad de un producto en el carrito
const increaseQuantity = async (idProduct) => {
  const cartId = localStorage.getItem("cartId");
  const response = await fetch(`/api/carts/${cartId}/product/${idProduct}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      op: "add",
    }),
  });
  if (response) showResult("Producto agregado con éxito");
  refreshPage();
  return response;
};

//Decrementa la cantidad de un producto en el carrito
const decreaseQuantity = async (idProduct) => {
  //Obtener cartId de localStorage
  const cartId = localStorage.getItem("cartId");
  const response = await fetch(`/api/carts/${cartId}/product/${idProduct}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response) showResult("Producto eliminado con éxito");
  refreshPage();
  return response;
};

//Elimina un producto del carrito
const deleteProduct = async (idProduct) => {
  //Obtener cartId de localStorage
  const cartId = localStorage.getItem("cartId");
  const response = await fetch(`/api/carts/${cartId}/product/${idProduct}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response) showResult("Producto eliminado con éxito");
  refreshPage();
  return response;
};

//Elimina todos los productos del carrito
const deleteAllProducts = async () => {
  //Obtener cartId de localStorage
  const cartId = localStorage.getItem("cartId");
  const response = await fetch(`/api/carts/${cartId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response) showResult("Carrito vaciado con éxito");
  refreshPage();
  return response;
};

//Refrescar página
const refreshPage = () => {
  setTimeout(() => {
    window.location.reload();
  }, 1800);
};

//Direccionar a la pagina de productos anterior
const continueBuying = (page) => {
  page = localStorage.getItem("currentPage");
  window.location.href = `/api/products?page=${page}`;
};

//Cerrar sesión
const logoutBuy = async () => {
  const response = await fetch("/api/sessions/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  window.location.href = "/";
  localStorage.removeItem("cartId");
  return response;
};

//Finalizar compra
const finishBuy = () => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, finalizar compra",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "¡Compra finalizada con éxito!",
        text: "En unos minutos recibirás un correo con los detalles de tu compra",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("cartId");
          window.location.href = "/";
          logout();
        }
      });
    }
  });
};
