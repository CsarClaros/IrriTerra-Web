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
    PrecioProductoVariante,
    PrecioProductoVarianteRequest
} from '../../../shared/models/precio-producto-variante.model';

import {
    ApiCollectionResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';


@Injectable({
    providedIn: 'root'
})
export class PrecioProductoVarianteService {

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
                PrecioProductoVariante
            >
        > {

        return this.api
            .get<
                ApiCollectionResponse<
                    PrecioProductoVariante
                >
            >(
                'precio-producto-variante'
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Obtener
    |--------------------------------------------------------------------------
    */

    obtener(
        id: number
    ): Observable<
        ApiResourceResponse<
            PrecioProductoVariante
        >
    > {

        return this.api
            .get<
                ApiResourceResponse<
                    PrecioProductoVariante
                >
            >(
                `precio-producto-variante/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Crear
    |--------------------------------------------------------------------------
    */

    crear(
        data:
            PrecioProductoVarianteRequest
    ): Observable<
        ApiResourceResponse<
            PrecioProductoVariante
        >
    > {

        return this.api
            .post<
                ApiResourceResponse<
                    PrecioProductoVariante
                >
            >(
                'precio-producto-variante',
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
            PrecioProductoVarianteRequest
    ): Observable<
        ApiResourceResponse<
            PrecioProductoVariante
        >
    > {

        return this.api
            .put<
                ApiResourceResponse<
                    PrecioProductoVariante
                >
            >(
                `precio-producto-variante/${id}`,
                data
            );

    }

}