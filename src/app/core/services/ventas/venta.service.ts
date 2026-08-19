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
    AnularVentaRequest,
    CompletarVentaRequest,
    Venta,
    VentaRequest,
    VentaActualizarRequest,
    VentaCrearRequest
} from '../../../shared/models/venta.model';

import {
    ApiCollectionResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';


@Injectable({
    providedIn: 'root'
})
export class VentaService {

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
                Venta
            >
        > {

        return this.api
            .get<
                ApiCollectionResponse<
                    Venta
                >
            >(
                'venta'
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
            Venta
        >
    > {

        return this.api
            .get<
                ApiResourceResponse<
                    Venta
                >
            >(
                `venta/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Crear
    |--------------------------------------------------------------------------
    */

    crear(
        data:
            VentaCrearRequest
    ): Observable<
        ApiResourceResponse<
            Venta
        >
    > {
    
        return this.api
            .post<
                ApiResourceResponse<
                    Venta
                >
            >(
                'venta',
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
            VentaActualizarRequest
    ): Observable<
        ApiResourceResponse<
            Venta
        >
    > {
    
        return this.api
            .put<
                ApiResourceResponse<
                    Venta
                >
            >(
                `venta/${id}`,
                data
            );
    
    }


    /*
    |--------------------------------------------------------------------------
    | Completar
    |--------------------------------------------------------------------------
    */

    completar(
        id: number,
        data:
            CompletarVentaRequest
    ): Observable<
        ApiResourceResponse<
            Venta
        >
    > {

        return this.api
            .patch<
                ApiResourceResponse<
                    Venta
                >
            >(
                `venta/${id}/completar`,
                data
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Anular
    |--------------------------------------------------------------------------
    */

    anular(
        id: number,
        data:
            AnularVentaRequest
    ): Observable<
        ApiResourceResponse<
            Venta
        >
    > {

        return this.api
            .patch<
                ApiResourceResponse<
                    Venta
                >
            >(
                `venta/${id}/anular`,
                data
            );

    }

}