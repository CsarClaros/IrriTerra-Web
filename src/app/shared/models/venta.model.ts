import {
    Cliente
} from './cliente.model';

import {
    ProductoVariante
} from './producto-variante.model';

import {
    Sucursal
} from './sucursal.model';

import {
    Usuario
} from './user.model';


/*
|--------------------------------------------------------------------------
| Valores API
|--------------------------------------------------------------------------
*/

export type DecimalApi =
    number
    |
    string;


export type VentaEstado =
    'BORRADOR'
    |
    'COMPLETADA'
    |
    'ANULADA';


export type MetodoPagoVenta =
    'EFECTIVO'
    |
    'TRANSFERENCIA'
    |
    'QR'
    |
    'TARJETA';


/*
|--------------------------------------------------------------------------
| Detalle
|--------------------------------------------------------------------------
|
| VentaResource confirma que devuelve una colección "detalles".
|
| Todavía no tenemos VentaDetalleResource.php, por lo que mantenemos
| algunas propiedades opcionales hasta revisarlo en el Bloque 3.
|
*/

export interface VentaDetalle {

    id_venta_detalle:
        number;

    id_venta:
        number;

    id_producto_variante:
        number;

    cantidad:
        DecimalApi;

    precio_unitario:
        DecimalApi;

    descuento:
        DecimalApi;

    subtotal:
        DecimalApi;

    observaciones:
        string | null;

    estado_registro:
        string;

    usuario_creacion?:
        number | null;

    usuario_modificacion?:
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
| Venta
|--------------------------------------------------------------------------
*/

export interface Venta {

    id_venta:
        number;

    codigo_venta:
        string;

    id_sucursal:
        number;

    id_cliente:
        number;

    id_usuario_vendedor:
        number;

    estado_venta:
        VentaEstado;

    fecha_venta:
        string | null;

    fecha_pago:
        string | null;

    fecha_anulacion:
        string | null;

    subtotal:
        DecimalApi;

    descuento:
        DecimalApi;

    total:
        DecimalApi;

    monto_pagado:
        DecimalApi | null;

    metodo_pago:
        MetodoPagoVenta | null;

    motivo_anulacion:
        string | null;

    id_usuario_anulacion:
        number | null;

    observaciones:
        string | null;

    estado_registro:
        string;

    usuario_creacion?:
        number | null;

    usuario_modificacion?:
        number | null;


    /*
    |--------------------------------------------------------------------------
    | Relaciones
    |--------------------------------------------------------------------------
    */

    sucursal?:
        Sucursal | null;

    cliente?:
        Cliente | null;

    vendedor?:
        Usuario | null;

    detalles?:
        VentaDetalle[];


    /*
    |--------------------------------------------------------------------------
    | Fechas auditoría
    |--------------------------------------------------------------------------
    */

    created_at?:
        string | null;

    updated_at?:
        string | null;

}


/*
|--------------------------------------------------------------------------
| Detalle para crear / modificar venta
|--------------------------------------------------------------------------
*/

export interface VentaDetalleRequest {

    id_producto_variante:
        number;

    cantidad:
        number;

    /*
     * Opcional.
     *
     * Si se omite, Laravel utiliza
     * el precio de venta vigente.
     */

    precio_unitario?:
        number | null;

    descuento?:
        number;

    observaciones?:
        string | null;

}

/*
|--------------------------------------------------------------------------
| Venta Request
|--------------------------------------------------------------------------
|
| El contrato exacto de StoreVentaRequest se revisará antes del Bloque 3.
|
*/

export interface VentaRequest {

    id_cliente?:
        number | null;

    descuento?:
        number;

    observaciones?:
        string | null;

    detalles:
        VentaDetalleRequest[];

}

/*
|--------------------------------------------------------------------------
| Crear venta
|--------------------------------------------------------------------------
*/

export interface VentaCrearRequest {

    id_sucursal:
        number;

    id_cliente?:
        number | null;

    id_usuario_vendedor:
        number;

    fecha_venta?:
        string;

    observaciones?:
        string | null;
    
    usuario_creacion?:
        number | null;

    detalles:
        VentaDetalleRequest[];


}

/*
|--------------------------------------------------------------------------
| Actualizar venta
|--------------------------------------------------------------------------
|
| UpdateVentaRequest utiliza "sometimes",
| por lo que los campos pueden enviarse
| parcialmente.
|--------------------------------------------------------------------------
*/

export interface VentaActualizarRequest {

    id_sucursal?:
        number;

    id_cliente?:
        number | null;

    id_usuario_vendedor?:
        number;

    fecha_venta?:
        string;

    observaciones?:
        string | null;

    usuario_modificacion?:
        number | null;

    detalles?:
        VentaDetalleRequest[];

}

/*
|--------------------------------------------------------------------------
| Completar
|--------------------------------------------------------------------------
|
| VentaController confirma que existe CompletarVentaRequest y que
| completar registra el pago.
|
| Los campos permanecen opcionales hasta revisar ese Request exacto.
|
*/

export interface CompletarVentaRequest {

    monto_pagado:
        number;

    metodo_pago:
        MetodoPagoVenta;

    usuario_modificacion:
        number;

}


/*
|--------------------------------------------------------------------------
| Anular
|--------------------------------------------------------------------------
*/

export interface AnularVentaRequest {

    id_usuario_anulacion:
        number;

    motivo_anulacion:
        string;

}