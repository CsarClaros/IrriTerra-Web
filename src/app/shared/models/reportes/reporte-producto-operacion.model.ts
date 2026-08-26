import {
    ProductoVariante
} from '../producto-variante.model';


export interface ReporteProductoOperacion {

    id_producto_variante:
    number;

    cantidad:
    number;

    /*
    |--------------------------------------------------------------------------
    | Ventas y compras tienen total.
    | Transferencias devuelve null.
    |--------------------------------------------------------------------------
    */

    total:
    number | null;

    operaciones:
    number;

    producto_variante:
    ProductoVariante;

}


export interface ReporteProductoOperacionResumen {

    productos:
    number;

    cantidad_total:
    number;

    /*
    |--------------------------------------------------------------------------
    | Existe en Ventas y Compras.
    | Transferencias no lo devuelve.
    |--------------------------------------------------------------------------
    */

    importe_total?:
    number;

}