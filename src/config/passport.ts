import passport from 'passport';
import * as dotenv from 'dotenv';
dotenv.config();
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import contactosModel from '@models/models.js'; // Ajusta la ruta según tu estructura
const UserModel = contactosModel.getModelUser();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.NODE_ENV === 'production'
    ? 'https://p2-31573792-2.onrender.com/auth/google/callback'
    : 'http://localhost:3000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    
    if (!email) {
      return done(new Error('No email provided by Google'));
    }

    let user = await UserModel.findOne({ where: { email } });

    if (!user) {
      user = await UserModel.create({
        username: profile.displayName,
        email: email, // Ahora estamos seguros que email es string
        googleId: profile.id,
        provider: 'google'
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Serialización
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await UserModel.findByPk(id);
    done(null, {
      id: user?.id,
      username: user?.username,
      email: user?.email,
    });
  } catch (err) {
    done(err);
  }
});

export default passport;