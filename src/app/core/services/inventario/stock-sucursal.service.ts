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
    StockSucursal
} from '../../../shared/models/stock-sucursal.model';


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
        id:
            number
    ):
        Observable<
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

}