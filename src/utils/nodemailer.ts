//importamos el modulo path del sistema web!!
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();
// src/utils/mailer.ts
import nodemailer from 'nodemailer';

// Configuración del transporter (SMTP o servicio como Gmail)
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Ejemplo con Gmail (requiere configuración especial)
    auth: {
        user:process.env.EMAIL_USER, // Tu correo (ej: tu@gmail.com)
        pass:process.env.EMAIL_PASSWORD, // Contraseña o "App Password" si usas 2FA
    },
});

// Función para enviar correos a múltiples destinatarios
export const sendEmail = async (
    recipients: string[], // Lista de correos: ['a@test.com', 'b@test.com']
    subject: string,
    htmlContent: string,
) => {
    try {
        const info = await transporter.sendMail({
            from:process.env.EMAIL_USER, // Remitente
            to: recipients.join(', '), // Convierte el array a string separado por comas
            subject,
            html: htmlContent,
        });

        console.log('Correo enviado: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error enviando correo:', error);
        return { success: false, error };
    }
};