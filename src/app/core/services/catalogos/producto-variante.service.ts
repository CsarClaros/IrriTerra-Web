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
    ProductoVariante,
    ProductoVarianteRequest
} from '../../../shared/models/producto-variante.model';

import {
    ApiCollectionResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';


@Injectable({
    providedIn: 'root'
})
export class ProductoVarianteService {

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
                ProductoVariante
            >
        > {

        return this.api
            .get<
                ApiCollectionResponse<
                    ProductoVariante
                >
            >(
                'producto-variante'
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
            ProductoVariante
        >
    > {

        return this.api
            .get<
                ApiResourceResponse<
                    ProductoVariante
                >
            >(
                `producto-variante/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Crear
    |--------------------------------------------------------------------------
    */

    crear(
        data:
            ProductoVarianteRequest
    ): Observable<
        ApiResourceResponse<
            ProductoVariante
        >
    > {

        return this.api
            .post<
                ApiResourceResponse<
                    ProductoVariante
                >
            >(
                'producto-variante',
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
            ProductoVarianteRequest
    ): Observable<
        ApiResourceResponse<
            ProductoVariante
        >
    > {

        return this.api
            .put<
                ApiResourceResponse<
                    ProductoVariante
                >
            >(
                `producto-variante/${id}`,
                data
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Eliminar
    |--------------------------------------------------------------------------
    */

    eliminar(
        id: number
    ): Observable<void> {

        return this.api
            .delete<void>(
                `producto-variante/${id}`
            );

    }

}