import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import * as dotenv from "dotenv";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import UserCart from "./routes/userCart.routes.js";
import CartsRouter from "./routes/carts.routes.js";
import LoginRouter from "./routes/login.routes.js";
import SignUpRouter from "./routes/signup.routes.js";
import ForgotRouter from "./routes/forgot.routes.js";
import SessionsRouter from "./routes/sessions.routes.js";
import ProductsRouter from "./routes/products.routes.js";
import Products from "./dao/dbmanager/products.manager.js";
import RealTimeProducts from "./routes/realTimeProducts.routes.js";
import {
  initializePassport,
  githubStrategy,
} from "./config/passport.config.js";

// Inicializar servicios
dotenv.config();
const productsManager = new Products();

//Variables
const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI;

// Middlewares
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Handlebars
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main.handlebars",
    extname: "hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);

// Connect to MongoDB
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 30 * 60,
    }),
    secret: "codersecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
githubStrategy();
initializePassport();
app.use(passport.initialize());

// Conexión respuesta de la base de datos
const enviroment = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Base de datos conectada");
  } catch (error) {
    console.log(error);
  }
};

enviroment();

// Routes
app.use("/", LoginRouter);
app.use("/forgot", ForgotRouter);
app.use("/signup", SignUpRouter);
app.use("/api/userCart", UserCart);
app.use("/api/carts", CartsRouter);
app.use("/api/sessions", SessionsRouter);
app.use("/api/products", ProductsRouter);
app.use("/api/realtimeproducts", RealTimeProducts);

// Server
const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket
const io = new Server(httpServer);
// Código para el manejo de conexiones de socket
io.on("connection", async (socket) => {
  // Mensaje de bienvenida al cliente que se conectó
  console.log("Un cliente se ha conectado");

  // Obtener datos de la base de datos
  socket.on("nextPage", async (page) => {
    try {
      const products = await productsManager.getAll();
      const orderedProducts = products.reverse();
      const paginatedProducts = orderedProducts.slice(0, page * 10);
      io.emit("products", paginatedProducts);
    } catch (error) {
      // Manejar el error
      console.log(error);
    }
  });
});
