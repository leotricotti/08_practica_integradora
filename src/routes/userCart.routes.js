import { Router } from "express";
import User from "../dao/dbmanager/users.manager.js";

const router = Router();
const userManager = new User();

//Ruta que agrega el id del carrito al usuario
router.post("/addCartId", async (req, res) => {
  const { username, cart } = req.body;
  try {
    const cartExist = result[0].cart.find((element) => element === cart);
    if (!cartExist) {
      const result = await userManager.updateCart(username, cart);
      res.status(200).json({
        respuesta: "Carrito agregado con éxito",
        data: result,
      });
    } else {
      return null;
    }
  } catch (err) {
    res.status(500).json({
      message: "Error al agregar el carrito",
      data: err,
    });
  }
});

export default router;
