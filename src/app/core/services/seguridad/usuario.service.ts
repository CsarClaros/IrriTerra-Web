import {
    inject,
    Injectable
} from '@angular/core';

import {
    map,
    Observable
} from 'rxjs';

import {
    ApiService
} from '../api.service';

import {
    Usuario
} from '../../../shared/models/user.model';

import {
    UsuarioFormData
} from '../../../shared/models/usuario-form.model';

import {
    ApiCollectionResponse,
    ApiMessageResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';


@Injectable({
    providedIn:
        'root'
})
export class UsuarioService {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly api =
        inject(
            ApiService
        );


    /*
    |--------------------------------------------------------------------------
    | Listar
    |--------------------------------------------------------------------------
    */

    listar():
        Observable<
            ApiCollectionResponse<
                Usuario
            >
        > {

        return this.api
            .get<
                ApiCollectionResponse<
                    Usuario
                >
            >(
                'usuario'
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Obtener
    |--------------------------------------------------------------------------
    */

    obtener(
        id:
            number
    ): Observable<
        Usuario
    > {

        return this.api
            .get<
                Usuario |
                ApiResourceResponse<
                    Usuario
                >
            >(
                `usuario/${id}`
            )
            .pipe(

                map(
                    response =>
                        this.unwrapUsuario(
                            response
                        )
                )

            );

    }


    /*
    |--------------------------------------------------------------------------
    | Crear
    |--------------------------------------------------------------------------
    */

    crear(
        data:
            UsuarioFormData
    ): Observable<
        Usuario
    > {

        const formData =
            this.construirFormData(
                data
            );


        return this.api
            .post<
                Usuario |
                ApiResourceResponse<
                    Usuario
                >
            >(
                'usuario',
                formData
            )
            .pipe(

                map(
                    response =>
                        this.unwrapUsuario(
                            response
                        )
                )

            );

    }


    /*
    |--------------------------------------------------------------------------
    | Actualizar
    |--------------------------------------------------------------------------
    */

    actualizar(
        id:
            number,

        data:
            UsuarioFormData
    ): Observable<
        Usuario
    > {

        const formData =
            this.construirFormData(
                data
            );


        /*
         * Method spoofing.
         *
         * Esto permite que Laravel procese correctamente
         * multipart/form-data junto con una actualización.
         */

        formData.append(
            '_method',
            'PATCH'
        );


        return this.api
            .post<
                Usuario |
                ApiResourceResponse<
                    Usuario
                >
            >(
                `usuario/${id}`,
                formData
            )
            .pipe(

                map(
                    response =>
                        this.unwrapUsuario(
                            response
                        )
                )

            );

    }
    
    /*
|--------------------------------------------------------------------------
| Restablecer contraseña
|--------------------------------------------------------------------------
*/

    restablecerPassword(
        idUsuario: number
    ): Observable<{
        message: string;
    }> {

        return this.api
            .patch<{
                message: string;
            }>(
                `usuario/${idUsuario}/restablecer-password`,
                {}
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Desactivar
    |--------------------------------------------------------------------------
    */

    eliminar(
        id:
            number
    ): Observable<
        ApiMessageResponse
    > {

        return this.api
            .delete<
                ApiMessageResponse
            >(
                `usuario/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | FormData
    |--------------------------------------------------------------------------
    */

    private construirFormData(
        data:
            UsuarioFormData
    ): FormData {

        const formData =
            new FormData();


        if (
            data.id_rol
            !== null
        ) {

            formData.append(
                'id_rol',
                String(
                    data.id_rol
                )
            );

        }


        if (
            data.id_sucursal
            !== null
        ) {

            formData.append(
                'id_sucursal',
                String(
                    data.id_sucursal
                )
            );

        }


        formData.append(
            'ci',
            data.ci.trim()
        );


        formData.append(
            'nombre',
            data.nombre.trim()
        );


        formData.append(
            'apellido_paterno',
            data.apellido_paterno.trim()
        );


        formData.append(
            'apellido_materno',
            data.apellido_materno.trim()
        );


        formData.append(
            'correo',
            data.correo.trim()
        );


        formData.append(
            'telefono',
            data.telefono.trim()
        );


        formData.append(
            'direccion',
            data.direccion.trim()
        );


        if (
            data.foto
        ) {

            formData.append(
                'foto',
                data.foto
            );

        }


        return formData;

    }


    /*
    |--------------------------------------------------------------------------
    | Resource
    |--------------------------------------------------------------------------
    */

    private unwrapUsuario(
        response:
            Usuario |
            ApiResourceResponse<
                Usuario
            >
    ): Usuario {

        if (
            'data'
            in response
        ) {

            return response.data;

        }


        return response;

    }

    /*
|--------------------------------------------------------------------------
| Reactivar
|--------------------------------------------------------------------------
*/

    reactivar(
        id:
            number
    ): Observable<
        Usuario
    > {

        return this.api
            .patch<
                Usuario |
                ApiResourceResponse<
                    Usuario
                >
            >(
                `usuario/${id}/reactivar`,
                {}
            )
            .pipe(

                map(
                    response =>
                        this.unwrapUsuario(
                            response
                        )
                )

            );

    }



}