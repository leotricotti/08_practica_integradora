import { Router } from "express";
import User from "../dao/dbmanager/users.manager.js";
import Product from "../dao/dbmanager/products.manager.js";

//Inicializar servicios
const router = Router();
const usersManager = new User();
const productsManager = new Product();

// Método asyncrono para obtener los productos en tiempo real
router.get("/", async (req, res) => {
  try {
    const sessionUser = req.session.user[0]?.email ?? req.session.user.email;
    const user = await usersManager.getOne(sessionUser);
    res.render("realTimeProducts", {
      styles: "realTimeProducts.styles.css",
      title: "Productos en tiempo real",
      user: user[0].first_name,
    });
  } catch (err) {
    res
      .status(404)
      .json({ message: "Error al obtener los productos", data: err });
  }
});

//Metodo asyncrono para guardar un producto
router.post("/", async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } =
    req.body;
  if (!title || !description || !price || !code || !stock) {
    res.status(400).json({ message: "Faltan datos" });
  } else {
    const product = {
      title: title,
      description: description,
      code: code,
      price: price,
      stock: stock,
      category: category,
      thumbnails: !thumbnails ? "" : thumbnails,
    };

    try {
      let result = await productsManager.saveProducts(product);
      res.json({ message: "Producto creado con éxito", data: product });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error al crear el producto", data: err });
    }
  }
});

export default router;
