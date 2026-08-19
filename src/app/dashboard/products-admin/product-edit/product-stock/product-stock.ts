import {
    Component,
    OnInit,
    computed,
    inject,
    input,
    signal
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    FormsModule
} from '@angular/forms';

import {
    HttpErrorResponse
} from '@angular/common/http';

import {
    finalize,
    forkJoin
} from 'rxjs';

import {
    Boxes,
    Building2,
    CircleAlert,
    Pencil,
    RefreshCw,
    Save,
    TriangleAlert,
    X,
    LucideAngularModule
} from 'lucide-angular';

import {
    ProductoVarianteService
} from '../../../../core/services/catalogos/producto-variante.service';

import {
    StockSucursalService
} from '../../../../core/services/catalogos/stock-sucursal.service';

import {
    SucursalService
} from '../../../../core/services/organizacion/sucursal.service';

import {
    SessionService
} from '../../../../core/services/session.service';

import {
    ProductoVariante
} from '../../../../shared/models/producto-variante.model';

import {
    StockSucursal,
    StockSucursalRequest
} from '../../../../shared/models/stock-sucursal.model';

import {
    Sucursal
} from '../../../../shared/models/sucursal.model';


@Component({
    selector: 'app-product-stock',

    imports: [
        CommonModule,
        FormsModule,
        LucideAngularModule
    ],

    templateUrl:
        './product-stock.html',

    styleUrl:
        './product-stock.css'
})
export class ProductStock
    implements OnInit {

    /*
    |--------------------------------------------------------------------------
    | Producto
    |--------------------------------------------------------------------------
    */

    readonly idProducto =
        input.required<number>();


    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly varianteService =
        inject(
            ProductoVarianteService
        );


    private readonly stockService =
        inject(
            StockSucursalService
        );


    private readonly sucursalService =
        inject(
            SucursalService
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

    readonly variantes =
        signal<
            ProductoVariante[]
        >([]);


    readonly stocks =
        signal<
            StockSucursal[]
        >([]);


    readonly sucursales =
        signal<
            Sucursal[]
        >([]);


    /*
    |--------------------------------------------------------------------------
    | Variante seleccionada
    |--------------------------------------------------------------------------
    */

    readonly idVarianteSeleccionada =
        signal<number | null>(
            null
        );


    readonly varianteSeleccionada =
        computed(
            () => {

                const id =
                    this.idVarianteSeleccionada();


                if (
                    id === null
                ) {

                    return null;

                }


                return this.variantes()
                    .find(
                        variante =>
                            variante
                                .id_producto_variante
                            === id
                    )
                    ?? null;

            }
        );


    /*
    |--------------------------------------------------------------------------
    | Sesión
    |--------------------------------------------------------------------------
    */

    readonly idSucursalUsuario =
        computed(
            () =>
                this.sessionService
                    .sucursal()
                    ?.id_sucursal
                ?? null
        );


    /*
    |--------------------------------------------------------------------------
    | Estado
    |--------------------------------------------------------------------------
    */

    readonly cargando =
        signal(false);


    readonly guardando =
        signal(false);


    readonly errorMensaje =
        signal('');


    /*
    |--------------------------------------------------------------------------
    | Configuración
    |--------------------------------------------------------------------------
    */

    readonly mostrarFormulario =
        signal(false);


    readonly sucursalConfigurando =
        signal<
            Sucursal | null
        >(
            null
        );


    readonly idStockEditando =
        signal<number | null>(
            null
        );


    readonly erroresCampos =
        signal<
            Record<string, string>
        >({});


    formData = {

        stock_minimo:
            0,

        stock_maximo:
            0

    };


    /*
    |--------------------------------------------------------------------------
    | Iconos
    |--------------------------------------------------------------------------
    */

    readonly Boxes =
        Boxes;


    readonly Building2 =
        Building2;


    readonly CircleAlert =
        CircleAlert;


    readonly Pencil =
        Pencil;


    readonly RefreshCw =
        RefreshCw;


    readonly Save =
        Save;


    readonly TriangleAlert =
        TriangleAlert;


    readonly X =
        X;


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

            variantes:
                this.varianteService
                    .listar(),

            stocks:
                this.stockService
                    .listar(),

            sucursales:
                this.sucursalService
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

                    /*
                    |--------------------------------------------------------------------------
                    | Variantes del producto
                    |--------------------------------------------------------------------------
                    */

                    const variantes =
                        (
                            response
                                .variantes
                                .data
                            ?? []
                        )
                            .filter(
                                variante =>
                                    this.obtenerIdProducto(
                                        variante
                                    )
                                    ===
                                    this.idProducto()
                            );


                    this.variantes.set(
                        variantes
                    );


                    /*
                    |--------------------------------------------------------------------------
                    | IDs
                    |--------------------------------------------------------------------------
                    */

                    const idsVariantes =
                        new Set(
                            variantes.map(
                                variante =>
                                    variante
                                        .id_producto_variante
                            )
                        );


                    /*
                    |--------------------------------------------------------------------------
                    | Stock
                    |--------------------------------------------------------------------------
                    */

                    this.stocks.set(

                        (
                            response
                                .stocks
                                .data
                            ?? []
                        )
                            .filter(
                                stock => {

                                    const idVariante =
                                        this.obtenerIdVarianteStock(
                                            stock
                                        );


                                    return (
                                        idVariante !== null
                                        &&
                                        idsVariantes.has(
                                            idVariante
                                        )
                                    );

                                }
                            )

                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Sucursales
                    |--------------------------------------------------------------------------
                    */

                    this.sucursales.set(
                        response
                            .sucursales
                            .data
                        ?? []
                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Selección inicial
                    |--------------------------------------------------------------------------
                    */

                    const seleccionActual =
                        this.idVarianteSeleccionada();


                    const seleccionValida =
                        seleccionActual
                        !== null
                        &&
                        idsVariantes.has(
                            seleccionActual
                        );


                    if (
                        !seleccionValida
                    ) {

                        this.idVarianteSeleccionada
                            .set(
                                variantes[0]
                                    ?.id_producto_variante
                                ?? null
                            );

                    }

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
    | Seleccionar variante
    |--------------------------------------------------------------------------
    */

    seleccionarVariante(
        event: Event
    ): void {

        const select =
            event.target as HTMLSelectElement;


        const id =
            Number(
                select.value
            );


        this.idVarianteSeleccionada
            .set(
                Number.isFinite(
                    id
                )
                    ? id
                    : null
            );


        this.cerrarFormulario();

    }


    /*
    |--------------------------------------------------------------------------
    | Stock por sucursal
    |--------------------------------------------------------------------------
    */

    stockDeSucursal(
        sucursal:
            Sucursal
    ): StockSucursal | null {

        const idVariante =
            this.idVarianteSeleccionada();


        if (
            idVariante === null
        ) {

            return null;

        }


        return this.stocks()
            .find(
                stock =>
                    this.obtenerIdVarianteStock(
                        stock
                    )
                    === idVariante
                    &&
                    this.obtenerIdSucursalStock(
                        stock
                    )
                    ===
                    sucursal.id_sucursal
            )
            ?? null;

    }


    /*
    |--------------------------------------------------------------------------
    | Estado de stock
    |--------------------------------------------------------------------------
    */

    estadoStock(
        stock:
            StockSucursal | null
    ):
        'sin-configurar'
        |
        'agotado'
        |
        'bajo'
        |
        'normal'
        |
        'alto' {

        if (
            !stock
        ) {

            return 'sin-configurar';

        }


        const actual =
            Number(
                stock.stock_actual
            );


        const minimo =
            Number(
                stock.stock_minimo
            );


        const maximo =
            Number(
                stock.stock_maximo
            );


        if (
            actual <= 0
        ) {

            return 'agotado';

        }


        if (
            actual <= minimo
        ) {

            return 'bajo';

        }


        if (
            maximo > 0
            &&
            actual > maximo
        ) {

            return 'alto';

        }


        return 'normal';

    }


    /*
    |--------------------------------------------------------------------------
    | Configurar
    |--------------------------------------------------------------------------
    */

    configurar(
        sucursal:
            Sucursal
    ): void {

        const stock =
            this.stockDeSucursal(
                sucursal
            );


        this.sucursalConfigurando
            .set(
                sucursal
            );


        this.idStockEditando
            .set(
                stock
                    ?.id_stock_sucursal
                ?? null
            );


        this.formData = {

            stock_minimo:
                Number(
                    stock
                        ?.stock_minimo
                    ?? 0
                ),

            stock_maximo:
                Number(
                    stock
                        ?.stock_maximo
                    ?? 0
                )

        };


        this.erroresCampos.set(
            {}
        );


        this.errorMensaje.set(
            ''
        );


        this.mostrarFormulario
            .set(
                true
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Cerrar
    |--------------------------------------------------------------------------
    */

    cerrarFormulario(forzar = false): void {
        if (this.guardando() && !forzar) {
            return;
        }
    
        this.mostrarFormulario.set(false);
        this.sucursalConfigurando.set(null);
        this.idStockEditando.set(null);
    
        this.formData = {
            stock_minimo: 0,
            stock_maximo: 0,
        };
    
        this.erroresCampos.set({});
    }


    /*
    |--------------------------------------------------------------------------
    | Guardar
    |--------------------------------------------------------------------------
    */

    guardar(): void {

        if (
            this.guardando()
        ) {

            return;

        }


        const variante =
            this.varianteSeleccionada();


        const sucursal =
            this.sucursalConfigurando();


        if (
            !variante
            ||
            !sucursal
        ) {

            return;

        }


        this.erroresCampos.set(
            {}
        );


        this.errorMensaje.set(
            ''
        );


        const minimo =
            Number(
                this.formData
                    .stock_minimo
            );


        const maximo =
            Number(
                this.formData
                    .stock_maximo
            );


        /*
        |--------------------------------------------------------------------------
        | Validaciones
        |--------------------------------------------------------------------------
        */

        if (
            !Number.isFinite(
                minimo
            )
            ||
            minimo < 0
        ) {

            this.agregarErrorCampo(
                'stock_minimo',
                'El stock mínimo no puede ser negativo.'
            );

        }


        if (
            !Number.isFinite(
                maximo
            )
            ||
            maximo < 0
        ) {

            this.agregarErrorCampo(
                'stock_maximo',
                'El stock máximo no puede ser negativo.'
            );

        }


        if (
            minimo >= 0
            &&
            maximo >= 0
            &&
            maximo < minimo
        ) {

            this.agregarErrorCampo(
                'stock_maximo',
                'El stock máximo no puede ser menor al stock mínimo.'
            );

        }


        if (
            Object.keys(
                this.erroresCampos()
            ).length > 0
        ) {

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Payload
        |--------------------------------------------------------------------------
        |
        | NO incluye stock_actual.
        |
        */

        const data:
            StockSucursalRequest = {

            id_producto_variante:
                variante
                    .id_producto_variante,

            id_sucursal:
                sucursal
                    .id_sucursal,

            stock_minimo:
                minimo,

            stock_maximo:
                maximo,

            estado_registro:
                'A'

        };


        /*
        |--------------------------------------------------------------------------
        | Crear / actualizar
        |--------------------------------------------------------------------------
        */

        const idStock =
            this.idStockEditando();


        const request$ =
            idStock === null

                ? this.stockService
                    .crear(
                        data
                    )

                : this.stockService
                    .actualizar(
                        idStock,
                        data
                    );


        this.guardando.set(
            true
        );


        request$
            .pipe(

                finalize(
                    () => {

                        this.guardando.set(
                            false
                        );

                    }
                )

            )
            .subscribe({

                next: () => {

                    this.cerrarFormulario(true);

                    this.cargarDatos();

                },


                error: (
                    error:
                        HttpErrorResponse
                ) => {

                    this.procesarError(
                        error
                    );

                }

            });

    }


    /*
    |--------------------------------------------------------------------------
    | Campos
    |--------------------------------------------------------------------------
    */

    errorCampo(
        campo: string
    ): string | null {

        return this.erroresCampos()[
            campo
        ] ?? null;

    }


    /*
    |--------------------------------------------------------------------------
    | Relaciones
    |--------------------------------------------------------------------------
    */

    private obtenerIdProducto(
        variante:
            ProductoVariante
    ): number | null {

        return (
            variante.id_producto
            ??
            variante
                .producto
                ?.id_producto
            ??
            null
        );

    }


    private obtenerIdVarianteStock(
        stock:
            StockSucursal
    ): number | null {

        return (
            stock.id_producto_variante
            ??
            stock
                .producto_variante
                ?.id_producto_variante
            ??
            stock
                .variante
                ?.id_producto_variante
            ??
            null
        );

    }


    private obtenerIdSucursalStock(
        stock:
            StockSucursal
    ): number | null {

        return (
            stock.id_sucursal
            ??
            stock
                .sucursal
                ?.id_sucursal
            ??
            null
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error API
    |--------------------------------------------------------------------------
    */

    private procesarError(
        error:
            HttpErrorResponse
    ): void {

        if (
            error.status === 422
            &&
            error.error
                ?.errors
            &&
            typeof error.error
                .errors
            === 'object'
        ) {

            const errores:
                Record<string, string> =
                {};


            Object.entries(
                error.error.errors
            )
                .forEach(
                    (
                        [
                            campo,
                            mensajes
                        ]
                    ) => {

                        if (
                            Array.isArray(
                                mensajes
                            )
                            &&
                            mensajes.length > 0
                        ) {

                            errores[campo] =
                                String(
                                    mensajes[0]
                                );

                        }

                    }
                );


            this.erroresCampos.set(
                errores
            );


            this.errorMensaje.set(
                'Revise los campos marcados.'
            );


            return;

        }


        this.errorMensaje.set(
            this.obtenerMensajeError(
                error
            )
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Mensajes
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
                    'No tiene permiso para administrar el inventario.'
                );


            case 404:

                return (
                    'El registro solicitado no existe.'
                );


            case 422:

                return (
                    'Verifique la configuración ingresada.'
                );


            default:

                return (
                    'No fue posible procesar la configuración de stock.'
                );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Helper
    |--------------------------------------------------------------------------
    */

    private agregarErrorCampo(
        campo: string,
        mensaje: string
    ): void {

        this.erroresCampos.update(
            errores => ({

                ...errores,

                [campo]:
                    mensaje

            })
        );

    }

}