import {
    Venta
} from '../venta.model';

import {
    ReporteProductoOperacion,
    ReporteProductoOperacionResumen
} from './reporte-producto-operacion.model';

import {
    ReporteResponse
} from './reporte-response.model';


/*
|--------------------------------------------------------------------------
| Resumen
|--------------------------------------------------------------------------
*/

export interface ReporteVentasResumen {

    ventas:
        number;

    borradores:
        number;

    completadas:
        number;

    anuladas:
        number;

    subtotal_completado:
        number;

    descuento_completado:
        number;

    total_vendido:
        number;

    ticket_promedio:
        number;

}


/*
|--------------------------------------------------------------------------
| Respuestas
|--------------------------------------------------------------------------
*/

export type ReporteVentasResponse =
    ReporteResponse<
        ReporteVentasResumen,
        Venta
    >;


export type ReporteVentasProductosResponse =
    ReporteResponse<
        ReporteProductoOperacionResumen,
        ReporteProductoOperacion
    >;