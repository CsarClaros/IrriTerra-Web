import {
  inject
} from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  SessionService
} from '../services/session.service';


export const authGuard:
  CanActivateFn = (
      _route,
      state
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
      | Usuario autenticado
      |--------------------------------------------------------------------------
      */

      if (
          sessionService
              .autenticado()
      ) {

          return true;

      }


      /*
      |--------------------------------------------------------------------------
      | Usuario no autenticado
      |--------------------------------------------------------------------------
      */

      return router.createUrlTree(

          [
              '/login'
          ],

          {
              queryParams: {

                  returnUrl:
                      state.url

              }
          }

      );

  };