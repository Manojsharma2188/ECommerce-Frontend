import { Product } from "./product";
import { ProductCategory } from "./product-category";

export class CartItem {

    id: string | undefined;
    name: string | undefined;
    imageUrl: string | undefined;
    unitPrice: number | any;

    quantity: number;

    constructor(product: Product)
    {
        this.id = product.id;
        this.name = product.name;
        this.imageUrl = product.imageUrl;
        this.unitPrice= product.unitPrice;

        this.quantity=1;
    }
}
