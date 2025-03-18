import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRouter';
import productRoutes from './routes/productRouter';
import path from 'path';
dotenv.config();

const app = express();
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
