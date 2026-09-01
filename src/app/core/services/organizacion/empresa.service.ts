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
    Empresa,
    EmpresaRequest
} from '../../../shared/models/empresa.model';

import {
    ApiCollectionResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';


@Injectable({
    providedIn: 'root'
})
export class EmpresaService {

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
            ApiCollectionResponse<Empresa>
        > {

        return this.api
            .get<
                ApiCollectionResponse<Empresa>
            >(
                'empresa'
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Obtener
    |--------------------------------------------------------------------------
    */

    obtener(
        id: number
    ):
        Observable<
            ApiResourceResponse<Empresa>
        > {

        return this.api
            .get<
                ApiResourceResponse<Empresa>
            >(
                `empresa/${id}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Actualizar
    |--------------------------------------------------------------------------
    */

    actualizar(
        id: number,
        data: EmpresaRequest
    ):
        Observable<
            ApiResourceResponse<Empresa>
        > {

        const formData =
            new FormData();


        /*
         * Laravel interpretará esta
         * solicitud como PUT.
         */

        formData.append(
            '_method',
            'PUT'
        );


        formData.append(
            'nombre',
            data.nombre
        );


        formData.append(
            'nit',
            data.nit
        );


        formData.append(
            'telefono',
            data.telefono ?? ''
        );


        formData.append(
            'correo',
            data.correo ?? ''
        );


        formData.append(
            'direccion',
            data.direccion ?? ''
        );


        formData.append(
            'sitio_web',
            data.sitio_web ?? ''
        );


        formData.append(
            'observaciones',
            data.observaciones ?? ''
        );


        formData.append(
            'estado_registro',
            data.estado_registro
        );


        /*
         * Logo solamente cuando
         * seleccionamos uno nuevo.
         */

        if (
            data.logo
        ) {

            formData.append(
                'logo',
                data.logo
            );

        }


        return this.api
            .post<
                ApiResourceResponse<Empresa>
            >(
                `empresa/${id}`,
                formData
            );

    }

}