import {
    Producto
} from './producto.model';


export interface ProductoImagen {

    id_producto_imagen:
    number;

    id_producto?:
    number | null;

    id_producto_variante?:
    number | null;

    ruta_imagen:
    string | null;

    orden:
    number;

    es_principal:
    boolean;

    estado_registro:
    string;

    texto_alternativo?:
    string | null;

    observaciones?:
    string | null;


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

    id_producto_variante?:
    number | null;

    imagen?:
    File | null;

    orden:
    number;

    es_principal:
    boolean;

    texto_alternativo?:
    string | null;

    observaciones?:
    string | null;

}