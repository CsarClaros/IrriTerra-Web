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
    ApiCollectionResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';

import {
    Proveedor,
    ProveedorRequest
} from '../../../shared/models/proveedor.model';


@Injectable({
    providedIn:
        'root'
})
export class ProveedorService {

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
            Proveedor
        >
    > {

        const endpoint =
            incluirInactivos

                ? 'proveedor?incluir_inactivos=1'

                : 'proveedor';


        return this.api
            .get<
                ApiCollectionResponse<
                    Proveedor
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
            Proveedor
        >
    > {

        return this.api
            .get<
                ApiResourceResponse<
                    Proveedor
                >
            >(
                `proveedor/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Crear
    |--------------------------------------------------------------------------
    */

    crear(
        data:
            ProveedorRequest
    ): Observable<
        ApiResourceResponse<
            Proveedor
        >
    > {

        return this.api
            .post<
                ApiResourceResponse<
                    Proveedor
                >
            >(
                'proveedor',
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
            ProveedorRequest
    ): Observable<
        ApiResourceResponse<
            Proveedor
        >
    > {

        return this.api
            .put<
                ApiResourceResponse<
                    Proveedor
                >
            >(
                `proveedor/${id}`,
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
                `proveedor/${id}`
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
                `proveedor/${id}/reactivar`,
                {}
            );

    }

}