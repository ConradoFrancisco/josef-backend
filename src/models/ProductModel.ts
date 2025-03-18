import pool from '../config/db';

class ProductModel {
  async createProduct(
    name: string,
    description: string,
    summary: string,
    price: number,
    tags: string[],
    images: string[]
  ): Promise<any> {
    const [result]: any = await pool.execute(
      'INSERT INTO products (name, description, summary, price, tags) VALUES (?, ?, ?, ?, ?)',
      [name, description, summary, price, JSON.stringify(tags)]
    );

    const productId = result.insertId;

    for (const imageUrl of images) {
      await pool.execute(
        'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)',
        [productId, imageUrl]
      );
    }

    return { productId };
  }

  async getAllProducts(): Promise<any> {
    const [products]: any = await pool.execute('SELECT * FROM products');

    for (const product of products) {
      const [images]: any = await pool.execute(
        'SELECT image_url FROM product_images WHERE product_id = ?',
        [product.id]
      );
      product.images = images.map((img: any) => img.image_url);
    }

    return products;
  }

  async getProductById(productId: number): Promise<any> {
    const [products]: any = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );

    if (products.length === 0) return null;

    const product = products[0];
    const [images]: any = await pool.execute(
      'SELECT image_url FROM product_images WHERE product_id = ?',
      [productId]
    );

    product.images = images.map((img: any) => img.image_url);
    return product;
  }

  async updateProduct(
    productId: number,
    name: string,
    description: string,
    summary: string,
    price: number,
    tags: string[],
    images: string[]
  ): Promise<any> {
    await pool.execute(
      'UPDATE products SET name = ?, description = ?, summary = ?, price = ?, tags = ? WHERE id = ?',
      [name, description, summary, price, JSON.stringify(tags), productId]
    );

    await pool.execute('DELETE FROM product_images WHERE product_id = ?', [productId]);

    for (const imageUrl of images) {
      await pool.execute(
        'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)',
        [productId, imageUrl]
      );
    }

    return { message: 'Producto actualizado correctamente' };
  }

  async deleteProduct(productId: number): Promise<any> {
    await pool.execute('DELETE FROM products WHERE id = ?', [productId]);
    return { message: 'Producto eliminado correctamente' };
  }
}

export default new ProductModel();
