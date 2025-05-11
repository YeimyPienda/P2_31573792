import express, { Application } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mainRouter from '@routes/index.js'; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app: Application = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname,'public');
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
