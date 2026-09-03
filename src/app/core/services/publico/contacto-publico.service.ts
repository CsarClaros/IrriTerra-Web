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
    ContactoPublicoRequest,
    ContactoPublicoResponse
} from '../../../shared/models/contacto-publico.model';


@Injectable({
    providedIn: 'root'
})
export class ContactoPublicoService {

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
    | Enviar
    |--------------------------------------------------------------------------
    */

    enviar(
        data:
            ContactoPublicoRequest
    ): Observable<
        ContactoPublicoResponse
    > {

        return this.api
            .post<
                ContactoPublicoResponse
            >(
                'public/contacto',
                data
            );

    }

}