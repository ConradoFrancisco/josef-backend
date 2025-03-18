import { Request, Response } from 'express';
import ProductModel from '../models/ProductModel';
import ProductDto from '../dto/ProductDto';

class ProductController {
  async createProduct(req: Request, res: Response) {
    try {
      const { name, description, summary, price, tags } = req.body;
      const images = req.files as Express.Multer.File[];
        console.log('aca',images);
      if (!images || images.length === 0) {
        res.status(400).json({ error: 'Debes subir al menos una imagen' });
        return 
      }
      const productoDto = new ProductDto(req.body,images);
      const { productId } = await ProductModel.createProduct(
       productoDto
      );

      res.status(201).json({ message: 'Producto creado', productId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear producto' });
    }
  }
}

export default new ProductController();
