import {
    ProductoVariante
} from './producto-variante.model';

import {
    Sucursal
} from './sucursal.model';


/*
|--------------------------------------------------------------------------
| Estados
|--------------------------------------------------------------------------
*/

export type EstadoTransferenciaInventario =

    | 'PENDIENTE'
    | 'EN_TRANSITO'
    | 'COMPLETADA'
    | 'RECHAZADA';


/*
|--------------------------------------------------------------------------
| Detalle
|--------------------------------------------------------------------------
*/

export interface TransferenciaInventarioDetalle {

    id_transferencia_inventario_detalle:
        number;

    id_transferencia_inventario:
        number;

    id_producto_variante:
        number;

    cantidad:
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
| Transferencia
|--------------------------------------------------------------------------
*/

export interface TransferenciaInventario {

    id_transferencia_inventario:
        number;

    codigo_transferencia:
        string;

    id_sucursal_origen:
        number;

    id_sucursal_destino:
        number;

    estado_transferencia:
        EstadoTransferenciaInventario;

    fecha_solicitud:
        string | null;

    fecha_envio:
        string | null;

    fecha_recepcion:
        string | null;

    fecha_rechazo:
        string | null;

    id_usuario_solicitud:
        number;

    id_usuario_envio:
        number | null;

    id_usuario_recepcion:
        number | null;

    id_usuario_rechazo:
        number | null;

    motivo_rechazo:
        string | null;

    observaciones:
        string | null;

    estado_registro:
        string;

    usuario_creacion:
        number | null;

    usuario_modificacion:
        number | null;

    sucursal_origen?:
        Sucursal | null;

    sucursal_destino?:
        Sucursal | null;

    detalles?:
        TransferenciaInventarioDetalle[];

    created_at?:
        string | null;

    updated_at?:
        string | null;

}


/*
|--------------------------------------------------------------------------
| Request detalle
|--------------------------------------------------------------------------
*/

export interface TransferenciaInventarioDetalleRequest {

    id_producto_variante:
        number;

    cantidad:
        number;

    observaciones?:
        string | null;

}


/*
|--------------------------------------------------------------------------
| Crear transferencia
|--------------------------------------------------------------------------
*/

export interface TransferenciaInventarioCrearRequest {

    id_sucursal_origen:
        number;

    id_sucursal_destino:
        number;

    fecha_solicitud?:
        string;

    id_usuario_solicitud:
        number;

    observaciones?:
        string | null;

    usuario_creacion?:
        number | null;

    detalles:
        TransferenciaInventarioDetalleRequest[];

}


/*
|--------------------------------------------------------------------------
| Actualizar transferencia
|--------------------------------------------------------------------------
*/

export interface TransferenciaInventarioActualizarRequest {

    id_sucursal_origen?:
        number;

    id_sucursal_destino?:
        number;

    observaciones?:
        string | null;

    usuario_modificacion?:
        number | null;

    detalles?:
        TransferenciaInventarioDetalleRequest[];

}

/*
|--------------------------------------------------------------------------
| Enviar transferencia
|--------------------------------------------------------------------------
*/

export interface EnviarTransferenciaInventarioRequest {

    id_usuario_envio:
        number;

}


/*
|--------------------------------------------------------------------------
| Completar transferencia
|--------------------------------------------------------------------------
*/

export interface CompletarTransferenciaInventarioRequest {

    id_usuario_recepcion:
        number;

}


/*
|--------------------------------------------------------------------------
| Rechazar transferencia
|--------------------------------------------------------------------------
*/

export interface RechazarTransferenciaInventarioRequest {

    id_usuario_rechazo:
        number;

    motivo_rechazo:
        string;

}

