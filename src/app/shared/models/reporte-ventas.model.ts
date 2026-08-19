import {
    ProductoVariante
} from './producto-variante.model';

import {
    Venta,
    VentaEstado
} from './venta.model';


/*
|--------------------------------------------------------------------------
| Filtros
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
| Resumen general de ventas
|--------------------------------------------------------------------------
*/

export interface ResumenReporteVentas {

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
| Respuesta del resumen
|--------------------------------------------------------------------------
*/

export interface ReporteVentasResponse {

    resumen:
        ResumenReporteVentas;

    data:
        Venta[];

}


/*
|--------------------------------------------------------------------------
| Producto vendido
|--------------------------------------------------------------------------
*/

export interface ReporteProductoVendido {

    id_producto_variante:
        number;

    cantidad:
        number;

    total:
        number | null;

    operaciones:
        number;

    producto_variante:
        ProductoVariante | null;

}


/*
|--------------------------------------------------------------------------
| Resumen de productos vendidos
|--------------------------------------------------------------------------
*/

export interface ResumenReporteProductos {

    productos:
        number;

    cantidad_total:
        number;

    importe_total:
        number;

}


/*
|--------------------------------------------------------------------------
| Respuesta de productos
|--------------------------------------------------------------------------
*/

export interface ReporteProductosVentasResponse {

    resumen:
        ResumenReporteProductos;

    data:
        ReporteProductoVendido[];

}