
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router,
        private notificationService: NotificationService
    ){}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => this.handleErrorResponse(error, request))
    );
  }

  handleErrorResponse(error: HttpErrorResponse, request: HttpRequest<any>): Observable<never>{
    if(request.url.endsWith("/login")){
      //Display default error message on login
      this.notificationService.showClientError("Username or password incorrect");
      return throwError(() => new Error(error.message));
    }

    if (error.status === 401) {
      // User is not authenticated anymore
      // -> Logout user and re-route to login page
      this.authService.logout();
      this.router.navigateByUrl("/login");
      return throwError(() => new Error("Session expired"));
    }

    if (error.status === 403) {
      //Forbidden, redirect to 404
      this.router.navigateByUrl("/notfound");
      return throwError(() => new Error("Forbidden"));
    }
    
    //Default error notification handling
    const body: any = error.error;
    const message: string =  body?.error ?? body?.message ?? "Ups, something went wrong";
    this.notificationService.showClientError(message);
    return throwError(() => new Error(error.message));
  }
}