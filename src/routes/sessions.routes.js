import passport from "passport";
import { Router } from "express";
import User from "../dao/dbmanager/users.manager.js";
import { createHash, generateToken } from "../utils.js";

//Inicializa variables
const router = Router();
const usersManager = new User();

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
    const { username, role } = req.user[0];
    const accestoken = generateToken({ username, role });
    res.cookie("jwt", accestoken, { httpOnly: true, secure: false });
    res.status(200).json({ message: "Usuario logueado con éxito" });
  }
);

//Ruta que se ejecuta cuando falla el login
router.get("/failLogin", async (req, res) => {
  res.status(401).json({ message: "No se ha podido iniciar sesión" });
});

//Ruta que realiza el registro
router.post(
  "/signup",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failRegister",
  }),
  async (req, res) => {
    const accestoken = generateToken(req.user);
    res.status(200).json({ message: "Usuario creado con éxito" });
  }
);

//Ruta que se ejecuta cuando falla el registro
router.get("/failRegister", async (req, res) => {
  res.status(500).json({ error: "Error al crear el ususario" });
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

//Ruta que obtine el usuario logueado del token
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }, (req, res) => {
    res.send(req.user);
  })
);

export default router;
