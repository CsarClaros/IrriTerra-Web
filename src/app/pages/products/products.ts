import {
    Component,
    OnInit,
    computed,
    inject,
    signal
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    RouterLink
} from '@angular/router';

import {
    HttpErrorResponse
} from '@angular/common/http';

import {
    finalize
} from 'rxjs';

import {
    ArrowRight,
    CircleAlert,
    ImageOff,
    Package,
    RefreshCw,
    Search,
    LucideAngularModule
} from 'lucide-angular';

import {
    CatalogoPublicoService
} from '../../core/services/publico/catalogo-publico.service';

import {
    LanguageService
} from '../../core/services/language.service';

import {
    CategoriaPublica,
    ImagenProductoPublica,
    ProductoPublico
} from '../../shared/models/catalogo-publico.model';

import {
    environment
} from '../../../environments/environment';

import {
    SeoService
} from '../../core/services/seo.service';


@Component({
    selector:
        'app-products',

    imports: [
        CommonModule,
        RouterLink,
        LucideAngularModule
    ],

    templateUrl:
        './products.html',

    styleUrl:
        './products.css'
})
export class Products
    implements OnInit {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly catalogoService =
        inject(
            CatalogoPublicoService
        );


    private readonly languageService =
        inject(
            LanguageService
        );

    private readonly seoService =
        inject(
            SeoService
        );


    /*
    |--------------------------------------------------------------------------
    | Backend
    |--------------------------------------------------------------------------
    */

    private readonly backendUrl =
        environment.apiUrl
            .replace(
                /\/api\/?$/,
                ''
            );


    /*
    |--------------------------------------------------------------------------
    | Datos
    |--------------------------------------------------------------------------
    */

    readonly productos =
        signal<
            ProductoPublico[]
        >([]);


    readonly categorias =
        signal<
            CategoriaPublica[]
        >([]);


    /*
    |--------------------------------------------------------------------------
    | Filtros
    |--------------------------------------------------------------------------
    */

    readonly busqueda =
        signal(
            ''
        );


    readonly idCategoria =
        signal<
            number | null
        >(
            null
        );


    /*
    |--------------------------------------------------------------------------
    | Estado
    |--------------------------------------------------------------------------
    */

    readonly cargando =
        signal(
            false
        );


    readonly errorMensaje =
        signal(
            ''
        );


    readonly erroresImagen =
        signal<
            Record<
                number,
                boolean
            >
        >({});


    /*
    |--------------------------------------------------------------------------
    | Productos filtrados
    |--------------------------------------------------------------------------
    */

    readonly productosFiltrados =
        computed(
            () => {

                const texto =
                    this.busqueda()
                        .trim()
                        .toLowerCase();


                const idCategoria =
                    this.idCategoria();


                return this
                    .productos()
                    .filter(
                        producto => {

                            /*
                             * Categoría.
                             */

                            if (
                                idCategoria !== null
                                &&
                                producto.id_categoria
                                !== idCategoria
                            ) {

                                return false;

                            }


                            /*
                             * Sin búsqueda escrita.
                             */

                            if (
                                !texto
                            ) {

                                return true;

                            }


                            /*
                             * Información general.
                             */

                            const coincideProducto =
                                [

                                    producto.nombre,

                                    producto.marca,

                                    producto.modelo,

                                    producto.descripcion,

                                    producto
                                        .categoria
                                        ?.nombre

                                ]
                                    .some(
                                        valor =>
                                            valor
                                                ?.toLowerCase()
                                                .includes(
                                                    texto
                                                )
                                    );


                            if (
                                coincideProducto
                            ) {

                                return true;

                            }


                            /*
                             * También buscamos dentro
                             * de las variantes.
                             */

                            return producto
                                .variantes
                                .some(
                                    variante => {

                                        return [

                                            variante.nombre,

                                            variante
                                                .codigo_comercial,

                                            variante.descripcion

                                        ]
                                            .some(
                                                valor =>
                                                    valor
                                                        ?.toLowerCase()
                                                        .includes(
                                                            texto
                                                        )
                                            );

                                    }
                                );

                        }
                    );

            }
        );


    /*
    |--------------------------------------------------------------------------
    | Filtros activos
    |--------------------------------------------------------------------------
    */

    readonly hayFiltrosActivos =
        computed(
            () => {

                return (

                    this.busqueda()
                        .trim()
                        .length > 0

                    ||

                    this.idCategoria()
                    !== null

                );

            }
        );


    /*
    |--------------------------------------------------------------------------
    | Iconos
    |--------------------------------------------------------------------------
    */

    readonly ArrowRight =
        ArrowRight;

    readonly CircleAlert =
        CircleAlert;

    readonly ImageOff =
        ImageOff;

    readonly Package =
        Package;

    readonly RefreshCw =
        RefreshCw;

    readonly Search =
        Search;


    /*
    |--------------------------------------------------------------------------
    | Inicio
    |--------------------------------------------------------------------------
    */

    ngOnInit(): void {

        this.configurarSeo();

        this.cargarCatalogo();

    }

    /*
|--------------------------------------------------------------------------
| SEO
|--------------------------------------------------------------------------
*/

    private configurarSeo(): void {

        this.seoService.configurar({

            title:
                'Productos para riego y agricultura | Irriterra S.R.L.',

            description:
                'Conoce el catálogo de Irriterra S.R.L.: motobombas, motocultivadores, motores, generadores, repuestos y soluciones para riego y agricultura en Bolivia.',

            path:
                '/productos'

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Traducción
    |--------------------------------------------------------------------------
    */

    t(
        es: string,
        en: string
    ): string {

        return this
            .languageService
            .t(
                es,
                en
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Catálogo
    |--------------------------------------------------------------------------
    */

    cargarCatalogo(): void {

        if (
            this.cargando()
        ) {

            return;

        }


        this.cargando.set(
            true
        );


        this.errorMensaje.set(
            ''
        );


        this.catalogoService
            .listar()
            .pipe(

                finalize(
                    () => {

                        this.cargando.set(
                            false
                        );

                    }
                )

            )
            .subscribe({

                next:
                    response => {

                        this.productos.set(

                            response
                                .data
                                .productos
                            ?? []

                        );


                        this.categorias.set(

                            response
                                .data
                                .categorias
                            ?? []

                        );


                        this.erroresImagen.set(
                            {}
                        );

                    },


                error:
                    (
                        error:
                            HttpErrorResponse
                    ) => {

                        this.errorMensaje.set(

                            error.status === 0

                                ? this.t(
                                    'No se pudo conectar con el servidor.',
                                    'Could not connect to the server.'
                                )

                                : this.t(
                                    'No fue posible cargar el catálogo.',
                                    'The catalog could not be loaded.'
                                )

                        );

                    }

            });

    }


    /*
    |--------------------------------------------------------------------------
    | Búsqueda
    |--------------------------------------------------------------------------
    */

    actualizarBusqueda(
        event: Event
    ): void {

        const input =
            event.target as HTMLInputElement;


        this.busqueda.set(
            input.value
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Categoría
    |--------------------------------------------------------------------------
    */

    seleccionarCategoria(
        id:
            number | null
    ): void {

        this.idCategoria.set(
            id
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Limpiar filtros
    |--------------------------------------------------------------------------
    */

    limpiarFiltros(): void {

        this.busqueda.set(
            ''
        );


        this.idCategoria.set(
            null
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Precio desde
    |--------------------------------------------------------------------------
    */

    precioDesde(
        producto:
            ProductoPublico
    ): number | null {

        const precios =
            producto
                .variantes
                .map(
                    variante =>
                        variante
                            .precio_venta
                )
                .filter(
                    (
                        precio
                    ): precio is number => {

                        return (

                            precio !== null

                            &&

                            Number.isFinite(
                                precio
                            )

                        );

                    }
                );


        if (
            precios.length === 0
        ) {

            return null;

        }


        return Math.min(
            ...precios
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Imagen principal
    |--------------------------------------------------------------------------
    |
    | Prioridad:
    |
    | 1. Imagen principal general.
    | 2. Primera imagen general.
    | 3. Imagen principal de variante.
    | 4. Primera imagen de variante.
    |
    */

    imagenPrincipal(
        producto:
            ProductoPublico
    ):
        ImagenProductoPublica | null {

        /*
        |--------------------------------------------------------------------------
        | Imágenes generales
        |--------------------------------------------------------------------------
        */

        const generales =
            this.ordenarImagenes(
                producto.imagenes
                ?? []
            );


        const principalGeneral =
            generales
                .find(
                    imagen =>
                        imagen
                            .es_principal
                );


        if (
            principalGeneral
        ) {

            return principalGeneral;

        }


        if (
            generales.length > 0
        ) {

            return generales[0];

        }


        /*
        |--------------------------------------------------------------------------
        | Fallback: imágenes de variantes
        |--------------------------------------------------------------------------
        */

        const imagenesVariantes =
            producto
                .variantes
                .flatMap(
                    variante =>
                        variante.imagenes
                        ?? []
                );


        const ordenadas =
            this.ordenarImagenes(
                imagenesVariantes
            );


        const principalVariante =
            ordenadas
                .find(
                    imagen =>
                        imagen
                            .es_principal
                );


        return (

            principalVariante

            ??

            ordenadas[0]

            ??

            null

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Ordenar imágenes
    |--------------------------------------------------------------------------
    */

    private ordenarImagenes(
        imagenes:
            ImagenProductoPublica[]
    ):
        ImagenProductoPublica[] {

        return [
            ...imagenes
        ]
            .sort(
                (
                    a,
                    b
                ) => {

                    /*
                     * Principal primero.
                     */

                    if (
                        a.es_principal
                        !==
                        b.es_principal
                    ) {

                        return a.es_principal
                            ? -1
                            : 1;

                    }


                    /*
                     * Luego orden.
                     */

                    return (

                        Number(
                            a.orden
                        )

                        -

                        Number(
                            b.orden
                        )

                    );

                }
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Resolver ruta de imagen
    |--------------------------------------------------------------------------
    */

    rutaImagen(
        imagen:
            ImagenProductoPublica | null
    ): string | null {

        const ruta =
            imagen
                ?.ruta_imagen
                ?.trim();


        if (
            !ruta
        ) {

            return null;

        }


        /*
        |--------------------------------------------------------------------------
        | URL absoluta
        |--------------------------------------------------------------------------
        */

        if (
            /^https?:\/\//i
                .test(
                    ruta
                )
        ) {

            return ruta;

        }


        /*
        |--------------------------------------------------------------------------
        | Assets antiguos Angular
        |--------------------------------------------------------------------------
        */

        if (
            ruta.startsWith(
                '/assets/'
            )
        ) {

            return ruta;

        }


        if (
            ruta.startsWith(
                'assets/'
            )
        ) {

            return (
                `/${ruta}`
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Storage Laravel ya resuelto
        |--------------------------------------------------------------------------
        */

        if (
            ruta.startsWith(
                '/storage/'
            )
        ) {

            return (
                `${this.backendUrl}${ruta}`
            );

        }


        if (
            ruta.startsWith(
                'storage/'
            )
        ) {

            return (
                `${this.backendUrl}/${ruta}`
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Rutas almacenadas por ProductoImagenService
        |--------------------------------------------------------------------------
        */

        if (
            ruta.startsWith(
                'productos/'
            )
        ) {

            return (
                `${this.backendUrl}/storage/${ruta}`
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Compatibilidad
        |--------------------------------------------------------------------------
        */

        return (

            `${this.backendUrl}/${ruta.replace(
                /^\/+/,
                ''
            )
            }`

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error de imagen
    |--------------------------------------------------------------------------
    */

    registrarErrorImagen(
        imagen:
            ImagenProductoPublica
    ): void {

        this.erroresImagen.update(
            errores => ({

                ...errores,

                [
                    imagen
                        .id_producto_imagen
                ]:
                    true

            })
        );

    }


    imagenConError(
        imagen:
            ImagenProductoPublica
    ): boolean {

        return Boolean(

            this.erroresImagen()[
            imagen
                .id_producto_imagen
            ]

        );

    }

}