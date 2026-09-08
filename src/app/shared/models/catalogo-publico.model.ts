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


/*
|--------------------------------------------------------------------------
| Marca pública
|--------------------------------------------------------------------------
*/

export interface MarcaPublica {

    id_marca:
    number;

    nombre:
    string;

    sitio_web:
    string | null;

}


/*
|--------------------------------------------------------------------------
| Variante pública
|--------------------------------------------------------------------------
*/

export interface VarianteProductoPublica {

    id_producto_variante:
    number;

    id_marca:
    number | null;

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

    marca:
    MarcaPublica | null;

    imagenes:
    ImagenProductoPublica[];

}


/*
|--------------------------------------------------------------------------
| Producto público
|--------------------------------------------------------------------------
*/

export interface ProductoPublico {

    id_producto:
    number;

    id_categoria:
    number;

    nombre:
    string;


    /*
    |--------------------------------------------------------------------------
    | Campo legado
    |--------------------------------------------------------------------------
    |
    | Se mantiene temporalmente.
    | La marca real se obtiene ahora desde cada variante.
    |
    */

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


    /*
    |--------------------------------------------------------------------------
    | Imágenes generales
    |--------------------------------------------------------------------------
    */

    imagenes:
    ImagenProductoPublica[];


    /*
    |--------------------------------------------------------------------------
    | Variantes
    |--------------------------------------------------------------------------
    */

    variantes:
    VarianteProductoPublica[];

}


/*
|--------------------------------------------------------------------------
| Catálogo
|--------------------------------------------------------------------------
*/

export interface CatalogoPublico {

    categorias:
    CategoriaPublica[];

    productos:
    ProductoPublico[];

}


/*
|--------------------------------------------------------------------------
| Respuestas
|--------------------------------------------------------------------------
*/

export interface CatalogoPublicoResponse {

    data:
    CatalogoPublico;

}


export interface ProductoPublicoResponse {

    data:
    ProductoPublico;

}