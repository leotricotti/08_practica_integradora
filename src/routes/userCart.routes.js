import { Router } from "express";
import User from "../dao/dbmanager/users.manager.js";

const router = Router();
const userManager = new User();

//Ruta que agrega el id del carrito al usuario
router.post("/addCart", async (req, res) => {
  const { user, cart } = req.body;

  const result = await userManager.addCart(user, cart);
  if (result.length === 0)
    return res.status(401).json({
      respuesta: "El usuario no existe",
    });
  else {
    res.status(200).json({
      respuesta: "Carrito agregado con éxito",
    });
  }
});

export default router;
