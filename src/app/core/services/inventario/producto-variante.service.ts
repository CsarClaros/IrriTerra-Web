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
    ProductoVariante
} from '../../../shared/models/producto-variante.model';


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
        id:
            number
    ):
        Observable<
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

}