import express from 'express';
import passport from '@config/passport.js';

const router = express.Router();

// Inicia login con Google
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    if (req.user) {
      // Sincronizar con express-session
      req.session.userId = (req.user as any).id;
      req.session.username = (req.user as any).username;
    }
    res.redirect('/admin/contacts');
  }
);
// Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) console.error('Error al cerrar sesión con Google:', err);
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});


export default router;
