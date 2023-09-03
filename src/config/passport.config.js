import jwt from "passport-jwt";
import passport from "passport";
import * as dotenv from "dotenv";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import User from "../dao/dbmanager/users.manager.js";
import { createHash, isValidPassword } from "../utils.js";

// Inicializar servicios
dotenv.config();
const userManager = new User();
const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

const initializePassport = () => {
  // Configurar passport para validar el token
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      },
      async (payload, done) => {
        try {
          const user = await userManager.getOne(payload.email);
          if (user.length === 0) {
            return done(null, false, {
              message: "El usuario no existe",
            });
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done("Error al obtener el usuario", error);
        }
      }
    )
  );
};

// Configurar passport para loguear usuarios con github
const githubStrategy = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userManager.getOne(profile?.emails[0]?.value);
          if (user.length === 1) {
            return done(null, user);
          } else {
            const newUser = {
              first_name: profile.displayName.split(" ")[0],
              last_name: profile.displayName.split(" ")[1],
              email: profile?.emails[0]?.value,
              age: 18,
              password: "123",
            };
            const userNew = await userManager.signup(newUser);
            return done(null, userNew);
          }
        } catch (error) {
          return done("Error al crear el usuario", error);
        }
      }
    )
  );
};

export { initializePassport, githubStrategy };
