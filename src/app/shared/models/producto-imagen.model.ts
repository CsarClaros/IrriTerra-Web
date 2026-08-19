import {
    Producto
} from './producto.model';


export interface ProductoImagen {

    id_producto_imagen:
        number;

    id_producto?:
        number | null;

    ruta_imagen:
        string | null;

    orden:
        number;

    es_principal:
        boolean;

    estado_registro:
        string;


    /*
    |--------------------------------------------------------------------------
    | Relación opcional
    |--------------------------------------------------------------------------
    */

    producto?:
        Producto | null;


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


export interface ProductoImagenRequest {

    id_producto:
        number;

    ruta:
        string;

    orden:
        number;

    es_principal:
        boolean;

    estado_registro?:
        string;

}