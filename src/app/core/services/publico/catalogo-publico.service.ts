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
    CatalogoPublicoResponse,
    ProductoPublicoResponse
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


    /*
    |--------------------------------------------------------------------------
    | Producto
    |--------------------------------------------------------------------------
    */

    obtenerProducto(
        id: number
    ): Observable<
        ProductoPublicoResponse
    > {

        return this.api
            .get<
                ProductoPublicoResponse
            >(
                `public/productos/${id}`
            );

    }

}