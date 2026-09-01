export interface Categoria {

    id_categoria: number;

    nombre: string;

    descripcion: string | null;

    observaciones: string | null;

    estado_registro: string;

    created_at?: string | null;

    updated_at?: string | null;

}


export interface CategoriaRequest {

    nombre: string;

    descripcion?: string | null;

    observaciones?: string | null;

}