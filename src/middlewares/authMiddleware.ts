// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.userId) {
    // Usuario autenticado, continuar
    return next();
  }
  // Usuario no autenticado
  return res.status(401).json({ message: 'No autorizado' });
};

export const isGuest = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.userId) {
    // Usuario no autenticado, continuar
    return next();
  }
  // Usuario ya autenticado
  return res.redirect('/admin/contacts');
};