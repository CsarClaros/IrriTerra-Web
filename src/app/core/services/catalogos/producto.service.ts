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
    Producto,
    ProductoRequest
} from '../../../shared/models/producto.model';

import {
    ApiCollectionResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';


@Injectable({
    providedIn:
        'root'
})
export class ProductoService {

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
            Producto
        >
    > {

        const endpoint =
            incluirInactivos

                ? 'producto?incluir_inactivas=1'

                : 'producto';


        return this.api
            .get<
                ApiCollectionResponse<
                    Producto
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
            Producto
        >
    > {

        return this.api
            .get<
                ApiResourceResponse<
                    Producto
                >
            >(
                `producto/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Crear
    |--------------------------------------------------------------------------
    */

    crear(
        data:
            ProductoRequest
    ): Observable<
        ApiResourceResponse<
            Producto
        >
    > {

        return this.api
            .post<
                ApiResourceResponse<
                    Producto
                >
            >(
                'producto',
                data
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
            ProductoRequest
    ): Observable<
        ApiResourceResponse<
            Producto
        >
    > {

        return this.api
            .put<
                ApiResourceResponse<
                    Producto
                >
            >(
                `producto/${id}`,
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
        message:
            string;
    }> {

        return this.api
            .delete<{
                message:
                    string;
            }>(
                `producto/${id}`
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
        message:
            string;
    }> {

        return this.api
            .patch<{
                message:
                    string;
            }>(
                `producto/${id}/reactivar`,
                {}
            );

    }

}