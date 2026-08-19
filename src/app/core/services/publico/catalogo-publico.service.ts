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
    CatalogoPublicoResponse
} from '../../../shared/models/catalogo-publico.model';


@Injectable({
    providedIn: 'root'
})
export class CatalogoPublicoService {

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
    | Catálogo
    |--------------------------------------------------------------------------
    */

    listar():
        Observable<
            CatalogoPublicoResponse
        > {

        return this.api
            .get<
                CatalogoPublicoResponse
            >(
                'public/catalogo'
            );

    }

}