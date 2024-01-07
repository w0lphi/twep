import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { httpInterceptorProviders } from './http-interceptors/http-interceptor.provider';


import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideAnimations(),

    //set default appearance of form fields to outline
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }, 

    //Provide HTTP Client and Interceptors
    provideHttpClient(withInterceptorsFromDi()),
    httpInterceptorProviders,
]
};
