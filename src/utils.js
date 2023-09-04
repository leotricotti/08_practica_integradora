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

export default __dirname;
