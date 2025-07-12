import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

// All routes in this file require admin access
router.use(authMiddleware('admin'));

// Admin dashboard stats
router.get('/stats', (req, res) => {
  res.json({ message: 'Admin statistics' });
});

// User management
router.patch('/users/:id', async (req, res) => {
  // Update user logic
});

export default router;