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
    ApiMessageResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';

import {
    AnularCompraRequest,
    Compra,
    CompraActualizarRequest,
    CompraCrearRequest,
    ConfirmarCompraRequest,
    RecibirCompraRequest
} from '../../../shared/models/compra.model';


@Injectable({
    providedIn: 'root'
})
export class CompraService {

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
                Compra
            >
        > {

        return this.api
            .get<
                ApiCollectionResponse<
                    Compra
                >
            >(
                'compra'
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
                Compra
            >
        > {

        return this.api
            .get<
                ApiResourceResponse<
                    Compra
                >
            >(
                `compra/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Crear
    |--------------------------------------------------------------------------
    */

    crear(
        data:
            CompraCrearRequest
    ):
        Observable<
            Compra
        > {

        return this.api
            .post<
                Compra
            >(
                'compra',
                data
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Actualizar
    |--------------------------------------------------------------------------
    */

    actualizar(
        id:
            number,

        data:
            CompraActualizarRequest
    ):
        Observable<
            Compra
        > {

        return this.api
            .put<
                Compra
            >(
                `compra/${id}`,
                data
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Confirmar
    |--------------------------------------------------------------------------
    */

    confirmar(
        id:
            number,

        data:
            ConfirmarCompraRequest
    ):
        Observable<
            Compra
        > {

        return this.api
            .patch<
                Compra
            >(
                `compra/${id}/confirmar`,
                data
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Recibir
    |--------------------------------------------------------------------------
    */

    recibir(
        id:
            number,

        data:
            RecibirCompraRequest
    ):
        Observable<
            Compra
        > {

        return this.api
            .patch<
                Compra
            >(
                `compra/${id}/recibir`,
                data
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Anular
    |--------------------------------------------------------------------------
    */

    anular(
        id:
            number,

        data:
            AnularCompraRequest
    ):
        Observable<
            Compra
        > {

        return this.api
            .patch<
                Compra
            >(
                `compra/${id}/anular`,
                data
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Eliminar
    |--------------------------------------------------------------------------
    */

    eliminar(
        id:
            number
    ):
        Observable<
            ApiMessageResponse
        > {

        return this.api
            .delete<
                ApiMessageResponse
            >(
                `compra/${id}`
            );

    }

}