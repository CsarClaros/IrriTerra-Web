export interface EmpresaPublica {

    id_empresa: number;

    nombre: string;

    telefono: string | null;

    correo: string | null;

    direccion: string | null;

    sitio_web: string | null;

    logo: string | null;
}


export interface EmpresaPublicaResponse {

    data:
        EmpresaPublica;

}