import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// Used to handle secure handle. Endpoints require valid token for processing, so passing token and 
// access secure endpoints
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private oktaAuth: OktaAuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }
//Promises are used to handle asynchronous operations / or call
  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> { 

    // Only add an access token for secured endpoints
    const securedEndpoints = ['http://localhost:9090/api/orders'];

    if (securedEndpoints.some(url => request.urlWithParams.includes(url))) {

      // get access token, await - used to wait untill async call response will come.  
      const accessToken = await this.oktaAuth.getAccessToken();

      // clone the request and add new header with access token, we can't direct modily the request so 
      // we have clone the request and added token in header 
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });

    }

    return next.handle(request).toPromise();
  }
}
