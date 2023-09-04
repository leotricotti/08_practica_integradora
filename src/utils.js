import bcrypt from "bcrypt";
import bcrypt from "bcrypt";
import { dirname } from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";

//Variables
dotenv.config();

//Rutas de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Clave secreta
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Token de autenticación
export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" });
  return token;
};

// export const authToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader)
//     return res.status(401).json({ message: "No estas autorizado" });

//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
//     if (error) return res.status(403).json({ message: "Token no valido" });
//     req.user = credentials.user;
//     next();
//   });
// };

//Encriptar contraseña
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (savedPassword, password) => {
  return bcrypt.compareSync(password, savedPassword);
};

export default __dirname;
