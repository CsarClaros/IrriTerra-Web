import {
    Producto
} from './producto.model';

import {
    Marca
} from './marca.model';


export interface ProductoVariante {

    id_producto_variante:
    number;

    id_producto?:
    number | null;

    id_marca?:
    number | null;

    nombre:
    string;

    sku:
    string;

    codigo_comercial?:
    string | null;

    unidad_medida:
    string;

    descripcion?:
    string | null;

    observaciones?:
    string | null;

    estado_registro:
    string;

    marca?:
    Marca | null;

    producto?:
    Producto | null;

    created_at?:
    string | null;

    updated_at?:
    string | null;

}


export interface ProductoVarianteRequest {

    id_producto:
    number;

    id_marca?:
    number | null;

    nombre:
    string;

    sku:
    string;

    codigo_comercial?:
    string | null;

    unidad_medida:
    string;

    descripcion?:
    string | null;

    observaciones?:
    string | null;

    estado_registro?:
    string;

}