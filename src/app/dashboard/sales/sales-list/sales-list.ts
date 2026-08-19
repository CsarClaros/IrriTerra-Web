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
    HttpErrorResponse
} from '@angular/common/http';

import {
    finalize,
    forkJoin
} from 'rxjs';

import {
    Banknote,
    CircleAlert,
    Eye,
    FileText,
    RefreshCw,
    Search,
    ShoppingCart,
    X,
    LucideAngularModule,
    Plus,
    Router
} from 'lucide-angular';

import {
    ClienteService
} from '../../../core/services/ventas/cliente.service';

import {
    VentaService
} from '../../../core/services/ventas/venta.service';

import {
    Cliente
} from '../../../shared/models/cliente.model';

import {
    DecimalApi,
    Venta,
    VentaEstado
} from '../../../shared/models/venta.model';

import {
    RouterLink
} from '@angular/router';

import {
    SessionService
} from '../../../core/services/session.service';

import { SaleActions } from "./sale-actions/sale-actions";


@Component({
    selector:
        'app-sales-list',

    imports: [
        CommonModule,
        LucideAngularModule,
        RouterLink,
        SaleActions
    ],

    templateUrl:
        './sales-list.html',

    styleUrl:
        './sales-list.css'
})
export class SalesList
    implements OnInit {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly ventaService =
        inject(
            VentaService
        );


    private readonly clienteService =
        inject(
            ClienteService
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

    readonly ventas =
        signal<
            Venta[]
        >([]);


    readonly clientes =
        signal<
            Cliente[]
        >([]);

    readonly puedeCrearVenta =
        computed(
            () =>
                this.sessionService
                    .tienePermiso(
                        'venta.crear'
                    )
        );
    /*
    |--------------------------------------------------------------------------
    | Estado
    |--------------------------------------------------------------------------
    */

    readonly cargando =
        signal(false);


    readonly errorMensaje =
        signal('');


    readonly ventaSeleccionada =
        signal<
            Venta | null
        >(
            null
        );


    readonly cargandoDetalle =
        signal(false);


    readonly errorDetalle =
        signal('');


    /*
    |--------------------------------------------------------------------------
    | Filtros
    |--------------------------------------------------------------------------
    */

    readonly busqueda =
        signal('');


    readonly estadoSeleccionado =
        signal<
            VentaEstado | ''
        >(
            ''
        );


    /*
    |--------------------------------------------------------------------------
    | Ventas filtradas
    |--------------------------------------------------------------------------
    */

    readonly ventasFiltradas =
        computed(
            () => {

                const texto =
                    this.busqueda()
                        .trim()
                        .toLowerCase();


                const estado =
                    this.estadoSeleccionado();


                return this.ventas()
                    .filter(
                        venta => {

                            /*
                             * Estado.
                             */

                            if (
                                estado
                                &&
                                venta.estado_venta
                                !== estado
                            ) {

                                return false;

                            }


                            /*
                             * Sin búsqueda.
                             */

                            if (
                                !texto
                            ) {

                                return true;

                            }


                            const cliente =
                                this.nombreCliente(
                                    venta
                                );


                            const sucursal =
                                venta
                                    .sucursal
                                    ?.nombre
                                ?? '';


                            const vendedor =
                                this.nombreVendedor(
                                    venta
                                );


                            return [

                                venta.codigo_venta,

                                cliente,

                                sucursal,

                                vendedor,

                                venta.metodo_pago
                                ?? ''

                            ]
                                .some(
                                    value =>
                                        value
                                            .toLowerCase()
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
    | Indicadores
    |--------------------------------------------------------------------------
    */

    readonly totalVentas =
        computed(
            () =>
                this.ventas()
                    .length
        );


    readonly totalBorradores =
        computed(
            () =>
                this.ventas()
                    .filter(
                        venta =>
                            venta.estado_venta
                            === 'BORRADOR'
                    )
                    .length
        );


    readonly totalCompletadas =
        computed(
            () =>
                this.ventas()
                    .filter(
                        venta =>
                            venta.estado_venta
                            === 'COMPLETADA'
                    )
                    .length
        );


    readonly totalAnuladas =
        computed(
            () =>
                this.ventas()
                    .filter(
                        venta =>
                            venta.estado_venta
                            === 'ANULADA'
                    )
                    .length
        );


    readonly montoCompletado =
        computed(
            () =>
                this.ventas()
                    .filter(
                        venta =>
                            venta.estado_venta
                            === 'COMPLETADA'
                    )
                    .reduce(
                        (
                            total,
                            venta
                        ) =>
                            total
                            +
                            this.numero(
                                venta.total
                            ),

                        0
                    )
        );


    /*
    |--------------------------------------------------------------------------
    | Iconos
    |--------------------------------------------------------------------------
    */

    readonly Banknote =
        Banknote;


    readonly CircleAlert =
        CircleAlert;


    readonly Eye =
        Eye;


    readonly FileText =
        FileText;


    readonly RefreshCw =
        RefreshCw;


    readonly Search =
        Search;


    readonly ShoppingCart =
        ShoppingCart;


    readonly X =
        X;

    readonly Plus =
        Plus;
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
    | Cargar
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

            ventas:
                this.ventaService
                    .listar(),

            clientes:
                this.clienteService
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

                    this.ventas.set(
                        response
                            .ventas
                            .data
                        ?? []
                    );


                    this.clientes.set(
                        response
                            .clientes
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
    | Buscar
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
    | Estado
    |--------------------------------------------------------------------------
    */

    actualizarEstado(
        event: Event
    ): void {

        const select =
            event.target as HTMLSelectElement;


        this.estadoSeleccionado.set(
            select.value as VentaEstado | ''
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Limpiar
    |--------------------------------------------------------------------------
    */

    limpiarFiltros(): void {

        this.busqueda.set(
            ''
        );


        this.estadoSeleccionado.set(
            ''
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Cliente
    |--------------------------------------------------------------------------
    */

    nombreCliente(
        venta:
            Venta
    ): string {

        /*
         * Relación cargada.
         */

        if (
            venta.cliente
                ?.nombre_razon_social
        ) {

            return venta
                .cliente
                .nombre_razon_social;

        }


        /*
         * Resolver por ID.
         */

        return this.clientes()
            .find(
                cliente =>
                    cliente.id_cliente
                    ===
                    venta.id_cliente
            )
            ?.nombre_razon_social
            ?? 'Sin cliente';

    }


    /*
    |--------------------------------------------------------------------------
    | Vendedor
    |--------------------------------------------------------------------------
    */

    nombreVendedor(
        venta:
            Venta
    ): string {

        const vendedor =
            venta.vendedor;


        if (
            !vendedor
        ) {

            return '—';

        }


        const nombres = [

            vendedor.nombre,

            vendedor.apellido_paterno,

            vendedor.apellido_materno

        ]
            .filter(
                value =>
                    Boolean(
                        value
                    )
            );


        if (
            nombres.length > 0
        ) {

            return nombres.join(
                ' '
            );

        }


        return vendedor.usuario
            ?? '—';

    }


    /*
    |--------------------------------------------------------------------------
    | Número
    |--------------------------------------------------------------------------
    */

    numero(
        value:
            DecimalApi | null
    ): number {

        const numero =
            Number(
                value
                ?? 0
            );


        return Number.isFinite(
            numero
        )
            ? numero
            : 0;

    }


    /*
    |--------------------------------------------------------------------------
    | Ver detalle
    |--------------------------------------------------------------------------
    */

    verDetalle(
        venta:
            Venta
    ): void {

        if (
            this.cargandoDetalle()
        ) {

            return;

        }


        /*
         * Mostramos inicialmente la información
         * que ya tenemos.
         */

        this.ventaSeleccionada.set(
            venta
        );


        this.cargandoDetalle.set(
            true
        );


        this.errorDetalle.set(
            ''
        );


        /*
         * Consultamos show para obtener relaciones
         * completas, especialmente detalles.
         */

        this.ventaService
            .obtener(
                venta.id_venta
            )
            .pipe(

                finalize(
                    () => {

                        this.cargandoDetalle.set(
                            false
                        );

                    }
                )

            )
            .subscribe({

                next: response => {

                    this.ventaSeleccionada.set(
                        response.data
                    );

                },


                error: (
                    error:
                        HttpErrorResponse
                ) => {

                    this.errorDetalle.set(
                        this.obtenerMensajeError(
                            error
                        )
                    );

                }

            });

    }


    /*
    |--------------------------------------------------------------------------
    | Cerrar detalle
    |--------------------------------------------------------------------------
    */

    cerrarDetalle(): void {

        if (
            this.cargandoDetalle()
        ) {

            return;

        }


        this.ventaSeleccionada.set(
            null
        );


        this.errorDetalle.set(
            ''
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Mensaje error
    |--------------------------------------------------------------------------
    */

    private obtenerMensajeError(
        error:
            HttpErrorResponse
    ): string {

        const mensaje =
            error.error
                ?.message;


        if (
            typeof mensaje
            === 'string'
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
                    'No tiene permiso para consultar ventas.'
                );


            case 404:

                return (
                    'La venta solicitada no existe.'
                );


            default:

                return (
                    'No fue posible cargar la información de ventas.'
                );

        }

    }

    ventaActualizada(
        venta:
            Venta
    ): void {
    
        /*
        |--------------------------------------------------------------------------
        | Actualizar listado
        |--------------------------------------------------------------------------
        */
    
        this.ventas.update(
            ventas =>
                ventas.map(
                    item =>
                        item.id_venta
                        === venta.id_venta
    
                            ? venta
                            : item
                )
        );
    
    
        /*
        |--------------------------------------------------------------------------
        | Actualizar modal
        |--------------------------------------------------------------------------
        */
    
        this.ventaSeleccionada.set(
            venta
        );
    
    }
}