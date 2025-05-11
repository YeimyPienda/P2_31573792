import ContactosModel from '@models/models.js';
import {Request,Response} from 'express';

interface Contacto {
  email: string;
  nombre: string;
  comentario: string;
  ip?: string;
}
interface Payment {
  correo: string;
  nombreTitular: string;
  cardNumber: string;
  expMonth: number | string;
  expYear: number | string;
  cvv: string;
  currency: string;
  amount:string
}

class ContactsController {
  /**
   * Agrega un nuevo contacto y envía notificación por correo
   * @param {Request} req - Objeto de solicitud HTTP
   * @param {Response} res - Objeto de respuesta HTTP
   */
  async add(req:Request,res:Response):Promise<void>{
    const {email,nombre,comentario}: Contacto = req.body;
    try {
       const ip = req.ip || 'unknown';
      await ContactosModel.addContact({email,nombre,comentario,ip});
      res.status(201).json({status:true});
    } catch (error: any){
      console.error(error);
      res.status(500).json({
        message: 'Error al agregar el contacto',
        status: false
      });
    }
  }

  async getAllContacts(req:Request,res:Response):Promise<void>{
    try {
      const contacts = await ContactosModel.getAllContacts();
      console.log("Datos a renderizar:", contacts);
      res.render('contactos', { contacts });
    } catch(error: any) {
      console.error('Error:', error);
      res.status(500).render('error', { message: 'Error al cargar contactos' });
    }
  }

  payment(req:Request,res:Response):Promise<void>{
  return new Promise<void>((resolve) => {
    try {
      res.render('payment');
      resolve();
    } catch(error: any) {
      console.error('Error:', error);
      res.status(500).render('error', { message: 'error al cargar vista formulario de pago' });
      resolve();
    }
  });
}

  async paymentAdd(req: Request, res: Response): Promise<void> {
    const { correo, nombreTitular, cardNumber, expMonth, expYear, cvv, currency,amount}: Payment = req.body;

    try {
      await ContactosModel.paymentAdd({
        correo,
        nombreTitular,
        cardNumber:String(cardNumber),
        expMonth: Number(expMonth),
        expYear: Number(expYear),
        cvv: String(cvv),
        currency,
        amount:String(amount)
      });
      res.status(201).json({status:true});
    } catch(error: any) {
      console.error('Error:', error);
      res.status(500).render('error', { 
        message: 'Error al procesar el pago',
        error: error.message
      });
    }
  }

  async getPayment(req: Request, res: Response):Promise<void>{
   try{
   const datePayments = await ContactosModel.getAllPayments();
   res.render('getPayments',{datePayments});
   }catch(error:any){
     console.error('Error:', error);
     res.status(500).render('error', { 
      message: 'Error al procesar el pago',
      error: error.message
    });
   }
 }

  /**
   * Obtiene todos los comentarios
   * @param {Request} req - Objeto de solicitud HTTP
   * @param {Response} res - Objeto de respuesta HTTP
   */
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

  /**
   * Renderiza la página principal con las imágenes disponibles
   * @param {Request} req - Objeto de solicitud HTTP
   * @param {Response} res - Objeto de respuesta HTTP
   */
async index(req: Request, res: Response): Promise<void> {
  try {
    res.render('index');
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
}



}

export default new ContactsController();