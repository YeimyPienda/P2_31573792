// Extensión de la interfaz Session para incluir userId y username
declare module 'express-session' {
  interface Session {
    userId: number;
    username: string;
  }
}

import ContactosModel from '@models/models.js';
import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { sendEmail } from '../utils/nodemailer.js';
import { UniqueConstraintError, Op, Optional } from 'sequelize';

let formType: string;

interface Contacto {
  email: string;
  nombre: string;
  comentario: string;
  ip?: string;
  pais?: string;
}

interface Payment {
  correo: string;
  nombreTitular: string;
  cardNumber: string;
  expMonth: number | string;
  expYear: number | string;
  cvv: string;
  currency: string;
  amount: string;
  descripcion: string;
  reference?: string;
  estado: string;
}

interface User {
  id?: number;
  username: string;
  email: string;
  password_hash: string;
  passwordHash: string;
}

interface UserAttributesOptional extends Optional<User, 'username' | 'passwordHash'> {}

class ContactsController {
  async getFilteredContact(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;
      const filterResult = await ContactosModel.getFilteredContact(query);
      if (filterResult.length > 0) {
        res.json({ message: 'Datos encontrados', status: true, filterResult, query });
      } else {
        res.json({ message: 'Sin resultados', status: false, query });
      }
    } catch (error: any) {
      console.error('Error al filtrar:', error.message);
      res.status(500).json({
        status: false,
        message: 'Error interno al filtrar',
      });
    }
  }

  async filterPayment(req: Request, res: Response): Promise<void> {
    const { q, estado, servicio, fechaInicio, fechaFin } = req.query;

    const where: any = {};

    if (q) {
      where[Op.or] = [
        { nombreTitular: { [Op.like]: `%${q}%` } },
        { correo: { [Op.like]: `%${q}%` } },
      ];
    }

    if (estado) {
      where.estado = estado;
    }

    if (servicio) {
      where.descripcion = servicio;
    }

    if (fechaInicio && fechaFin) {
      where.createdAt = {
        [Op.between]: [new Date(fechaInicio as string), new Date(fechaFin as string)]
      };
    } else if (fechaInicio) {
      where.createdAt = {
        [Op.gte]: new Date(fechaInicio as string)
      };
    } else if (fechaFin) {
      where.createdAt = {
        [Op.lte]: new Date(fechaFin as string)
      };
    }

    try {
      const results = await ContactosModel.filterPayment(where);
      res.json({ status: true, filterResult: results });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: 'Error al filtrar pagos' });
    }
  }

  async add(req: Request, res: Response): Promise<void> {
    const SECRET_KEY = process.env.SECRET_KEYY;
    const { email, nombre, comentario } = req.body;

    if (!email || !nombre || !comentario) {
      res.status(400).json({ 
        status: false, 
        message: 'Faltan campos obligatorios.' 
      });
      return;
    }

    try {
      const token = req.body['g-recaptcha-response'];
      if (!token) {
        res.status(400).json({ 
          status: false, 
          message: 'Por favor, confirma que no eres un robot.' 
        });
        return;
      }

      const recaptchaResponse = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        { params: { secret: SECRET_KEY, response: token } }
      );

      if (!recaptchaResponse.data.success) {
        res.status(400).json({ 
          status: false, 
          message: 'Falló la verificación del captcha.' 
        });
        return;
      }

      const ip = req.ip || 'unknown';
      const ipstackResponse = await fetch(
        `http://api.ipstack.com/${ip}?access_key=${process.env.KEYIPAPI}`
      );
      const ipstackData = await ipstackResponse.json();
      const pais = ipstackData.country_name || 'datos-de-prueba-activados';

      await ContactosModel.addContact({ email, nombre, comentario, pais, ip });

      const subject = 'Programación con typescript';
      const message = `Datos del usuario:
        Nombre: ${nombre}
        Email: ${email}
        Comentario: ${comentario}
        Pais: ${pais}
        dirección IP: ${ip}
        fecha y hora: ${new Date()}`;

      const recipients = ['programacion2ais@yopmail.com', 'angelguerra378@gmail.com'];
      const result = await sendEmail(recipients, subject, message);

      if (!result.success) {
        console.error('Error al enviar correo:', result.error);
      }

      res.status(201).json({ 
        status: true, 
        message: 'Contacto registrado correctamente.',
        emailSent: result.success 
      });

    } catch (error: any) {
      console.error('Error en /contact/add:', error.message);
      res.status(500).json({
        status: false,
        message: 'Error interno al agregar el contacto',
      });
    }
  }

  async getAllContacts(req: Request, res: Response): Promise<void> {
    try {
      const contacts = await ContactosModel.getAllContacts();
      console.log("Datos a renderizar:", contacts);
      res.render('contactos', { contacts, isAdmin: true });
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).render('error', { message: 'Error al cargar contactos' });
    }
  }

  payment(req: Request, res: Response): Promise<void> {
    return new Promise<void>((resolve) => {
      try {
        res.render('payment', { isAdmin: true });
        resolve();
      } catch (error: any) {
        console.error('Error:', error);
        res.status(500).render('error', { message: 'error al cargar vista formulario de pago' });
        resolve();
      }
    });
  }

  async paymentAdd(req: Request, res: Response): Promise<void> {
    const { correo, nombreTitular, cardNumber, expMonth, expYear, cvv, currency, amount, descripcion }: Payment = req.body;
    const reference = nanoid(10);

    try {
      const response = await fetch('https://fakepayment.onrender.com/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.KEYAPIFAKE}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "amount": amount.toString(),
          "card-number": cardNumber,
          "cvv": cvv,
          "expiration-month": expMonth,
          "expiration-year": expYear,
          "full-name": nombreTitular,
          "currency": currency,
          "description": descripcion,
          "reference": reference
        })
      });

      const data = await response.json();

      if (!response.ok) {
        res.status(400).json({
          status: false,
          message: data.message || 'Error en el pago'
        });
        return;
      }

      await ContactosModel.paymentAdd({
        correo,
        nombreTitular,
        cardNumber: String(cardNumber),
        expMonth: Number(expMonth),
        expYear: Number(expYear),
        cvv: String(cvv),
        currency,
        amount: String(amount),
        descripcion: String(descripcion),
        reference,
        estado: 'pendiente'
      });

      res.status(201).json({
        status: true,
        pago: true,
        transactionId: data.data.transaction_id
      });

    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).render('error', { 
        message: 'Error al procesar el pago',
        error: error.message
      });
    }
  }

  async getPayment(req: Request, res: Response): Promise<void> {
    try {
      const datePayments = await ContactosModel.getAllPayments();
      res.render('getPayments', { datePayments, isAdmin: true });
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).render('error', { 
        message: 'Error al obtener pagos',
        error: error.message
      });
    }
  }

  async getComentarios(req: Request, res: Response): Promise<void> {
    try {
      const comentarios = await ContactosModel.getAllContacts();
      res.status(200).json(comentarios);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ 
        message: 'Error al obtener comentarios',
        status: false
      });
    }
  }

  async index(req: Request, res: Response): Promise<void> {
    try {
      res.render('index', {
        sitioKey: process.env.SITIO_KEY,
        isAdmin: false,
        title: 'SeguriHome - Seguridad Inteligente para Hogares',
        description: 'pagina de programacion II',
        imageUrl: 'https://p2-31573792-1.onrender.com/img/password.svg',
        pageUrl: 'https://p2-31573792-1.onrender.com'
      });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).send('Error en el servidor');
    }
  }

  login(req: Request, res: Response): void {
    formType = req.query.form as string;
    try {
      res.render('auth', { formType, isAdmin: false });
    } catch (error: any) {
      console.error('', error.message);
      res.status(500).json({
        status: false,
        message: 'Error al renderizar login',
      });
    }
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    const SALT_ROUNDS = 10;
    const { username, email, password_hash, passwordHash }: User = req.body;
    let m: string = '';
    
    if (!username || !email || !password_hash || !passwordHash) {
      res.status(400).json({
        status: false,
        message: 'Todos los campos son obligatorios'
      });
      return;
    }

    if (password_hash !== passwordHash) {
      res.status(400).json({
        status: false,
        message: '¡Las contraseñas no coinciden!'
      });
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password_hash, SALT_ROUNDS);

      await ContactosModel.registerUser({ username, email, password_hash: hashedPassword });
      
      res.json({
        status: true,
        message: '¡Usuario creado correctamente!'
      });

    } catch (error: any) {
      console.error('Error en registro:', error);

      if (error instanceof UniqueConstraintError) {
        const errors = error.errors.map(err => ({
          field: err.path,
          message: `El ${err.path} ya está en uso`
        }));
        errors.forEach(item => {
          m = item.message;
        });
        res.status(409).json({
          status: 'notUnique',
          message: `Error de datos duplicados ${m}`
        });
        return;
      }

      res.status(500).json({
        status: false,
        message: 'Error al registrar usuario'
      });
    }
  }

  async loginPost(req: Request, res: Response): Promise<void> {
  const { email, password_hash } = req.body;
  try {
    const result = await ContactosModel.loginPost({ email, password_hash });
    if (result.success && result.user && result.user.username) { // Verificamos que username existe
      if (req.session) {
        req.session.userId = result.user.id as number;
        req.session.username = result.user.username; // Ahora TypeScript sabe que username es string
      }
      res.json({ 
        status: true,
        message: 'Bienvenido al sistema',
      });
    } else {
      res.status(401).json({
        status: false,
        message: result.message || 'Credenciales inválidas'
      });
    }
  } catch (error: any) {
    console.error('Error en el servidor:', error.message);
    res.status(500).json({
      status: false,
      message: 'Error interno al iniciar sesión'
    });
  }
}

  async logout(req: Request, res: Response): Promise<void> {
    req.session.destroy((err:any) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        res.status(500).json({ message: 'Error al cerrar sesión' });
        return;
      }
      res.redirect('/');
    });
  }
}

export default new ContactsController();