import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import upload from '../config/multer';

const router = Router();

router.post('/create', upload.array('images', 5), ProductController.createProduct);

export default router;
