export interface UsuarioFormData {

    id_rol:
    number | null;

    id_sucursal:
    number | null;

    ci:
    string;

    nombre:
    string;

    apellido_paterno:
    string;

    apellido_materno:
    string;

    correo:
    string;

    telefono:
    string;

    direccion:
    string;

    foto:
    File | null;

}


export type ModoFormularioUsuario =
    'CREAR'
    |
    'EDITAR';