import express, { Application } from 'express';
//importamos el modulo path del sistema web!!
import * as dotenv from 'dotenv';
import session from 'express-session';
// Cargar variables de entorno
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';
import mainRouter from '@routes/index.js'; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app: Application = express();
// Configuración de sesión
app.use(session({
  secret: 'tu_clave_secreta', // Cambia esto por una clave segura en producción
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Usar true en producción con HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 día de duración
  }
}));
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname,'public');
app.set('trust proxy', true);
app.use(express.static(publicDir));
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use('/', mainRouter);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Static files from: ${publicDir}`);
});
