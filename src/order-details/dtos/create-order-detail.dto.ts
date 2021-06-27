import { Discount } from "../../products/schemas/discount.schema";
import { Product } from "../../products/schemas/product.schema";

export class CreateOrderDetailDto {
  product: Product;

  quantity: number;

  discount?: Discount;
}
