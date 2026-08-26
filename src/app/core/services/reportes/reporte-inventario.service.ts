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
    ReporteKardexFiltros,
    ReporteStockInventarioFiltros
} from '../../../shared/models/reportes/reporte-filtros.model';

import {
    ReporteKardexResponse,
    ReporteStockBajoResponse,
    ReporteStockResponse,
    ReporteValoracionResponse
} from '../../../shared/models/reportes/reporte-inventario.model';

import {
    construirQueryReporte
} from './reporte-query.util';


@Injectable({
    providedIn:
        'root'
})
export class ReporteInventarioService {

    private readonly api =
        inject(
            ApiService
        );


    /*
    |--------------------------------------------------------------------------
    | Stock
    |--------------------------------------------------------------------------
    */

    stock(
        filtros:
            ReporteStockInventarioFiltros = {}
    ):
        Observable<
            ReporteStockResponse
        > {

        return this.api
            .get<
                ReporteStockResponse
            >(
                'reportes/inventario/stock'
                +
                construirQueryReporte(
                    filtros
                )
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Stock bajo mínimo
    |--------------------------------------------------------------------------
    */

    stockBajoMinimo(
        filtros:
            ReporteStockInventarioFiltros = {}
    ):
        Observable<
            ReporteStockBajoResponse
        > {

        return this.api
            .get<
                ReporteStockBajoResponse
            >(
                'reportes/inventario/stock-bajo-minimo'
                +
                construirQueryReporte(
                    filtros
                )
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Valoración
    |--------------------------------------------------------------------------
    */

    valoracion(
        filtros:
            ReporteStockInventarioFiltros = {}
    ):
        Observable<
            ReporteValoracionResponse
        > {

        return this.api
            .get<
                ReporteValoracionResponse
            >(
                'reportes/inventario/valoracion'
                +
                construirQueryReporte(
                    filtros
                )
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Kardex
    |--------------------------------------------------------------------------
    */

    kardex(
        filtros:
            ReporteKardexFiltros = {}
    ):
        Observable<
            ReporteKardexResponse
        > {

        return this.api
            .get<
                ReporteKardexResponse
            >(
                'reportes/inventario/kardex'
                +
                construirQueryReporte(
                    filtros
                )
            );

    }

}