import { Router } from "express";
import Cart from "../dao/dbmanager/carts.manager.js";

//Inicializar servicios
const router = Router();
const cartsManager = new Cart();

//Método asyncrono para obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    const carts = await cartsManager.getAll();
    res.json(carts);
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener los carritos",
      data: err,
    });
  }
});

//Método asyncrono para obtener un carrito
router.get("/cartbadge/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartsManager.getOne(cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({
        message: "Carrito no encontrado",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener el carrito",
      data: err,
    });
  }
});

//Método asyncrono para obtener un carrito
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartsManager.populatedCart(cid);
    const user = req.session.user[0]?.first_name ?? req.session.user.first_name;
    const product = cart.products;
    if (cart) {
      res.render("carts", {
        cart: product,
        styles: "carts.styles.css",
        user: user,
      });
    } else {
      res.status(404).json({
        message: "Carrito no encontrado",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener el carrito",
      data: err,
    });
  }
});

//Método asyncrono para crear un carrito
router.post("/", async (req, res) => {
  try {
    const newCart = req.body;
    const result = await cartsManager.saveCart(newCart);
    res.json({ message: "Carrito creado con éxito", data: newCart });
  } catch (err) {
    res.status(500).json({ message: "Error al crear el carrito ", data: err });
  }
});

//Método asyncrono para agregar productos al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { op } = req.body;
  try {
    const cart = await cartsManager.getOne(cid);
    let productExistsInCart = cart.products.findIndex(
      (dato) => dato.product == pid
    );
    productExistsInCart == -1
      ? cart.products.push({
          product: pid,
          quantity: 1,
        })
      : (cart.products[productExistsInCart].quantity =
          op === "add"
            ? cart.products[productExistsInCart].quantity + 1
            : cart.products[productExistsInCart].quantity - 1);

    const result = await cartsManager.updateCart(cid, cart);

    const updatedCart = await cartsManager.getOne(cid);

    res.json({ message: "Carrito actualizado con éxito", data: updatedCart });
  } catch (err) {
    res.status(500).json({
      message: "Error al actualizar el carrito",
      data: err,
    });
  }
});

//Método asyncrono para eliminar productos del carrito
router.delete("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartsManager.getOne(cid);
    let productExistsInCart = cart.products.findIndex(
      (dato) => dato.product == pid
    );
    productExistsInCart == -1
      ? res.status(404).json({ message: "Producto no encontrado" })
      : cart.products.splice(productExistsInCart, 1);
    const result = await cartsManager.updateCart(cid, cart);
    res.json({ message: "Producto eliminado con éxito", data: cart });
  } catch (err) {
    res.status(500).json({
      message: "Error al eliminar el producto del carrito",
      data: err,
    });
  }
});

//Método asyncrono para vaciar el carrito
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartsManager.getOne(cid);
    if (cart) {
      cart.products = [];
      const result = await cartsManager.updateCart(cid, cart);
      res.json({ message: "Carrito vaciado con éxito", data: cart });
    } else {
      res.status(404).json({
        message: "Carrito no encontrado",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error al vaciar el carrito",
      data: err,
    });
  }
});

export default router;
