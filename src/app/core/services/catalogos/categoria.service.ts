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
    Categoria,
    CategoriaRequest
} from '../../../shared/models/categoria.model';

import {
    ApiCollectionResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';


@Injectable({
    providedIn:
        'root'
})
export class CategoriaService {

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
        incluirInactivas:
            boolean = false
    ): Observable<
        ApiCollectionResponse<
            Categoria
        >
    > {

        const endpoint =
            incluirInactivas

                ? 'categoria?incluir_inactivas=1'

                : 'categoria';


        return this.api
            .get<
                ApiCollectionResponse<
                    Categoria
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
        id: number
    ): Observable<
        ApiResourceResponse<
            Categoria
        >
    > {

        return this.api
            .get<
                ApiResourceResponse<
                    Categoria
                >
            >(
                `categoria/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Crear
    |--------------------------------------------------------------------------
    */

    crear(
        data:
            CategoriaRequest
    ): Observable<
        ApiResourceResponse<
            Categoria
        >
    > {

        return this.api
            .post<
                ApiResourceResponse<
                    Categoria
                >
            >(
                'categoria',
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
            CategoriaRequest
    ): Observable<
        ApiResourceResponse<
            Categoria
        >
    > {

        return this.api
            .put<
                ApiResourceResponse<
                    Categoria
                >
            >(
                `categoria/${id}`,
                data
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Desactivar
    |--------------------------------------------------------------------------
    */

    eliminar(
        id: number
    ): Observable<{
        message: string;
    }> {

        return this.api
            .delete<{
                message: string;
            }>(
                `categoria/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Reactivar
    |--------------------------------------------------------------------------
    */

    reactivar(
        id: number
    ): Observable<{
        message: string;
    }> {

        return this.api
            .patch<{
                message: string;
            }>(
                `categoria/${id}/reactivar`,
                {}
            );

    }

}