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
    CompletarTransferenciaInventarioRequest,
    EnviarTransferenciaInventarioRequest,
    RechazarTransferenciaInventarioRequest,
    TransferenciaInventario,
    TransferenciaInventarioActualizarRequest,
    TransferenciaInventarioCrearRequest
} from '../../../shared/models/transferencia-inventario.model';


@Injectable({
    providedIn: 'root'
})
export class TransferenciaInventarioService {

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
                TransferenciaInventario
            >
        > {

        return this.api
            .get<
                ApiCollectionResponse<
                    TransferenciaInventario
                >
            >(
                'transferencia-inventario'
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
                TransferenciaInventario
            >
        > {

        return this.api
            .get<
                ApiResourceResponse<
                    TransferenciaInventario
                >
            >(
                `transferencia-inventario/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Crear
    |--------------------------------------------------------------------------
    */

    crear(
        data:
            TransferenciaInventarioCrearRequest
    ):
        Observable<
            TransferenciaInventario
        > {

        return this.api
            .post<
                TransferenciaInventario
            >(
                'transferencia-inventario',
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
            TransferenciaInventarioActualizarRequest
    ):
        Observable<
            TransferenciaInventario
        > {

        return this.api
            .put<
                TransferenciaInventario
            >(
                `transferencia-inventario/${id}`,
                data
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Enviar
    |--------------------------------------------------------------------------
    */

    enviar(
        id:
            number,

        data:
            EnviarTransferenciaInventarioRequest
    ):
        Observable<
            TransferenciaInventario
        > {

        return this.api
            .patch<
                TransferenciaInventario
            >(
                `transferencia-inventario/${id}/enviar`,
                data
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Completar
    |--------------------------------------------------------------------------
    */

    completar(
        id:
            number,

        data:
            CompletarTransferenciaInventarioRequest
    ):
        Observable<
            TransferenciaInventario
        > {

        return this.api
            .patch<
                TransferenciaInventario
            >(
                `transferencia-inventario/${id}/completar`,
                data
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Rechazar
    |--------------------------------------------------------------------------
    */

    rechazar(
        id:
            number,

        data:
            RechazarTransferenciaInventarioRequest
    ):
        Observable<
            TransferenciaInventario
        > {

        return this.api
            .patch<
                TransferenciaInventario
            >(
                `transferencia-inventario/${id}/rechazar`,
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
                `transferencia-inventario/${id}`
            );

    }

}