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
    providedIn: 'root'
})
export class CategoriaService {

    private readonly api =
        inject(ApiService);


    listar():
        Observable<
            ApiCollectionResponse<Categoria>
        > {

        return this.api
            .get<
                ApiCollectionResponse<Categoria>
            >(
                'categoria'
            );

    }


    obtener(
        id: number
    ): Observable<
        ApiResourceResponse<Categoria>
    > {

        return this.api
            .get<
                ApiResourceResponse<Categoria>
            >(
                `categoria/${id}`
            );

    }


    crear(
        data: CategoriaRequest
    ): Observable<
        ApiResourceResponse<Categoria>
    > {

        return this.api
            .post<
                ApiResourceResponse<Categoria>
            >(
                'categoria',
                data
            );

    }


    actualizar(
        id: number,
        data: CategoriaRequest
    ): Observable<
        ApiResourceResponse<Categoria>
    > {

        return this.api
            .put<
                ApiResourceResponse<Categoria>
            >(
                `categoria/${id}`,
                data
            );

    }


    eliminar(
        id: number
    ): Observable<void> {

        return this.api
            .delete<void>(
                `categoria/${id}`
            );

    }

}