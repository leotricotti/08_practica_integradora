import passport from "passport";
import * as dotenv from "dotenv";
import { Router } from "express";
import User from "../dao/dbmanager/users.manager.js";
import { createHash } from "../utils.js";

//Inicializa servicios
dotenv.config();
const router = Router();
const usersManager = new User();

//Ruta que realiza el registro
router.post(
  "/signup",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failRegister",
  }),
  async (req, res) => {
    res.status(200).json({ message: "Usuario creado con éxito" });
  }
);

//Ruta que se ejecuta cuando falla el registro
router.get("/failRegister", async (req, res) => {
  res.status(500).json({ error: "Error al crear el ususario" });
});

//Ruta que realiza el login
router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/failLogin",
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json("Error de autenticacion");
    }
    req.session.user = {
      first_name: req.user[0].first_name,
      last_name: req.user[0].last_name,
      email: req.user[0].email,
      age: req.user[0].age,
      role: req.user[0].role,
    };
    res.status(200).json({ message: "Usuario logueado con éxito" });
  }
);

//Ruta que recupera la contraseña
router.post("/forgot", async (req, res) => {
  const { username, newPassword } = req.body;

  const result = await usersManager.getOne(username);
  if (result.length === 0)
    return res.status(401).json({
      respuesta: "El usuario no existe",
    });
  else {
    const updatePassword = await usersManager.updatePassword(
      result[0]._id,
      createHash(newPassword)
    );
    res.status(200).json({
      respuesta: "Contrseña actualizada con éxito",
    });
  }
});

//Ruta que cierra la sesión
const handleLogout = (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect("/");
  });
};

router.get("/logout", handleLogout);

//Ruta que realiza el login con github
router.get(
  "/github",
  passport.authenticate(
    "github",
    { scope: ["user:email"] },
    async (req, res) => {}
  )
);

//Callback de github
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/api/products?page=1");
  }
);

export default router;
