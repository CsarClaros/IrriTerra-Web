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
    StockSucursal,
    StockSucursalRequest
} from '../../../shared/models/stock-sucursal.model';

import {
    ApiCollectionResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';


@Injectable({
    providedIn: 'root'
})
export class StockSucursalService {

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
                StockSucursal
            >
        > {

        return this.api
            .get<
                ApiCollectionResponse<
                    StockSucursal
                >
            >(
                'stock-sucursal'
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
            StockSucursal
        >
    > {

        return this.api
            .get<
                ApiResourceResponse<
                    StockSucursal
                >
            >(
                `stock-sucursal/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Crear configuración
    |--------------------------------------------------------------------------
    */

    crear(
        data:
            StockSucursalRequest
    ): Observable<
        ApiResourceResponse<
            StockSucursal
        >
    > {

        return this.api
            .post<
                ApiResourceResponse<
                    StockSucursal
                >
            >(
                'stock-sucursal',
                data
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Actualizar configuración
    |--------------------------------------------------------------------------
    */

    actualizar(
        id: number,
        data:
            StockSucursalRequest
    ): Observable<
        ApiResourceResponse<
            StockSucursal
        >
    > {

        return this.api
            .put<
                ApiResourceResponse<
                    StockSucursal
                >
            >(
                `stock-sucursal/${id}`,
                data
            );

    }

}