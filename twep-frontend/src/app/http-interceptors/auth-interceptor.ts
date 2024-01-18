import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environment/environment";

/**
 * An interceptor which adds an JWT Token to every request if it exists in the local storage
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor{

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
    const jwtToken: string | null = localStorage.getItem(environment.TOKEN_KEY);
    if (jwtToken) {
          const cloned: HttpRequest<any> = req.clone({
              headers: req.headers.set("Authorization", `Bearer ${jwtToken}`)
          });
          return next.handle(cloned);
      }
      else {
          return next.handle(req);
      }
  }
}