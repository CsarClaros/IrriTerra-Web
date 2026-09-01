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
    EmpresaPublicaResponse
} from '../../../shared/models/empresa-publica.model';


@Injectable({
    providedIn:
        'root'
})
export class EmpresaPublicaService {

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
    | Obtener empresa
    |--------------------------------------------------------------------------
    */

    obtener():
        Observable<
            EmpresaPublicaResponse
        > {

        return this.api
            .get<
                EmpresaPublicaResponse
            >(
                'public/empresa'
            );

    }

}