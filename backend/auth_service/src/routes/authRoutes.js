// import express from 'express';
// import { register, login, getAllDrivers } from '../controllers/authController.js';
// import User from '../models/User.js';
// import { authenticate, requireRole, allowRoles } from '../middlewares/authMiddleware.js';

// const router = express.Router();

// // ✅ Register new user (customer / restaurant / delivery / admin)
// router.post('/register', register);

// // ✅ Login for any user
// router.post('/login', login);

// // ✅ Get all users (admin only)
// router.get('/users', authenticate, requireRole('admin'), async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ Delete a user (admin only)
// router.delete('/users/:id', authenticate, requireRole('admin'), async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.json({ message: 'User deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ Get all delivery drivers (accessible by admin and customer for delivery assignment)
// router.get('/drivers', authenticate, allowRoles(['admin', 'customer']), getAllDrivers);

// export default router;

// src/routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {
  register,
  login,
  getAllDrivers,
} from '../controllers/authController.js';
import User from '../models/User.js';
import { authenticate, requireRole, allowRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ Register new user (customer / restaurant / delivery / admin)
router.post('/register', register);

// ✅ Password login
router.post('/login', login);

// ✅ OAuth login (Google)
router.get('/oauth/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/oauth/callback/google', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Sign JWT
  const token = jwt.sign(
    {
      sub: String(req.user._id),
      id: String(req.user._id),
      email: req.user.email,
      role: req.user.role,
      iss: process.env.JWT_ISSUER || 'auth-service',
      aud: process.env.JWT_AUDIENCE || 'your-api',
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

  // Redirect to frontend
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const callbackUrl = `${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
    name: req.user.name,
  }))}`;
  res.redirect(callbackUrl);
});

// ✅ Get all users (admin only)
router.get('/users', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete a user (admin only)
router.delete('/users/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all delivery drivers (admin & customer)
router.get('/drivers', authenticate, allowRoles(['admin', 'customer']), getAllDrivers);

export default router;
