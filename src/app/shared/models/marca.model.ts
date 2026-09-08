export interface Marca {

    id_marca:
    number;

    nombre:
    string;

    slug:
    string;

    pais:
    string | null;

    logo:
    string | null;

    sitio_web:
    string | null;

    orden:
    number;

    observaciones:
    string | null;

    estado_registro:
    string;

    created_at?:
    string | null;

    updated_at?:
    string | null;

}


export interface MarcaRequest {

    nombre:
    string;

    pais?:
    string | null;

    logo?:
    string | null;

    sitio_web?:
    string | null;

    orden?:
    number | null;

    observaciones?:
    string | null;

}