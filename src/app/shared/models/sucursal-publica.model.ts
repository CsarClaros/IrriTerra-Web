export interface SucursalPublica {

    id_sucursal: number;

    codigo: string;

    nombre: string;

    departamento: string;

    ciudad: string;

    direccion: string | null;

    telefono: string | null;

    correo: string | null;

    url_maps: string | null;

    url_maps_embed: string | null;
}


export interface SucursalesPublicasResponse {

    data:
        SucursalPublica[];

}