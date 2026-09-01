export interface Empresa {

    id_empresa: number;

    nombre: string;
    nit: string;

    telefono: string | null;
    correo: string | null;
    direccion: string | null;
    sitio_web: string | null;

    logo: string | null;

    observaciones: string | null;

    estado_registro: string;

    created_at?: string | null;
    updated_at?: string | null;
}


export interface EmpresaRequest {

    nombre: string;
    nit: string;

    telefono?: string | null;
    correo?: string | null;
    direccion?: string | null;
    sitio_web?: string | null;

    observaciones?: string | null;

    estado_registro: string;

    logo?: File | null;
}