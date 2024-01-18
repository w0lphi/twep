import { Provider } from '@angular/core';
import { AuthInterceptor } from './auth-interceptor';
import { ServerErrorInterceptor } from './server-error-interceptor';

// Injection token for the Http Interceptors multi-provider
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/** Provider for the HTTP Interceptors. */
export const httpInterceptorProviders: Provider[] = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true}
]
  