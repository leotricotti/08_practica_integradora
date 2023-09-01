import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("signup", {
    title: "Crea tu cuenta",
    styles: "signup.styles.css",
  });
});

export default router;
