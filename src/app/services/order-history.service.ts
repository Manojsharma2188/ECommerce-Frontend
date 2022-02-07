import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = 'http://localhost:9090/api/orders';

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {

    //need to build this URL as per email or match spring data rest
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;

    // need to call backend orderhistory API
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);

  }


}
interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  }
}
