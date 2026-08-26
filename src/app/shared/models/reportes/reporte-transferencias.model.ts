import {
    TransferenciaInventario
} from '../transferencia-inventario.model';

import {
    ReporteProductoOperacion,
    ReporteProductoOperacionResumen
} from './reporte-producto-operacion.model';

import {
    ReporteResponse
} from './reporte-response.model';


export interface ReporteTransferenciasResumen {

    transferencias:
    number;

    pendientes:
    number;

    en_transito:
    number;

    completadas:
    number;

    rechazadas:
    number;

    cantidad_total_solicitada:
    number;

    cantidad_completada:
    number;

}


export type ReporteTransferenciasResponse =
    ReporteResponse<
        ReporteTransferenciasResumen,
        TransferenciaInventario
    >;


export type ReporteTransferenciasProductosResponse =
    ReporteResponse<
        ReporteProductoOperacionResumen,
        ReporteProductoOperacion
    >;