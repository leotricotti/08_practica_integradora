import { Router } from "express";
import User from "../dao/dbmanager/users.manager.js";

const router = Router();
const userManager = new User();

//Ruta que agrega el id del carrito al usuario
router.get("/", async (req, res) => {
  const { cartId } = req.body;
  const username = req.session.user.email;
  try {
    const user = await userManager.getOne(username);

    user.carts.push({ cart: cartId });
    const result = await userManager.updateCart(user, cartId);
  } catch (err) {
    res.status(500).json({
      message: "Error al agregar el carrito",
      data: err,
    });
  }
});

export default router;
