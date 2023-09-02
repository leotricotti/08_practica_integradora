import { Router } from "express";
import User from "../dao/dbmanager/users.manager.js";

const router = Router();
const userManager = new User();

//Ruta que agrega el id del carrito al usuario
router.post("/", async (req, res) => {
  const { cartId } = req.body;
  const username = req.session.user.email;
  try {
    const result = await userManager.addCartId(username, cartId);
    res.status(200).json({
      respuesta: "Carrito agregado con éxito",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error al agregar el carrito",
      data: err,
    });
  }
});

export default router;
