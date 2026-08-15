import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import {
  inject
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  catchError,
  throwError
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';

import {
  SessionService
} from '../services/session.service';


export const authInterceptor:
  HttpInterceptorFn = (
      req,
      next
  ) => {

      /*
      |--------------------------------------------------------------------------
      | Dependencias
      |--------------------------------------------------------------------------
      */

      const sessionService =
          inject(
              SessionService
          );

      const router =
          inject(
              Router
          );


      /*
      |--------------------------------------------------------------------------
      | API
      |--------------------------------------------------------------------------
      */

      const apiUrl =
          environment.apiUrl
              .replace(
                  /\/+$/,
                  ''
              );


      const isApiRequest =
          req.url === apiUrl
          ||
          req.url.startsWith(
              `${apiUrl}/`
          );


      /*
      |--------------------------------------------------------------------------
      | Login
      |--------------------------------------------------------------------------
      |
      | El endpoint de login es público.
      |
      | No queremos enviar un token anterior al intentar
      | iniciar una nueva sesión.
      |
      */

      const isLoginRequest =
          req.url ===
          `${apiUrl}/auth/login`;


      /*
      |--------------------------------------------------------------------------
      | Sesión actual
      |--------------------------------------------------------------------------
      */

      const session =
          sessionService.session();


      /*
      |--------------------------------------------------------------------------
      | Petición
      |--------------------------------------------------------------------------
      */

      let request =
          req;


      /*
      |--------------------------------------------------------------------------
      | Bearer Token
      |--------------------------------------------------------------------------
      */

      if (
          isApiRequest
          &&
          ! isLoginRequest
          &&
          session?.token
      ) {

          request =
              req.clone({

                  setHeaders: {

                      Authorization:
                          `${
                              session.tokenType
                              ?? 'Bearer'
                          } ${
                              session.token
                          }`

                  }

              });

      }


      /*
      |--------------------------------------------------------------------------
      | Procesar respuesta
      |--------------------------------------------------------------------------
      */

      return next(
          request
      )
          .pipe(

              catchError(
                  (
                      error:
                          HttpErrorResponse
                  ) => {

                      /*
                      |--------------------------------------------------------------------------
                      | 401 - Sesión inválida
                      |--------------------------------------------------------------------------
                      |
                      | Solamente cerramos una sesión si ya existía
                      | un token.
                      |
                      | Esto evita tratar un login incorrecto como
                      | una sesión expirada.
                      |
                      */

                      if (
                          error.status === 401
                          &&
                          session?.token
                          &&
                          isApiRequest
                      ) {

                          sessionService
                              .limpiarSesion();

                          void router.navigate([
                              '/login'
                          ]);

                      }


                      /*
                      |--------------------------------------------------------------------------
                      | 403
                      |--------------------------------------------------------------------------
                      |
                      | No hacemos logout.
                      |
                      | 403 significa que el usuario está autenticado,
                      | pero no posee el permiso necesario.
                      |
                      */


                      /*
                      |--------------------------------------------------------------------------
                      | Propagar error
                      |--------------------------------------------------------------------------
                      */

                      return throwError(
                          () => error
                      );

                  }
              )

          );

  };