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
const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (savedPassword, password) => {
  return bcrypt.compareSync(password, savedPassword);
};

//Generar token
export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" });
  return token;
};

//Autenticar token
const authenticateToken = (req, res, next) => {
  const token = req.cookies["jwt"];
  if (!token) return res.status(401).send({ error: "No estas autorizado" });
  const myToken = token.split(" ")[1];

  jwt.verify(myToken, PRIVATE_KEY, (err, user) => {
    if (err) return res.stutus(403).send({ error: "No tienes permisos" });
    req.user = user;
    next();
  });
};

const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (error, user, info) {
      if (error) return next(error);
      if (!user)
        return res.status(401).json({
          error: info.messages ? info.messages : info.toString(),
        });
      req.user = user;
      next();
    })(req, res, next);
  };
};

const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).send({ error: "Unauthorized" });
    if (req.user.role != role)
      return res.status(403).send({ error: "No permissions" });
    next();
  };
};

export {
  __dirname,
  authorization,
  authenticateToken,
  createHash,
  isValidPassword,
  passportCall,
};
