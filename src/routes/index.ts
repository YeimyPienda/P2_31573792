import { Router } from 'express';
import path from 'path';
import ContactosController from '@controllers/controllers.js';
import { isAuthenticated, isGuest } from '@middlewares/authMiddleware.js';
const router = Router();

router.get('/',ContactosController.index);
router.get('/admin/contacts',isAuthenticated,ContactosController.getAllContacts);
router.get('/payment',isAuthenticated,ContactosController.payment);
router.get('/getPayment',isAuthenticated,ContactosController.getPayment);
router.get('/login',ContactosController.login);
router.get('/filter',ContactosController.getFilteredContact);
router.get('/filterPayment',ContactosController.filterPayment);
//RUTAS POST
router.post('/contact/add',ContactosController.add);
router.post('/payment/add',ContactosController.paymentAdd);
router.post('/registerUser',isGuest,ContactosController.registerUser);
router.post('/loginPost',isGuest,ContactosController.loginPost);

export default router;