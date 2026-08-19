export type ClienteTipo =
    'PERSONA'
    |
    'EMPRESA'
    |
    'CONSUMIDOR_FINAL';


export interface Cliente {

    id_cliente:
        number;

    tipo_cliente:
        ClienteTipo;

    nombre_razon_social:
        string;

    tipo_documento?:
        string | null;

    numero_documento?:
        string | null;

    telefono?:
        string | null;

    correo?:
        string | null;

    direccion?:
        string | null;

    observaciones?:
        string | null;

    estado_registro:
        string;

    usuario_creacion?:
        number | null;

    usuario_modificacion?:
        number | null;

    created_at?:
        string | null;

    updated_at?:
        string | null;

}


export interface ClienteRequest {

    tipo_cliente:
        ClienteTipo;

    nombre_razon_social:
        string;

    tipo_documento?:
        string | null;

    numero_documento?:
        string | null;

    telefono?:
        string | null;

    correo?:
        string | null;

    direccion?:
        string | null;

    observaciones?:
        string | null;

    estado_registro?:
        string;

}