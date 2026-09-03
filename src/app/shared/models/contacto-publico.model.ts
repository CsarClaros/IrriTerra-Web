export type MotivoContacto =
    | 'COTIZACION'
    | 'PRODUCTO'
    | 'REPUESTOS'
    | 'SOPORTE'
    | 'OTRO';


export interface ContactoPublicoRequest {

    nombre:
    string;

    correo:
    string;

    telefono:
    string | null;

    motivo:
    MotivoContacto;

    mensaje:
    string;

    turnstile_token:
    string;

}


export interface ContactoPublicoResponse {

    message:
    string;

}