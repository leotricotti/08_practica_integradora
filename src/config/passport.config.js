import passport from "passport";
import * as dotenv from "dotenv";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import User from "../dao/dbmanager/users.manager.js";
import { createHash, isValidPassword } from "../utils.js";

// Inicializar servicios
dotenv.config();
const userManager = new User();
const LocalStrategy = local.Strategy;

const ADMIN_ID = process.env.ADMIN_ID;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const initializePassport = () => {
  // Configurar passport para registrar usuarios
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        let role;
        if (username !== ADMIN_ID || password !== ADMIN_PASSWORD) {
          role = "admin";
        } else {
          role = "user";
        }
        try {
          const user = await userManager.getOne(username);
          if (user.length > 0) {
            return done(null, false, {
              message: "Error al crear el usuario. El usuario ya existe",
            });
          } else {
            const newUser = {
              first_name,
              last_name,
              email,
              age,
              password: createHash(password),
              role: role,
            };
            let result = await userManager.signup(newUser);
            return done(null, result);
          }
        } catch (error) {
          return done("Error al obtener el usuario", error);
        }
      }
    )
  );

  // Configurar passport para loguear usuarios
  passport.use(
    "login",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "username",
        passwordField: "password",
      },
      async (req, username, password, done) => {
        try {
          const user = await userManager.getOne(username);
          if (user.length === 0) {
            return done(null, false, {
              message: "El usuario no existe",
            });
          }
          if (!isValidPassword(user[0].password, password)) {
            return done(null, false, { message: "Contraseña incorrecta" });
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done("Error al obtener el usuario", error);
        }
      }
    )
  );

  // Serializar y deserializar usuarios
  passport.serializeUser((user, done) => {
    done(null, user[0].email);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userManager.getOne(id);
    done(null, user);
  });
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

  // Serializar y deserializar usuarios
  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userManager.getOne(id);
    done(null, user);
  });
};

export { initializePassport, githubStrategy };
