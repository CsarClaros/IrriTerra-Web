import {
    ReporteStockBajoResumen,
    ReporteStockInventario
} from './reportes/reporte-inventario.model';

import {
    ReporteVentasResumen
} from './reportes/reporte-ventas.model';

import {
    ReporteComprasResumen
} from './reportes/reporte-compras.model';

import {
    ReporteTransferenciasResumen
} from './reportes/reporte-transferencias.model';

import {
    ReporteProductoOperacion
} from './reportes/reporte-producto-operacion.model';

import {
    Venta
} from './venta.model';

import {
    Compra
} from './compra.model';

import {
    TransferenciaInventario
} from './transferencia-inventario.model';


/*
|--------------------------------------------------------------------------
| Ventas
|--------------------------------------------------------------------------
*/

export interface DashboardVentas {

    resumen:
    ReporteVentasResumen;

    productos:
    ReporteProductoOperacion[];

    ventas:
    Venta[];

}


/*
|--------------------------------------------------------------------------
| Inventario
|--------------------------------------------------------------------------
*/

export interface DashboardInventario {

    resumenCritico:
    ReporteStockBajoResumen;

    stockCritico:
    ReporteStockInventario[];

}


/*
|--------------------------------------------------------------------------
| Compras
|--------------------------------------------------------------------------
*/

export interface DashboardCompras {

    resumen:
    ReporteComprasResumen;

    compras:
    Compra[];

}


/*
|--------------------------------------------------------------------------
| Transferencias
|--------------------------------------------------------------------------
*/

export interface DashboardTransferencias {

    resumen:
    ReporteTransferenciasResumen;

    transferencias:
    TransferenciaInventario[];

}


/*
|--------------------------------------------------------------------------
| Módulos
|--------------------------------------------------------------------------
*/

export type DashboardModulo =
    | 'VENTAS'
    | 'INVENTARIO'
    | 'COMPRAS'
    | 'TRANSFERENCIAS';


/*
|--------------------------------------------------------------------------
| Dashboard general
|--------------------------------------------------------------------------
*/

export interface DashboardGeneral {

    ventas:
    DashboardVentas | null;

    inventario:
    DashboardInventario | null;

    compras:
    DashboardCompras | null;

    transferencias:
    DashboardTransferencias | null;

    errores:
    DashboardModulo[];

}