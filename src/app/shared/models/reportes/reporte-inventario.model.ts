import {
    ProductoVariante
} from '../producto-variante.model';

import {
    Sucursal
} from '../sucursal.model';

import {
    StockSucursal
} from '../stock-sucursal.model';

import {
    ReporteResponse
} from './reporte-response.model';


export type EstadoStockInventario =
    | 'AGOTADO'
    | 'BAJO'
    | 'NORMAL';


/*
|--------------------------------------------------------------------------
| Stock
|--------------------------------------------------------------------------
*/

export interface ReporteStockInventario {

    id_stock_sucursal:
    number;

    id_sucursal:
    number;

    id_producto_variante:
    number;

    stock_actual:
    number;

    stock_minimo:
    number | null;

    stock_maximo:
    number | null;

    estado_stock:
    EstadoStockInventario | null;

    faltante_minimo:
    number | null;

    costo_compra:
    number | null;

    valor_inventario:
    number | null;

    tiene_precio_configurado:
    boolean | null;

    ubicacion_almacen:
    string | null;

    sucursal:
    Sucursal;

    producto_variante:
    ProductoVariante;

}


export interface ReporteStockResumen {

    registros:
    number;

    agotados:
    number;

    bajo_minimo:
    number;

    normales:
    number;

    stock_total:
    number;

}


export interface ReporteStockBajoResumen {

    registros:
    number;

    agotados:
    number;

    bajo_minimo:
    number;

    faltante_total:
    number;

}


export interface ReporteValoracionResumen {

    registros:
    number;

    stock_total:
    number;

    valor_total_inventario:
    number;

    sin_precio_configurado:
    number;

}


/*
|--------------------------------------------------------------------------
| Kardex
|--------------------------------------------------------------------------
*/

export interface ReporteMovimientoInventario {

    id_movimiento_inventario:
    number;

    codigo_movimiento:
    string;

    id_stock_sucursal:
    number;

    tipo_movimiento:
    string;

    cantidad:
    number;

    stock_anterior:
    number;

    stock_resultante:
    number;

    motivo:
    string;

    tipo_referencia:
    string | null;

    id_referencia:
    number | null;

    fecha_movimiento:
    string;

    observaciones:
    string | null;

    stock_sucursal:
    StockSucursal;

}


export interface ReporteKardexResumen {

    movimientos:
    number;

    cantidad_entradas:
    number;

    cantidad_salidas:
    number;

}

export type ReporteStockResponse =
    ReporteResponse<
        ReporteStockResumen,
        ReporteStockInventario
    >;


export type ReporteStockBajoResponse =
    ReporteResponse<
        ReporteStockBajoResumen,
        ReporteStockInventario
    >;


export type ReporteValoracionResponse =
    ReporteResponse<
        ReporteValoracionResumen,
        ReporteStockInventario
    >;


export type ReporteKardexResponse =
    ReporteResponse<
        ReporteKardexResumen,
        ReporteMovimientoInventario
    >;