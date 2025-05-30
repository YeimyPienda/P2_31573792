📧 Integración de Nodemailer, fakePayment API, Google Analytics y reCAPTCHA v2 en Express con TypeScript
📌 Tabla de Contenidos
Configuración de Nodemailer

Integración de fakePayment API

Google Analytics

Google reCAPTCHA v2

Variables de Entorno

Estructura de Archivos

📧 Nodemailer
Configuración para envío de correos a múltiples destinatarios
typescript
// src/utils/nodemailer.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = async (
  recipients: string[],
  subject: string,
  htmlContent: string
) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipients.join(', '),
      subject,
      html: htmlContent
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
Uso en controladores
typescript
// Ejemplo de envío a múltiples destinatarios
await sendEmail(
  ['destinatario1@example.com', 'destinatario2@example.com'],
  'Asunto importante',
  '<p>Contenido HTML del correo</p>'
);
💳 fakePayment API
Configuración para procesar pagos
typescript
// src/services/paymentService.ts
import axios from 'axios';

export const processPayment = async (paymentData: {
  amount: string;
  cardNumber: string;
  cvv: string;
  expMonth: string;
  expYear: string;
  fullName: string;
  currency: string;
  description: string;
}) => {
  try {
    const response = await axios.post(
      'https://fakepayment.onrender.com/payments',
      {
        ...paymentData,
        reference: `ref-${Date.now()}`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FAKEPAYMENT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Payment error:', error.response?.data || error.message);
    throw error;
  }
};
Ejemplo de endpoint
typescript
// src/routes/paymentRoutes.ts
import express from 'express';
import { processPayment } from '../services/paymentService';

const router = express.Router();

router.post('/process-payment', async (req, res) => {
  try {
    const result = await processPayment(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Error processing payment' 
    });
  }
});

export default router;
📊 Google Analytics
Integración en vistas EJS
html
<!-- views/layout.ejs -->
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-TU_ID_DE_ANALYTICS"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-TU_ID_DE_ANALYTICS');
  </script>
</head>
Seguimiento de eventos
javascript
gtag('event', 'purchase', {
  transaction_id: 'T12345',
  value: 100.0,
  currency: 'USD',
  items: [{
    item_name: 'Producto',
    item_id: 'P123',
    price: 100.0,
    quantity: 1
  }]
});
🔒 Google reCAPTCHA v2
Configuración en backend
typescript
// src/middlewares/recaptchaMiddleware.ts
import axios from 'axios';

export const verifyRecaptcha = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token
        }
      }
    );
    return response.data.success;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
};
Uso en formularios
html
<!-- Vista EJS -->
<form id="contact-form">
  <!-- Campos del formulario -->
  <div class="g-recaptcha" data-sitekey="<%= process.env.RECAPTCHA_SITE_KEY %>"></div>
  <button type="submit">Enviar</button>
</form>

<script src="https://www.google.com/recaptcha/api.js" async defer></script>
Validación en el controlador
typescript
router.post('/contact', async (req, res) => {
  const { 'g-recaptcha-response': token } = req.body;
  
  if (!(await verifyRecaptcha(token))) {
    return res.status(400).json({ error: 'reCAPTCHA verification failed' });
  }
  
  // Procesar formulario...
});
🔑 Variables de Entorno
env
# .env
# Nodemailer
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASSWORD=tu_contraseña_o_app_password

# fakePayment API
FAKEPAYMENT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Analytics
GA_TRACKING_ID=G-XXXXXXX

# reCAPTCHA
RECAPTCHA_SITE_KEY=6Le...
RECAPTCHA_SECRET_KEY=6Le...