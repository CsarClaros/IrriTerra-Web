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


/*
|--------------------------------------------------------------------------
| Un permiso específico
|--------------------------------------------------------------------------
*/

export function permissionGuard(
    permiso: string
): CanActivateFn {

    return (
        _route,
        state
    ) => {

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
        | Sin sesión
        |--------------------------------------------------------------------------
        */

        if (
            ! sessionService
                .autenticado()
        ) {

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

        }


        /*
        |--------------------------------------------------------------------------
        | Tiene permiso
        |--------------------------------------------------------------------------
        */

        if (
            sessionService
                .tienePermiso(
                    permiso
                )
        ) {

            return true;

        }


        /*
        |--------------------------------------------------------------------------
        | Sin permiso
        |--------------------------------------------------------------------------
        */

        return router.createUrlTree([
            '/dashboard'
        ]);

    };

}


/*
|--------------------------------------------------------------------------
| Al menos uno de varios permisos
|--------------------------------------------------------------------------
*/

export function anyPermissionGuard(
    permisos: string[]
): CanActivateFn {

    return (
        _route,
        state
    ) => {

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
        | Sin sesión
        |--------------------------------------------------------------------------
        */

        if (
            ! sessionService
                .autenticado()
        ) {

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

        }


        /*
        |--------------------------------------------------------------------------
        | Tiene al menos un permiso
        |--------------------------------------------------------------------------
        */

        if (
            sessionService
                .tieneAlgunPermiso(
                    permisos
                )
        ) {

            return true;

        }


        /*
        |--------------------------------------------------------------------------
        | Sin permisos
        |--------------------------------------------------------------------------
        */

        return router.createUrlTree([
            '/dashboard'
        ]);

    };

}