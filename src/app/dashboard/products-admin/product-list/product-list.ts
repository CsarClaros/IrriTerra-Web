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
    RotateCcw,
    Trash2,
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

type FiltroEstado =
    'TODOS'
    | 'A'
    | 'I';


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

    readonly procesandoId =
        signal<
            number | null
        >(
            null
        );


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

    readonly filtroEstado =
        signal<
            FiltroEstado
        >(
            'TODOS'
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

    readonly puedeEliminar =
        computed(
            () =>
                this.sessionService
                    .tienePermiso(
                        'producto.eliminar'
                    )
        );

    readonly puedeGestionar =
        computed(
            () =>
                this.puedeEditar()
                ||
                this.puedeEliminar()
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

                const estado =
                    this.filtroEstado();


                return this.productos()
                    .filter(
                        producto => {

                            /*
 * Filtro estado
 */

                            if (
                                estado !== 'TODOS'
                                &&
                                producto.estado_registro
                                !== estado
                            ) {

                                return false;

                            }

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
                                !texto
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

    readonly totalActivos =
        computed(
            () =>
                this.productos()
                    .filter(
                        producto =>
                            producto
                                .estado_registro
                            === 'A'
                    )
                    .length
        );


    readonly totalInactivos =
        computed(
            () =>
                this.productos()
                    .filter(
                        producto =>
                            producto
                                .estado_registro
                            === 'I'
                    )
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

    readonly RotateCcw =
        RotateCcw;

    readonly Trash2 =
        Trash2;

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
                    .listar(true),

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
            !select.value
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
| Estado
|--------------------------------------------------------------------------
*/

    actualizarEstado(
        event:
            Event
    ): void {

        const select =
            event.target as HTMLSelectElement;


        this.filtroEstado.set(
            select.value as FiltroEstado
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

        this.filtroEstado.set(
            'TODOS'
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

    /*
|--------------------------------------------------------------------------
| Desactivar
|--------------------------------------------------------------------------
*/

    desactivar(
        producto:
            Producto
    ): void {

        if (
            !this.puedeEliminar()
            ||
            this.procesandoId()
            !== null
            ||
            producto.estado_registro
            !== 'A'
        ) {

            return;

        }


        const confirmar =
            window.confirm(

                `¿Desactivar el producto "${producto.nombre}"?\n\n`
                +
                'Dejará de mostrarse en el catálogo público, '
                +
                'pero su información permanecerá almacenada.'

            );


        if (
            !confirmar
        ) {

            return;

        }


        this.procesandoId.set(
            producto.id_producto
        );


        this.errorMensaje.set(
            ''
        );


        this.productoService
            .eliminar(
                producto.id_producto
            )
            .pipe(

                finalize(
                    () => {

                        this.procesandoId
                            .set(
                                null
                            );

                    }
                )

            )
            .subscribe({

                next: response => {

                    window.alert(
                        response.message
                        ||
                        'Producto desactivado correctamente.'
                    );


                    this.cargarDatos();

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
| Reactivar
|--------------------------------------------------------------------------
*/

reactivar(
    producto:
        Producto
): void {

    if (
        !this.puedeEditar()
        ||
        this.procesandoId()
        !== null
        ||
        producto.estado_registro
        !== 'I'
    ) {

        return;

    }


    const confirmar =
        window.confirm(

            `¿Reactivar el producto "${producto.nombre}"?\n\n`
            +
            'Volverá a estar disponible para el catálogo público.'

        );


    if (
        !confirmar
    ) {

        return;

    }


    this.procesandoId.set(
        producto.id_producto
    );


    this.errorMensaje.set(
        ''
    );


    this.productoService
        .reactivar(
            producto.id_producto
        )
        .pipe(

            finalize(
                () => {

                    this.procesandoId
                        .set(
                            null
                        );

                }
            )

        )
        .subscribe({

            next: response => {

                window.alert(
                    response.message
                    ||
                    'Producto reactivado correctamente.'
                );


                this.cargarDatos();

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

}