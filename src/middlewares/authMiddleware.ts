// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session.userId) {
    next();
    return;
  }
  res.redirect('/login');//a
};

export const isGuest = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session.userId) {
    next();
    return;
  }
  res.redirect('/');
};