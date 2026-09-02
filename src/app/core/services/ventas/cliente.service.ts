import {
    inject,
    Injectable
} from '@angular/core';

import {
    Observable
} from 'rxjs';

import {
    ApiService
} from '../api.service';

import {
    Cliente,
    ClienteRequest
} from '../../../shared/models/cliente.model';

import {
    ApiCollectionResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';


@Injectable({
    providedIn:
        'root'
})
export class ClienteService {

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

    listar(
        incluirInactivos:
            boolean = false
    ): Observable<
        ApiCollectionResponse<
            Cliente
        >
    > {

        const endpoint =
            incluirInactivos

                ? 'cliente?incluir_inactivos=1'

                : 'cliente';


        return this.api
            .get<
                ApiCollectionResponse<
                    Cliente
                >
            >(
                endpoint
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
        ApiResourceResponse<
            Cliente
        >
    > {

        return this.api
            .get<
                ApiResourceResponse<
                    Cliente
                >
            >(
                `cliente/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Crear
    |--------------------------------------------------------------------------
    */

    crear(
        data:
            ClienteRequest
    ): Observable<
        ApiResourceResponse<
            Cliente
        >
    > {

        return this.api
            .post<
                ApiResourceResponse<
                    Cliente
                >
            >(
                'cliente',
                data
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Actualizar
    |--------------------------------------------------------------------------
    */

    actualizar(
        id: number,
        data:
            ClienteRequest
    ): Observable<
        ApiResourceResponse<
            Cliente
        >
    > {

        return this.api
            .put<
                ApiResourceResponse<
                    Cliente
                >
            >(
                `cliente/${id}`,
                data
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
    ): Observable<{
        message: string;
    }> {

        return this.api
            .delete<{
                message: string;
            }>(
                `cliente/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Reactivar
    |--------------------------------------------------------------------------
    */

    reactivar(
        id:
            number
    ): Observable<{
        message: string;
    }> {

        return this.api
            .patch<{
                message: string;
            }>(
                `cliente/${id}/reactivar`,
                {}
            );

    }

}