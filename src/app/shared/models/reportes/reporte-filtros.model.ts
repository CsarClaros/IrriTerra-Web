import {
    VentaEstado
} from '../venta.model';

export type EstadoStockReporte =
    | 'TODOS'
    | 'AGOTADO'
    | 'BAJO'
    | 'NORMAL';


export type TipoReferenciaInventario =
    | 'VENTA'
    | 'COMPRA'
    | 'TRANSFERENCIA'
    | 'AJUSTE_INICIAL'
    | 'AJUSTE_PRUEBA'
    | 'AJUSTE_MANUAL';


/*
|--------------------------------------------------------------------------
| Inventario
|--------------------------------------------------------------------------
*/

export interface ReporteStockInventarioFiltros {

    id_sucursal?:
    number | null;

    id_producto_variante?:
    number | null;

    id_categoria?:
    number | null;

    estado_stock?:
    EstadoStockReporte | null;

}


export interface ReporteKardexFiltros {

    id_sucursal?:
    number | null;

    id_producto_variante?:
    number | null;

    /*
    |--------------------------------------------------------------------------
    | Se mantiene como string porque el Request utiliza
    | MovimientoInventario::TIPOS y todavía no necesitamos
    | duplicar esa enumeración backend en Reportes.
    |--------------------------------------------------------------------------
    */

    tipo_movimiento?:
    string | null;

    tipo_referencia?:
    TipoReferenciaInventario | null;

    fecha_desde?:
    string | null;

    fecha_hasta?:
    string | null;

}


/*
|--------------------------------------------------------------------------
| Ventas
|--------------------------------------------------------------------------
*/

export interface ReporteVentasFiltros {

    id_sucursal?:
        number | null;

    id_cliente?:
        number | null;

    id_usuario_vendedor?:
        number | null;

    id_producto_variante?:
        number | null;

    estado_venta?:
        VentaEstado | null;

    fecha_desde?:
        string | null;

    fecha_hasta?:
        string | null;

    limite?:
        number | null;

}


/*
|--------------------------------------------------------------------------
| Compras
|--------------------------------------------------------------------------
*/

export interface ReporteComprasFiltros {

    id_sucursal?:
    number | null;

    id_proveedor?:
    number | null;

    id_usuario_comprador?:
    number | null;

    id_producto_variante?:
    number | null;

    estado_compra?:
    'BORRADOR'
    | 'CONFIRMADA'
    | 'RECIBIDA'
    | 'ANULADA'
    | null;

    fecha_desde?:
    string | null;

    fecha_hasta?:
    string | null;

    limite?:
    number | null;

}


/*
|--------------------------------------------------------------------------
| Transferencias
|--------------------------------------------------------------------------
*/

export interface ReporteTransferenciasFiltros {

    id_sucursal_origen?:
    number | null;

    id_sucursal_destino?:
    number | null;

    id_producto_variante?:
    number | null;

    estado_transferencia?:
    'PENDIENTE'
    | 'EN_TRANSITO'
    | 'COMPLETADA'
    | 'RECHAZADA'
    | null;

    fecha_desde?:
    string | null;

    fecha_hasta?:
    string | null;

    limite?:
    number | null;

}