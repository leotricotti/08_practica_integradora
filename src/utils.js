import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dirname } from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";

//Variables
dotenv.config();
const PRIVATE_KEY = process.env.PRIVATE_KEY;

//Rutas de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Encriptar contraseña
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (savedPassword, password) => {
  return bcrypt.compareSync(password, savedPassword);
};

//Generar token
export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" });
  return token;
};

//Autenticar token
export const authenticateToken = (req, res, next) => {
  const token = req.cookies["jwt"];
  if (!token) return res.status(401).send({ error: "No estas autorizado" });
  const myToken = token.split(" ")[1];

  jwt.verify(myToken, PRIVATE_KEY, (err, user) => {
    if (err) return res.stutus(403).send({ error: "No tienes permisos" });
    req.user = user;
    next();
  });
};

export default __dirname;
