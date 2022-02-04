import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  private baseUrl = 'http://localhost:9090/api/products';
  private categoryUrl = 'http://localhost:9090/api/product-category';
  constructor(private httpClient : HttpClient) { }

  //Dislay product in grip - use this method
  getProductList(theCategoryId: number) : Observable<Product[]>{

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);              
  }

  // Get the product based on Category ID - - use this method
  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  // Display single product with detail - - use this method
  getProduct(theProductId: number): Observable<Product> {

    // need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  // Pageination code 

  getProductListPaginate(thePage: number , 
    thePageSize: number, 
    theCategoryId: number): Observable<GetResponseProducts> {

// need to build URL based on category id, page and size 
const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
+ `&page=${thePage}&size=${thePageSize}`;

return this.httpClient.get<GetResponseProducts>(searchUrl);
}

// Method used to pagination when trying to search the product or based on search

searchProductsPaginate(thePage: number, 
  thePageSize: number, 
  theKeyword: string): Observable<GetResponseProducts> {

// need to build URL based on keyword, page and size 
const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
+ `&page=${thePage}&size=${thePageSize}`;

return this.httpClient.get<GetResponseProducts>(searchUrl);
}

  // Search bar for search the product - - use this method
  searchProducts(theKeyword: string): Observable<Product[]> {

    // need to build URL based on the keyword 
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }
  
  // Generics method or common code method for display product
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
  }
}
// For mapping response 
interface GetResponseProducts {
  _embedded:{
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}