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
    Marca,
    MarcaRequest
} from '../../../shared/models/marca.model';

import {
    ApiCollectionResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';


@Injectable({
    providedIn:
        'root'
})
export class MarcaService {

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
            Marca
        >
    > {

        const endpoint =
            incluirInactivas

                ? 'marca?incluir_inactivas=1'

                : 'marca';


        return this.api
            .get<
                ApiCollectionResponse<
                    Marca
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
            Marca
        >
    > {

        return this.api
            .get<
                ApiResourceResponse<
                    Marca
                >
            >(
                `marca/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Crear
    |--------------------------------------------------------------------------
    */

    crear(
        data:
            MarcaRequest
    ): Observable<
        ApiResourceResponse<
            Marca
        >
    > {

        return this.api
            .post<
                ApiResourceResponse<
                    Marca
                >
            >(
                'marca',
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
            MarcaRequest
    ): Observable<
        ApiResourceResponse<
            Marca
        >
    > {

        return this.api
            .put<
                ApiResourceResponse<
                    Marca
                >
            >(
                `marca/${id}`,
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
                `marca/${id}`
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
                `marca/${id}/reactivar`,
                {}
            );

    }

}