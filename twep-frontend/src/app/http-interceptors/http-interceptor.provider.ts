import { Provider } from '@angular/core';
import { AuthInterceptor } from './auth-interceptor';

// Injection token for the Http Interceptors multi-provider
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/** Provider for the HTTP Interceptors. */
export const httpInterceptorProviders: Provider[] = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
]
  