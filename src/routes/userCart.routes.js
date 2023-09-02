import { Router } from "express";
import User from "../dao/dbmanager/users.manager.js";

const router = Router();
const userManager = new User();

//Ruta que agrega el id del carrito al usuario
router.post("/", async (req, res) => {
  const { cartId } = req.body;
  const username = req.session.user.email;
  try {
    const user = await userManager.getOne(username);
    const userId = user[0]._id;
    if (!user[0].carts.includes(cartId)) {
      user[0].carts.push(cartId);
    }
    const respuesta = await userManager.updateCart(userId, user[0]);
  } catch (err) {
    res.status(500).json({
      message: "Error al agregar el carrito",
      data: err,
    });
  }
});

export default router;
