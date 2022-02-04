import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  
  products: Product[] = [];
  currentCategoryId: number =1;
  previousCategoryId: number =1;
  searchMode: boolean = false;

  //Pagination properties
  thePageNumber: number =1;
  thePageSize: number = 5;
  theTotalElements: number=0;

  previousKeyword: string | undefined;


  constructor(private productService: ProductService,
    private cartService: CartService,
           private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() =>{
      this.listProducts();
    });
    
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode)
    {
      this.handleSearchProducts();
    }
    else{
   this.handleListProducts();
    }
  }

  // method will work for search product in search bar
  // and display the product based on seach in pagination form
  handleSearchProducts()
  {

    const theKeyword: string = String(this.route.snapshot.paramMap.get('keyword'));

    // if we have a different keyword than previous
    // then set thePageNumber to 1
    // theKeyword mean current keyword

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    // now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               theKeyword).subscribe(this.processResult());
  }
  handleListProducts(){
// check if "id pararm" is available
const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
//get the id as string and convert to number using the "+" sysmbol
if(hasCategoryId){
this.currentCategoryId = Number(this.route.snapshot.paramMap.get('id'));
}else{
  this.currentCategoryId =1;
}

  //
    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed
    // if we have a different category id than previous
    // then set thePageNumber back to 1
  if(this.previousCategoryId != this.currentCategoryId)
  {
    this.thePageNumber =1;
  }
  this.previousCategoryId = this.currentCategoryId;
  console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);
// get the products given id 
 // now get the products for the given category id
 this.productService.getProductListPaginate(this.thePageNumber-1,
  this.thePageSize,
  this.currentCategoryId)
  .subscribe(this.processResult());

  
}



// Data mapping to JSON response to angular properties
 processResult() {
    return (data: { _embedded: { products: Product[]; }; page: { number: number; size: number; totalElements: number; }; }) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber =1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);
    // Method call for add item and quantity calucalation in cart
    this.cartService.addToCart(theCartItem);
  }
}
