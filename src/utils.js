import { dirname } from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";

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
