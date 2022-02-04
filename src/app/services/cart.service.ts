import { assertNotNull } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // just add the item to the array
  
  cartItems: CartItem[] = [];

  // Subject/replaysubject/BehaviorSubject are imp concept. replaysubject/BehaviorSubject are subclass of subject.
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

// Below two type storage in web stoarge api in browser to save the cart data even after refresh
// Session stoarge store the browser session, if browser close data will remove.  If you don't want to remove
// then used localstorage, not session storage , data persist even browser close
  storage: Storage = sessionStorage;
  //storage: Storage = localStorage;

  constructor() { 

    // read data from storage
    //Used not null assertion "!" in right hand statement
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data != null) {
      this.cartItems = data;
      
      // compute totals based on the data that is read from storage
      this.computeCartTotals();
    }

}

  addToCart(theCartItem: CartItem) {
    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | any;

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id

      //for (let tempCartItem of this.cartItems) {
      // if (tempCartItem.id === theCartItem.id) {
      // existingCartItem = tempCartItem;
      // break;
      //}
      ///}

      // this single line code replace above for loop code
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }
    if (alreadyExistsInCart) {
      // increment the quantity
      existingCartItem.quantity++;
    }
    else {
      // just add the item to the array
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();

  }

  // decreatement quantity button code
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let currentCartItem of this.cartItems) {

      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;

    }
    // publish the new values ... all subscribers will receive the new data
    // .next() method used to send and pass the value or events
    //Below code two lines used to pass the data and cart component will subsscribe this data to get the updated vale
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);

    // persist cart data
    //Method used to store cart data in broswer storage with web strogae api of HTML5
    this.persistCartItems();
  }

  //Method used to store cart data in broswer storage with web strogae api of HTML5
  // if user refresh the page after adding item in cart, the item will not removed from cart
  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  // method used just logging purpose or debug purpose 
  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }

  // remove button code of item
  remove(theCartItem: CartItem) {

    // get index of item in the array
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id );

    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }
}
