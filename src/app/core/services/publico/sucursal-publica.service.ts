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
    SucursalesPublicasResponse
} from '../../../shared/models/sucursal-publica.model';


@Injectable({
    providedIn:
        'root'
})
export class SucursalPublicaService {

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
    | Listar sucursales
    |--------------------------------------------------------------------------
    */

    listar():
        Observable<
            SucursalesPublicasResponse
        > {

        return this.api
            .get<
                SucursalesPublicasResponse
            >(
                'public/sucursales'
            );

    }

}