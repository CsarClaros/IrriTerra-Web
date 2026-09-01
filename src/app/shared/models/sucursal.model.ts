export interface Sucursal {

    id_sucursal: number;

    id_empresa: number;

    codigo: string;

    nombre: string;

    departamento: string;

    ciudad: string;

    direccion: string | null;

    telefono: string | null;

    correo: string | null;


    url_maps: string | null;

    url_maps_embed: string | null;

    observaciones: string | null;

    estado_registro: string;

    created_at?: string | null;

    updated_at?: string | null;
}


export interface SucursalRequest {

    id_empresa: number;

    codigo: string;

    nombre: string;

    departamento: string;

    ciudad: string;

    direccion?: string | null;

    telefono?: string | null;

    correo?: string | null;

    url_maps?: string | null;

    url_maps_embed?: string | null;

    observaciones?: string | null;

    estado_registro: string;
}