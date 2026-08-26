import {
    Compra
} from '../compra.model';

import {
    ReporteProductoOperacion,
    ReporteProductoOperacionResumen
} from './reporte-producto-operacion.model';

import {
    ReporteResponse
} from './reporte-response.model';


export interface ReporteComprasResumen {

    compras:
    number;

    borradores:
    number;

    confirmadas:
    number;

    recibidas:
    number;

    anuladas:
    number;

    subtotal_recibido:
    number;

    descuento_recibido:
    number;

    total_comprado:
    number;

    compra_promedio:
    number;

}


export type ReporteComprasResponse =
    ReporteResponse<
        ReporteComprasResumen,
        Compra
    >;


export type ReporteComprasProductosResponse =
    ReporteResponse<
        ReporteProductoOperacionResumen,
        ReporteProductoOperacion
    >;