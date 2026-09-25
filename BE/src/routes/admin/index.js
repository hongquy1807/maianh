import dashboardRoutes from './dashboard.js';
import customerRoutes from './user.js';
import orderRoutes from './donhang.js';
import { Router } from 'express';
import { requireAuth, requireAdmin } from '../auth.js';

import adminProductRoutes from './admin_sanpham.js';

const router = Router();
router.use(requireAuth, requireAdmin);
router.get('/me', (req, res) => {
  res.json({ ok: true, user: { id: req.user.id, email: req.user.email, full_name: req.user.full_name, role: req.user.role } });
});
router.use(dashboardRoutes);
router.use(orderRoutes);
router.use(customerRoutes);
router.use(adminProductRoutes);

export default router;
