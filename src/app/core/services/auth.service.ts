import {
    inject,
    Injectable
} from '@angular/core';

import {
    Observable
} from 'rxjs';

import {
    finalize,
    map,
    tap
} from 'rxjs/operators';

import {
    ApiService
} from './api.service';

import {
    SessionService
} from './session.service';

import {
    ActualizarPerfilRequest,
    AuthSession,
    CambiarContrasenaRequest,
    LoginRequest,
    LoginResponse,
    MessageResponse,
    ResourceResponse
} from '../../shared/models/auth.model';

import {
    UsuarioAutenticado
} from '../../shared/models/user.model';




@Injectable({
    providedIn: 'root'
})
export class AuthService {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly api =
        inject(ApiService);


    private readonly sessionService =
        inject(SessionService);


    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    */

    login(
        credentials: LoginRequest
    ): Observable<AuthSession> {

        return this.api
            .post<LoginResponse>(

                'auth/login',

                credentials

            )
            .pipe(

                map(
                    response => {

                        const session:
                            AuthSession = {

                            token:
                                response.token,

                            tokenType:
                                response
                                    .token_type
                                ?? 'Bearer',

                            usuario: {

                                ...response.usuario,

                                permisos:
                                    response
                                        .usuario
                                        .permisos
                                    ?? []

                            }

                        };

                        return session;

                    }
                ),

                tap(
                    session => {

                        this.sessionService
                            .guardarSesion(
                                session
                            );

                    }
                )

            );
    }


    /*
    |--------------------------------------------------------------------------
    | Usuario autenticado
    |--------------------------------------------------------------------------
    */

    me():
        Observable<UsuarioAutenticado> {

        return this.api
            .get<
                UsuarioAutenticado |
                ResourceResponse<
                    UsuarioAutenticado
                >
            >(
                'auth/me'
            )
            .pipe(

                map(
                    response =>
                        this.unwrapUsuario(
                            response
                        )
                ),

                tap(
                    usuario => {

                        this.sessionService
                            .actualizarUsuario(
                                usuario
                            );

                    }
                )

            );
    }


    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    logout():
        Observable<MessageResponse> {

        return this.api
            .post<MessageResponse>(

                'auth/logout',

                {}

            )
            .pipe(

                finalize(
                    () => {

                        this.sessionService
                            .limpiarSesion();

                    }
                )

            );
    }

    /*
|--------------------------------------------------------------------------
| Actualizar perfil
|--------------------------------------------------------------------------
*/

    actualizarPerfil(
        data:
            ActualizarPerfilRequest
    ): Observable<
        UsuarioAutenticado
    > {

        return this.api
            .patch<
                UsuarioAutenticado |
                ResourceResponse<
                    UsuarioAutenticado
                >
            >(
                'auth/perfil',
                data
            )
            .pipe(

                map(
                    response =>
                        this.unwrapUsuario(
                            response
                        )
                ),

                tap(
                    usuario => {

                        this.sincronizarPerfil(
                            usuario
                        );

                    }
                )

            );

    }


    /*
    |--------------------------------------------------------------------------
    | Actualizar fotografía
    |--------------------------------------------------------------------------
    */

    actualizarFotoPerfil(
        foto:
            File
    ): Observable<
        UsuarioAutenticado
    > {

        const data =
            new FormData();


        data.append(
            'foto',
            foto
        );


        return this.api
            .post<
                UsuarioAutenticado |
                ResourceResponse<
                    UsuarioAutenticado
                >
            >(
                'auth/perfil/foto',
                data
            )
            .pipe(

                map(
                    response =>
                        this.unwrapUsuario(
                            response
                        )
                ),

                tap(
                    usuario => {

                        this.sincronizarPerfil(
                            usuario
                        );

                    }
                )

            );

    }


    /*
    |--------------------------------------------------------------------------
    | Cambio de contraseña
    |--------------------------------------------------------------------------
    */

    cambiarContrasena(
        data: CambiarContrasenaRequest
    ): Observable<MessageResponse> {

        return this.api
            .patch<MessageResponse>(

                'auth/cambiar-contrasena',

                data

            )
            .pipe(

                tap(
                    () => {

                        /*
                         * Laravel revoca todos los
                         * tokens después del cambio
                         * de contraseña.
                         */

                        this.sessionService
                            .limpiarSesion();

                    }
                )

            );
    }


    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    private unwrapUsuario(
        response:
            UsuarioAutenticado |
            ResourceResponse<
                UsuarioAutenticado
            >
    ): UsuarioAutenticado {

        if (
            'data' in response
        ) {

            return response.data;

        }

        return response;
    }

    private sincronizarPerfil(
        usuario:
            UsuarioAutenticado
    ): void {

        const permisosActuales =
            this.sessionService
                .permisos();


        this.sessionService
            .actualizarUsuario({

                ...usuario,

                permisos:
                    usuario.permisos
                    ?? permisosActuales

            });

    }

}