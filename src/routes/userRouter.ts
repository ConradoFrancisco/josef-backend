// routes/userRoutes.ts
import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.post('/create', UserController.createUser);
router.get('/activate/:token', UserController.activateUser);
export default router;
