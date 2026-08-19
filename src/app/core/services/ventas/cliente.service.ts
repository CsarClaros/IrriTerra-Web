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
    Cliente,
    ClienteRequest
} from '../../../shared/models/cliente.model';

import {
    ApiCollectionResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';


@Injectable({
    providedIn: 'root'
})
export class ClienteService {

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
                Cliente
            >
        > {

        return this.api
            .get<
                ApiCollectionResponse<
                    Cliente
                >
            >(
                'cliente'
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
            Cliente
        >
    > {

        return this.api
            .get<
                ApiResourceResponse<
                    Cliente
                >
            >(
                `cliente/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Crear
    |--------------------------------------------------------------------------
    */

    crear(
        data:
            ClienteRequest
    ): Observable<
        ApiResourceResponse<
            Cliente
        >
    > {

        return this.api
            .post<
                ApiResourceResponse<
                    Cliente
                >
            >(
                'cliente',
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
            ClienteRequest
    ): Observable<
        ApiResourceResponse<
            Cliente
        >
    > {

        return this.api
            .put<
                ApiResourceResponse<
                    Cliente
                >
            >(
                `cliente/${id}`,
                data
            );

    }

}