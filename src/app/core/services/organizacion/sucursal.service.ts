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
    Sucursal,
    SucursalRequest
} from '../../../shared/models/sucursal.model';

import {
    ApiCollectionResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';


@Injectable({
    providedIn: 'root'
})
export class SucursalService {

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
                Sucursal
            >
        > {

        return this.api
            .get<
                ApiCollectionResponse<
                    Sucursal
                >
            >(
                'sucursal'
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
            Sucursal
        >
    > {

        return this.api
            .get<
                ApiResourceResponse<
                    Sucursal
                >
            >(
                `sucursal/${id}`
            );

    }

    /*
|--------------------------------------------------------------------------
| Crear
|--------------------------------------------------------------------------
*/

    crear(
        data:
            SucursalRequest
    ): Observable<
        ApiResourceResponse<
            Sucursal
        >
    > {

        return this.api
            .post<
                ApiResourceResponse<
                    Sucursal
                >
            >(
                'sucursal',
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
            SucursalRequest
    ): Observable<
        ApiResourceResponse<
            Sucursal
        >
    > {

        return this.api
            .put<
                ApiResourceResponse<
                    Sucursal
                >
            >(
                `sucursal/${id}`,
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
                `sucursal/${id}`
            );

    }

}