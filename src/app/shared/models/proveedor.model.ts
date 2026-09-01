export type TipoProveedor =
    'PERSONA'
    | 'EMPRESA';


export interface Proveedor {

    id_proveedor:
    number;

    tipo_proveedor:
    TipoProveedor;

    nombre_razon_social:
    string;

    tipo_documento:
    string | null;

    numero_documento:
    string | null;

    nombre_contacto:
    string | null;

    telefono:
    string | null;

    correo:
    string | null;

    direccion:
    string | null;

    ciudad:
    string | null;

    departamento:
    string | null;

    observaciones:
    string | null;

    estado_registro:
    string;

    usuario_creacion:
    number | null;

    usuario_modificacion:
    number | null;

    created_at?:
    string | null;

    updated_at?:
    string | null;

}


export interface ProveedorRequest {

    tipo_proveedor:
    TipoProveedor;

    nombre_razon_social:
    string;

    tipo_documento?:
    string | null;

    numero_documento?:
    string | null;

    nombre_contacto?:
    string | null;

    telefono?:
    string | null;

    correo?:
    string | null;

    direccion?:
    string | null;

    ciudad?:
    string | null;

    departamento?:
    string | null;

    observaciones?:
    string | null;

}