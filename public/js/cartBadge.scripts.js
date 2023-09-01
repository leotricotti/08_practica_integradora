//Codigo que muestra la cantidad de productos en el carrito de compras
const cartBadge = async () => {
  const cartId = localStorage.getItem("cartId");
  const cartBadge = document.getElementById("cart-badge");
  try {
    if (!cartId) {
      cartBadge.innerText = 0;
    } else {
      const response = await fetch(`/api/carts/cartbadge/${cartId}`);
      if (!response.ok) {
        throw new Error("Error al obtener el carrito");
      }
      const cart = await response.json();
      cartBadge.innerText = cart.products.length;
    }
  } catch (error) {
    console.error(error);
  }
};

cartBadge();
