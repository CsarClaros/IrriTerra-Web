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
                this.construirFormData(
                    data
                )
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

        const formData =
            this.construirFormData(
                data
            );


        /*
         * PHP/Laravel procesa correctamente
         * el archivo multipart como POST y
         * Laravel lo interpreta como PUT.
         */

        formData.append(
            '_method',
            'PUT'
        );


        return this.api
            .post<
                ApiResourceResponse<
                    ProductoImagen
                >
            >(
                `producto-imagen/${id}`,
                formData
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


    /*
|--------------------------------------------------------------------------
| FormData
|--------------------------------------------------------------------------
*/

    private construirFormData(
        data:
            ProductoImagenRequest
    ): FormData {

        const formData =
            new FormData();


        formData.append(
            'id_producto',
            String(
                data.id_producto
            )
        );


        formData.append(
            'orden',
            String(
                data.orden
            )
        );


        formData.append(
            'es_principal',
            data.es_principal
                ? '1'
                : '0'
        );


        if (
            data.imagen
        ) {

            formData.append(
                'imagen',
                data.imagen,
                data.imagen.name
            );

        }


        if (
            data.texto_alternativo
            !== undefined
            &&
            data.texto_alternativo
            !== null
        ) {

            formData.append(
                'texto_alternativo',
                data.texto_alternativo
            );

        }


        if (
            data.observaciones
            !== undefined
            &&
            data.observaciones
            !== null
        ) {

            formData.append(
                'observaciones',
                data.observaciones
            );

        }


        return formData;
    }

}