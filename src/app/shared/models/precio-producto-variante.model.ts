import {
    ProductoVariante
} from './producto-variante.model';


export interface PrecioProductoVariante {

    id_precio_producto_variante:
    number;

    id_producto_variante?:
    number | null;

    costo_compra?:
    number | null;

    precio_venta:
    number;

    precio_minimo:
    number;

    estado_registro:
    string;

    /*
    |--------------------------------------------------------------------------
    | Relaciones opcionales
    |--------------------------------------------------------------------------
    |
    | Dejamos ambas formas disponibles porque el Resource puede devolver
    | directamente el ID o una relación cargada.
    |
    */

    producto_variante?:
    ProductoVariante | null;

    variante?:
    ProductoVariante | null;

    created_at?:
    string | null;

    updated_at?:
    string | null;

}


export interface PrecioProductoVarianteRequest {

    id_producto_variante:
    number;

    costo_compra?:
    number | null;

    precio_venta:
    number;

    precio_minimo:
    number;

    estado_registro?:
    string;

}