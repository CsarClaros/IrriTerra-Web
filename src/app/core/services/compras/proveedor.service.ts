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
    Proveedor
} from '../../../shared/models/proveedor.model';


@Injectable({
    providedIn: 'root'
})
export class ProveedorService {

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
                Proveedor
            >
        > {

        return this.api
            .get<
                ApiCollectionResponse<
                    Proveedor
                >
            >(
                'proveedor'
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
                Proveedor
            >
        > {

        return this.api
            .get<
                ApiResourceResponse<
                    Proveedor
                >
            >(
                `proveedor/${id}`
            );

    }

}