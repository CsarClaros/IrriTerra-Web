import {
    ProductoVariante
} from './producto-variante.model';

import {
    Sucursal
} from './sucursal.model';


export interface StockSucursal {

    id_stock_sucursal: number;

    id_producto_variante?:
        number | null;

    id_sucursal?:
        number | null;

    /*
    |--------------------------------------------------------------------------
    | Stock
    |--------------------------------------------------------------------------
    */

    stock_actual:
        number;

    stock_minimo:
        number;

    stock_maximo:
        number;

    estado_registro:
        string;


    /*
    |--------------------------------------------------------------------------
    | Relaciones opcionales
    |--------------------------------------------------------------------------
    */

    producto_variante?:
        ProductoVariante | null;

    variante?:
        ProductoVariante | null;

    sucursal?:
        Sucursal | null;


    /*
    |--------------------------------------------------------------------------
    | Fechas
    |--------------------------------------------------------------------------
    */

    created_at?:
        string | null;

    updated_at?:
        string | null;

}


/*
|--------------------------------------------------------------------------
| Configuración
|--------------------------------------------------------------------------
|
| stock_actual NO se envía.
|
| Su modificación debe producirse mediante MovimientoInventario.
|
*/

export interface StockSucursalRequest {

    id_producto_variante:
        number;

    id_sucursal:
        number;

    stock_minimo:
        number;

    stock_maximo:
        number;

    estado_registro?:
        string;

}