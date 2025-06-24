import express, { Application } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import passport from '@config/passport.js';
import authRoutes from '@routes/auth.js';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import mainRouter from '@routes/index.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu_clave_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 1 día
    httpOnly: true,
    sameSite: 'lax' as const // Solución para el error de tipo
  }
}));

// Middleware para parsear cookies
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Middleware para establecer cookies seguras
app.use((req, res, next) => {
  // Configuración de la cookie
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000, // 15 minutos
    sameSite: 'lax' as const // Solución para el error de tipo
  };

  if (!req.cookies.sessionId) {
    res.cookie('sessionId', 'tu_valor_de_sesion', cookieOptions);
  }
  next();
});

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

app.set('trust proxy', true);
app.use(express.static(publicDir));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas
app.use('/', mainRouter);
app.use(authRoutes);

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Static files from: ${publicDir}`);
});