import { IProduct } from "../interfaces/ProductIntefaces";

class ProductDto {
  id:number
  name:string
  description:string
  summary:string
  price:number
  tags:string[]
  images:string[]
  constructor(pruducto:any,images:any) {
    this.id = pruducto.id;
    this.name = pruducto.name;
    this.price = parseFloat(pruducto.price);
    this.summary = pruducto.summary;
    this.description = pruducto.description;
    this.tags = JSON.parse(pruducto.tags);
    this.images = images.map((file:any) => `/uploads/${file.filename}`);;
  }
}
export default ProductDto;