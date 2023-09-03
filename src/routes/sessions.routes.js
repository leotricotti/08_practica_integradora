import passport from "passport";
import * as dotenv from "dotenv";
import { Router } from "express";
import User from "../dao/dbmanager/users.manager.js";
import { createHash, generateToken } from "../utils.js";

//Inicializa servicios
dotenv.config();
const router = Router();
const usersManager = new User();
// Clave secreta
const PRIVATE_KEY = process.env.PRIVATE_KEY;

//Configurar current endpoint
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    res.send(req.user);
  }
);

//Ruta que realiza el registro
router.post(
  "/signup",
  passport.authenticate("register", {
    passReqToCallback: true,
    session: false,
    failureRedirect: "/api/sessions/failRegister",
    failureMessage: true,
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
  (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json("Faltan datos");
    }
    const result = usersManager.getOne(username);
    if (result.length > 0) {
      const myToken = generateToken({ username, password, role });
      res.cookie("token", myToken, {
        maxAge: 1000 * 60 * 60,
      });
      res.status(200).json({ message: "Usuario logueado con éxito" });
    } else {
      res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }
  }
);

//Ruta que se ejecuta cuando falla el login
router.get("/failLogin", async (req, res) => {
  res.status(401).json({ message: "No se ha podido iniciar sesión" });
});

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
