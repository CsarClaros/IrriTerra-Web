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
    ProductoVariante,
    ProductoVarianteRequest
} from '../../../shared/models/producto-variante.model';


@Injectable({
    providedIn:
        'root'
})
export class ProductoVarianteService {

    private readonly api =
        inject(
            ApiService
        );


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

}