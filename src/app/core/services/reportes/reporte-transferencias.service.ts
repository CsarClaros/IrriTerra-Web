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
    ReporteTransferenciasFiltros
} from '../../../shared/models/reportes/reporte-filtros.model';

import {
    ReporteTransferenciasProductosResponse,
    ReporteTransferenciasResponse
} from '../../../shared/models/reportes/reporte-transferencias.model';

import {
    construirQueryReporte
} from './reporte-query.util';


@Injectable({
    providedIn:
        'root'
})
export class ReporteTransferenciasService {

    private readonly api =
        inject(
            ApiService
        );


    resumen(
        filtros:
            ReporteTransferenciasFiltros = {}
    ):
        Observable<
            ReporteTransferenciasResponse
        > {

        return this.api
            .get<
                ReporteTransferenciasResponse
            >(
                'reportes/transferencias/resumen'
                +
                construirQueryReporte(
                    filtros
                )
            );

    }


    productos(
        filtros:
            ReporteTransferenciasFiltros = {}
    ): Observable<
        ReporteTransferenciasProductosResponse
    > {

        const {
            estado_transferencia,
            ...filtrosProductos
        } = filtros;


        return this.api
            .get<
                ReporteTransferenciasProductosResponse
            >(
                'reportes/transferencias/productos'
                +
                construirQueryReporte(
                    filtrosProductos
                )
            );

    }

}