import { Session, SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: number;
    username: string;
  }
}

declare module 'express' {
  interface Request {
    session: Session & Partial<SessionData>;
  }
}

// Declaraciones para módulos sin tipos
declare module 'cookie-parser';
declare module 'express-session';
declare module 'bcrypt';
declare module 'nodemailer';