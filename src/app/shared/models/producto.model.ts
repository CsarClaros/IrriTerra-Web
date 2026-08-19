import {
    Categoria
} from './categoria.model';


export interface Producto {

    id_producto: number;

    id_categoria?: number | null;

    nombre: string;

    marca?: string | null;

    modelo?: string | null;

    descripcion?: string | null;

    catalogo_pdf?: string | null;

    observaciones?: string | null;

    estado_registro: string;

    categoria?: Categoria | null;

    created_at?: string | null;

    updated_at?: string | null;

}


export interface ProductoRequest {

    id_categoria: number;

    nombre: string;

    marca?: string | null;

    modelo?: string | null;

    descripcion?: string | null;

    catalogo_pdf?: string | null;

    observaciones?: string | null;

    estado_registro?: string;

}