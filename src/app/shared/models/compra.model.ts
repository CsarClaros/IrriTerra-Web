import {
    ProductoVariante
} from './producto-variante.model';

import {
    Sucursal
} from './sucursal.model';

import {
    Usuario
} from './user.model';

import { Proveedor } from "./proveedor.model";

/*
|--------------------------------------------------------------------------
| Estados
|--------------------------------------------------------------------------
*/

export type EstadoCompra =
    | 'BORRADOR'
    | 'CONFIRMADA'
    | 'RECIBIDA'
    | 'ANULADA';


/*
|--------------------------------------------------------------------------
| Detalle
|--------------------------------------------------------------------------
*/

export interface CompraDetalle {

    id_compra_detalle:
    number;

    id_compra:
    number;

    id_producto_variante:
    number;

    cantidad:
    number | string;

    costo_unitario:
    number | string;

    descuento:
    number | string;

    subtotal:
    number | string;

    observaciones:
    string | null;

    estado_registro:
    string;

    usuario_creacion:
    number | null;

    usuario_modificacion:
    number | null;

    producto_variante?:
    ProductoVariante | null;

    created_at?:
    string | null;

    updated_at?:
    string | null;

}


/*
|--------------------------------------------------------------------------
| Compra
|--------------------------------------------------------------------------
*/

export interface Compra {

    id_compra:
    number;

    codigo_compra:
    string;

    id_sucursal:
    number;

    id_proveedor:
    number;

    id_usuario_comprador:
    number;

    estado_compra:
    EstadoCompra;

    fecha_compra:
    string | null;

    fecha_confirmacion:
    string | null;

    fecha_recepcion:
    string | null;

    fecha_anulacion:
    string | null;

    numero_factura:
    string | null;

    subtotal:
    number | string;

    descuento:
    number | string;

    total:
    number | string;

    id_usuario_confirmacion:
    number | null;

    id_usuario_recepcion:
    number | null;

    id_usuario_anulacion:
    number | null;

    motivo_anulacion:
    string | null;

    observaciones:
    string | null;

    estado_registro:
    string;

    usuario_creacion:
    number | null;

    usuario_modificacion:
    number | null;

    sucursal?:
    Sucursal | null;

    /*
    |--------------------------------------------------------------------------
    | El tipo exacto del proveedor se definirá al integrar ProveedorResource.
    |--------------------------------------------------------------------------
    */

    proveedor?:
    Proveedor | null;

    comprador?:
    Usuario | null;

    usuario_confirmacion?:
    Usuario | null;

    usuario_recepcion?:
    Usuario | null;

    usuario_anulacion?:
    Usuario | null;

    detalles?:
    CompraDetalle[];

    created_at?:
    string | null;

    updated_at?:
    string | null;

}


/*
|--------------------------------------------------------------------------
| Detalle Request
|--------------------------------------------------------------------------
*/

export interface CompraDetalleRequest {

    id_producto_variante:
    number;

    cantidad:
    number;

    costo_unitario:
    number;

    descuento?:
    number;

    observaciones?:
    string | null;

}


/*
|--------------------------------------------------------------------------
| Crear
|--------------------------------------------------------------------------
*/

export interface CompraCrearRequest {

    id_sucursal:
    number;

    id_proveedor:
    number;

    id_usuario_comprador:
    number;

    fecha_compra?:
    string;

    numero_factura?:
    string | null;

    observaciones?:
    string | null;

    usuario_creacion?:
    number | null;

    detalles:
    CompraDetalleRequest[];

}


/*
|--------------------------------------------------------------------------
| Actualizar
|--------------------------------------------------------------------------
*/

export interface CompraActualizarRequest {

    id_sucursal?:
    number;

    id_proveedor?:
    number;

    id_usuario_comprador?:
    number;

    fecha_compra?:
    string;

    numero_factura?:
    string | null;

    observaciones?:
    string | null;

    usuario_modificacion?:
    number | null;

    detalles?:
    CompraDetalleRequest[];

}


/*
|--------------------------------------------------------------------------
| Confirmar
|--------------------------------------------------------------------------
*/

export interface ConfirmarCompraRequest {

    id_usuario_confirmacion:
    number;

}


/*
|--------------------------------------------------------------------------
| Recibir
|--------------------------------------------------------------------------
*/

export interface RecibirCompraRequest {

    id_usuario_recepcion:
    number;

}


/*
|--------------------------------------------------------------------------
| Anular
|--------------------------------------------------------------------------
*/

export interface AnularCompraRequest {

    id_usuario_anulacion:
    number;

    motivo_anulacion:
    string;

}