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
    ReporteComprasFiltros
} from '../../../shared/models/reportes/reporte-filtros.model';

import {
    ReporteComprasProductosResponse,
    ReporteComprasResponse
} from '../../../shared/models/reportes/reporte-compras.model';

import {
    construirQueryReporte
} from './reporte-query.util';


@Injectable({
    providedIn:
        'root'
})
export class ReporteComprasService {

    private readonly api =
        inject(
            ApiService
        );


    resumen(
        filtros:
            ReporteComprasFiltros = {}
    ):
        Observable<
            ReporteComprasResponse
        > {

        return this.api
            .get<
                ReporteComprasResponse
            >(
                'reportes/compras/resumen'
                +
                construirQueryReporte(
                    filtros
                )
            );

    }


    productos(
        filtros:
            ReporteComprasFiltros = {}
    ): Observable<
        ReporteComprasProductosResponse
    > {

        const {
            estado_compra,
            ...filtrosProductos
        } = filtros;


        return this.api
            .get<
                ReporteComprasProductosResponse
            >(
                'reportes/compras/productos'
                +
                construirQueryReporte(
                    filtrosProductos
                )
            );

    }

}