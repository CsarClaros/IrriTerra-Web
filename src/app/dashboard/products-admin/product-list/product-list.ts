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
    forkJoin,
    finalize
} from 'rxjs';

import {
    CircleAlert,
    Package,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    LucideAngularModule
} from 'lucide-angular';

import {
    ProductoService
} from '../../../core/services/catalogos/producto.service';

import {
    CategoriaService
} from '../../../core/services/catalogos/categoria.service';

import {
    SessionService
} from '../../../core/services/session.service';

import {
    Producto
} from '../../../shared/models/producto.model';

import {
    Categoria
} from '../../../shared/models/categoria.model';


@Component({
    selector: 'app-product-list',

    imports: [
        CommonModule,
        RouterLink,
        LucideAngularModule
    ],

    templateUrl: './product-list.html',

    styleUrl: './product-list.css'
})
export class ProductList
    implements OnInit {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly productoService =
        inject(
            ProductoService
        );


    private readonly categoriaService =
        inject(
            CategoriaService
        );


    private readonly sessionService =
        inject(
            SessionService
        );


    /*
    |--------------------------------------------------------------------------
    | Datos
    |--------------------------------------------------------------------------
    */

    readonly productos =
        signal<Producto[]>([]);


    readonly categorias =
        signal<Categoria[]>([]);


    /*
    |--------------------------------------------------------------------------
    | Estado
    |--------------------------------------------------------------------------
    */

    readonly cargando =
        signal(false);


    readonly errorMensaje =
        signal('');


    /*
    |--------------------------------------------------------------------------
    | Filtros
    |--------------------------------------------------------------------------
    */

    readonly busqueda =
        signal('');


    readonly categoriaSeleccionada =
        signal<number | null>(
            null
        );


    /*
    |--------------------------------------------------------------------------
    | Permisos
    |--------------------------------------------------------------------------
    */

    readonly puedeCrear =
        computed(
            () =>
                this.sessionService
                    .tienePermiso(
                        'producto.crear'
                    )
        );


    readonly puedeEditar =
        computed(
            () =>
                this.sessionService
                    .tienePermiso(
                        'producto.editar'
                    )
        );


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


                const categoria =
                    this.categoriaSeleccionada();


                return this.productos()
                    .filter(
                        producto => {

                            /*
                             * Filtro categoría
                             */

                            if (
                                categoria !== null
                                &&
                                this.obtenerIdCategoria(
                                    producto
                                )
                                !== categoria
                            ) {

                                return false;

                            }


                            /*
                             * Sin texto de búsqueda
                             */

                            if (
                                ! texto
                            ) {

                                return true;

                            }


                            /*
                             * Campos buscables
                             */

                            const valores = [

                                producto.nombre,

                                producto.descripcion,

                                producto.marca,

                                producto.modelo,

                                this.nombreCategoria(
                                    producto
                                )

                            ];


                            return valores
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


    /*
    |--------------------------------------------------------------------------
    | Totales
    |--------------------------------------------------------------------------
    */

    readonly totalProductos =
        computed(
            () =>
                this.productos()
                    .length
        );


    readonly totalFiltrados =
        computed(
            () =>
                this.productosFiltrados()
                    .length
        );


    /*
    |--------------------------------------------------------------------------
    | Iconos
    |--------------------------------------------------------------------------
    */

    readonly Search =
        Search;


    readonly Plus =
        Plus;


    readonly Pencil =
        Pencil;


    readonly Package =
        Package;


    readonly RefreshCw =
        RefreshCw;


    readonly CircleAlert =
        CircleAlert;


    /*
    |--------------------------------------------------------------------------
    | Inicio
    |--------------------------------------------------------------------------
    */

    ngOnInit(): void {

        this.cargarDatos();

    }


    /*
    |--------------------------------------------------------------------------
    | Cargar productos y categorías
    |--------------------------------------------------------------------------
    */

    cargarDatos(): void {

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


        forkJoin({

            productos:
                this.productoService
                    .listar(),

            categorias:
                this.categoriaService
                    .listar()

        })
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

                next: response => {

                    this.productos.set(
                        response
                            .productos
                            .data
                        ?? []
                    );


                    this.categorias.set(
                        response
                            .categorias
                            .data
                        ?? []
                    );

                },


                error: (
                    error:
                        HttpErrorResponse
                ) => {

                    this.errorMensaje.set(
                        this.obtenerMensajeError(
                            error
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

    actualizarBusqueda(event: Event): void {

        const input = event.target as HTMLInputElement;


        this.busqueda.set(
            input.value
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Categoría
    |--------------------------------------------------------------------------
    */

    actualizarCategoria(
        event: Event
    ): void {

        const select =
            event.target as HTMLSelectElement;


        if (
            ! select.value
        ) {

            this.categoriaSeleccionada
                .set(
                    null
                );

            return;

        }


        this.categoriaSeleccionada
            .set(
                Number(
                    select.value
                )
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


        this.categoriaSeleccionada
            .set(
                null
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Nombre categoría
    |--------------------------------------------------------------------------
    */

    nombreCategoria(
        producto: Producto
    ): string {

        /*
         * Laravel envió relación.
         */

        if (
            producto.categoria
                ?.nombre
        ) {

            return producto
                .categoria
                .nombre;

        }


        /*
         * Laravel envió solamente id_categoria.
         */

        const idCategoria =
            producto.id_categoria;


        if (
            idCategoria === null
            ||
            idCategoria === undefined
        ) {

            return 'Sin categoría';

        }


        return this.categorias()
            .find(
                categoria =>
                    categoria
                        .id_categoria
                    === idCategoria
            )
            ?.nombre
            ?? 'Sin categoría';

    }


    /*
    |--------------------------------------------------------------------------
    | ID categoría
    |--------------------------------------------------------------------------
    */

    private obtenerIdCategoria(
        producto: Producto
    ): number | null {

        return (
            producto
                .categoria
                ?.id_categoria
            ??
            producto
                .id_categoria
            ??
            null
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Mensajes HTTP
    |--------------------------------------------------------------------------
    */

    private obtenerMensajeError(
        error: HttpErrorResponse
    ): string {

        const mensaje =
            error.error
                ?.message;


        if (
            typeof mensaje === 'string'
            &&
            mensaje.trim()
        ) {

            return mensaje;

        }


        switch (
            error.status
        ) {

            case 0:

                return (
                    'No se pudo conectar con el servidor.'
                );


            case 403:

                return (
                    'No tiene permiso para consultar los productos.'
                );


            case 500:

                return (
                    'Ocurrió un error en el servidor.'
                );


            default:

                return (
                    'No fue posible cargar los productos.'
                );

        }

    }

}