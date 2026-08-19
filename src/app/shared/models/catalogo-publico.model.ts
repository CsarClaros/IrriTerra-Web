export interface CategoriaPublica {

    id_categoria:
        number;

    nombre:
        string;

}


export interface ImagenProductoPublica {

    id_producto_imagen:
        number;

    ruta_imagen:
        string | null;

    orden:
        number;

    es_principal:
        boolean;

}


export interface VarianteProductoPublica {

    id_producto_variante:
        number;

    nombre:
        string;

    codigo_comercial:
        string | null;

    unidad_medida:
        string;

    descripcion:
        string | null;

    precio_venta:
        number | null;

}


export interface ProductoPublico {

    id_producto:
        number;

    id_categoria:
        number;

    nombre:
        string;

    marca:
        string | null;

    modelo:
        string | null;

    descripcion:
        string | null;

    catalogo_pdf:
        string | null;

    categoria:
        CategoriaPublica | null;

    imagenes:
        ImagenProductoPublica[];

    variantes:
        VarianteProductoPublica[];

}


export interface CatalogoPublico {

    categorias:
        CategoriaPublica[];

    productos:
        ProductoPublico[];

}


export interface CatalogoPublicoResponse {

    data:
        CatalogoPublico;

}