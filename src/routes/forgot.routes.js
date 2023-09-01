import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("forgot", {
    title: "Recuperar constraseña",
    styles: "login.styles.css",
  });
});

export default router;
