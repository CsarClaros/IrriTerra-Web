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
    ProductoImagen,
    ProductoImagenRequest
} from '../../../shared/models/producto-imagen.model';

import {
    ApiCollectionResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';


@Injectable({
    providedIn: 'root'
})
export class ProductoImagenService {

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
                ProductoImagen
            >
        > {

        return this.api
            .get<
                ApiCollectionResponse<
                    ProductoImagen
                >
            >(
                'producto-imagen'
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
            ProductoImagen
        >
    > {

        return this.api
            .get<
                ApiResourceResponse<
                    ProductoImagen
                >
            >(
                `producto-imagen/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Crear
    |--------------------------------------------------------------------------
    */

    crear(
        data:
            ProductoImagenRequest
    ): Observable<
        ApiResourceResponse<
            ProductoImagen
        >
    > {

        return this.api
            .post<
                ApiResourceResponse<
                    ProductoImagen
                >
            >(
                'producto-imagen',
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
            ProductoImagenRequest
    ): Observable<
        ApiResourceResponse<
            ProductoImagen
        >
    > {

        return this.api
            .put<
                ApiResourceResponse<
                    ProductoImagen
                >
            >(
                `producto-imagen/${id}`,
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
                `producto-imagen/${id}`
            );

    }

}