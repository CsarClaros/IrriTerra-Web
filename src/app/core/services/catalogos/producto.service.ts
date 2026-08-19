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
    Producto,
    ProductoRequest
} from '../../../shared/models/producto.model';

import {
    ApiCollectionResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';


@Injectable({
    providedIn: 'root'
})
export class ProductoService {

    private readonly api =
        inject(ApiService);


    listar():
        Observable<
            ApiCollectionResponse<Producto>
        > {

        return this.api
            .get<
                ApiCollectionResponse<Producto>
            >(
                'producto'
            );

    }


    obtener(
        id: number
    ): Observable<
        ApiResourceResponse<Producto>
    > {

        return this.api
            .get<
                ApiResourceResponse<Producto>
            >(
                `producto/${id}`
            );

    }


    crear(
        data: ProductoRequest
    ): Observable<
        ApiResourceResponse<Producto>
    > {

        return this.api
            .post<
                ApiResourceResponse<Producto>
            >(
                'producto',
                data
            );

    }


    actualizar(
        id: number,
        data: ProductoRequest
    ): Observable<
        ApiResourceResponse<Producto>
    > {

        return this.api
            .put<
                ApiResourceResponse<Producto>
            >(
                `producto/${id}`,
                data
            );

    }


    eliminar(
        id: number
    ): Observable<void> {

        return this.api
            .delete<void>(
                `producto/${id}`
            );

    }

}