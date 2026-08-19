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
    FormsModule
} from '@angular/forms';

import {
    HttpErrorResponse
} from '@angular/common/http';

import {
    ActivatedRoute,
    Router
} from '@angular/router';

import {
    finalize,
    forkJoin,
    Observable
} from 'rxjs';

import {
    ArrowRight,
    ArrowRightLeft,
    PackagePlus,
    Save,
    Trash2,
    Warehouse,
    LucideAngularModule
} from 'lucide-angular';

import {
    SessionService
} from '../../../core/services/session.service';

import {
    SucursalService
} from '../../../core/services/organizacion/sucursal.service';

import {
    ProductoVarianteService
} from '../../../core/services/inventario/producto-variante.service';

import {
    StockSucursalService
} from '../../../core/services/inventario/stock-sucursal.service';

import {
    TransferenciaInventarioService
} from '../../../core/services/transferencias/transferencia-inventario.service';

import {
    Sucursal
} from '../../../shared/models/sucursal.model';

import {
    ProductoVariante
} from '../../../shared/models/producto-variante.model';

import {
    StockSucursal
} from '../../../shared/models/stock-sucursal.model';

import {
    TransferenciaInventario,
    TransferenciaInventarioActualizarRequest,
    TransferenciaInventarioCrearRequest
} from '../../../shared/models/transferencia-inventario.model';


/*
|--------------------------------------------------------------------------
| Línea del formulario
|--------------------------------------------------------------------------
*/

interface LineaTransferencia {

    id_producto_variante:
    number;

    producto:
    string;

    variante:
    string;

    sku:
    string;

    unidad_medida:
    string;

    cantidad:
    number;

    stock_disponible:
    number;

    observaciones:
    string;

}


@Component({
    selector:
        'app-transfer-create',

    standalone:
        true,

    imports: [
        CommonModule,
        FormsModule,
        LucideAngularModule
    ],

    templateUrl:
        './transfer-create.html',

    styleUrl:
        './transfer-create.css'
})
export class TransferCreate
    implements OnInit {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly sessionService =
        inject(
            SessionService
        );


    private readonly sucursalService =
        inject(
            SucursalService
        );


    private readonly varianteService =
        inject(
            ProductoVarianteService
        );


    private readonly stockService =
        inject(
            StockSucursalService
        );


    private readonly transferenciaService =
        inject(
            TransferenciaInventarioService
        );


    private readonly router =
        inject(
            Router
        );

    private readonly route =
        inject(
            ActivatedRoute
        );

    /*
    |--------------------------------------------------------------------------
    | Catálogos
    |--------------------------------------------------------------------------
    */

    readonly sucursales =
        signal<
            Sucursal[]
        >([]);


    readonly variantes =
        signal<
            ProductoVariante[]
        >([]);


    readonly stocks =
        signal<
            StockSucursal[]
        >([]);


    /*
    |--------------------------------------------------------------------------
    | Formulario
    |--------------------------------------------------------------------------
    */

    readonly idSucursalOrigen =
        signal<
            number | null
        >(null);


    readonly idSucursalDestino =
        signal<
            number | null
        >(null);


    readonly idVarianteSeleccionada =
        signal<
            number | null
        >(null);


    observacionesTransferencia =
        '';


    readonly lineas =
        signal<
            LineaTransferencia[]
        >([]);


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
| Modo edición
|--------------------------------------------------------------------------
*/

    readonly modoEdicion =
        signal(false);


    readonly idTransferencia =
        signal<
            number | null
        >(null);


    readonly codigoTransferencia =
        signal('');

    /*
    |--------------------------------------------------------------------------
    | Usuario
    |--------------------------------------------------------------------------
    */

    readonly usuario =
        computed(
            () =>
                this.sessionService
                    .usuario()
        );


    /*
    |--------------------------------------------------------------------------
    | Sucursal origen
    |--------------------------------------------------------------------------
    */

    readonly sucursalOrigen =
        computed(
            () => {

                const id =
                    this.idSucursalOrigen();


                if (
                    id === null
                ) {

                    return null;

                }


                return this.sucursales()
                    .find(
                        sucursal =>
                            sucursal.id_sucursal
                            === id
                    )
                    ?? null;

            }
        );


    /*
    |--------------------------------------------------------------------------
    | Sucursales destino
    |--------------------------------------------------------------------------
    */

    readonly sucursalesDestino =
        computed(
            () => {

                const origen =
                    this.idSucursalOrigen();


                return this.sucursales()
                    .filter(
                        sucursal =>
                            sucursal.id_sucursal
                            !== origen
                    );

            }
        );


    /*
    |--------------------------------------------------------------------------
    | Variantes disponibles
    |--------------------------------------------------------------------------
    */

    readonly variantesDisponibles =
        computed(
            () => {

                const idSucursal =
                    this.idSucursalOrigen();


                if (
                    idSucursal === null
                ) {

                    return [];

                }


                const idsAgregados =
                    new Set(
                        this.lineas()
                            .map(
                                linea =>
                                    linea.id_producto_variante
                            )
                    );


                return this.variantes()
                    .filter(
                        variante => {

                            if (
                                idsAgregados.has(
                                    variante.id_producto_variante
                                )
                            ) {

                                return false;

                            }


                            const stock =
                                this.stockDeVariante(
                                    variante.id_producto_variante
                                );


                            return (
                                stock !== null
                                &&
                                this.numero(
                                    stock.stock_actual
                                ) > 0
                            );

                        }
                    );

            }
        );


    /*
    |--------------------------------------------------------------------------
    | Variante seleccionada
    |--------------------------------------------------------------------------
    */

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
                            variante.id_producto_variante
                            === id
                    )
                    ?? null;

            }
        );


    /*
    |--------------------------------------------------------------------------
    | Stock seleccionado
    |--------------------------------------------------------------------------
    */

    readonly stockSeleccionado =
        computed(
            () => {

                const variante =
                    this.varianteSeleccionada();


                if (
                    !variante
                ) {

                    return null;

                }


                return this.stockDeVariante(
                    variante.id_producto_variante
                );

            }
        );


    /*
    |--------------------------------------------------------------------------
    | Total unidades
    |--------------------------------------------------------------------------
    */

    readonly cantidadTotal =
        computed(
            () =>
                this.lineas()
                    .reduce(
                        (
                            total,
                            linea
                        ) =>
                            total
                            +
                            this.numero(
                                linea.cantidad
                            ),
                        0
                    )
        );


    /*
    |--------------------------------------------------------------------------
    | Iconos
    |--------------------------------------------------------------------------
    */

    readonly ArrowRight =
        ArrowRight;


    readonly ArrowRightLeft =
        ArrowRightLeft;


    readonly PackagePlus =
        PackagePlus;


    readonly Save =
        Save;


    readonly Trash2 =
        Trash2;


    readonly Warehouse =
        Warehouse;


    /*
    |--------------------------------------------------------------------------
    | Inicio
    |--------------------------------------------------------------------------
    */

    ngOnInit(): void {

        /*
        |--------------------------------------------------------------------------
        | Detectar edición
        |--------------------------------------------------------------------------
        */

        const parametroId =
            this.route
                .snapshot
                .paramMap
                .get(
                    'id'
                );


        if (
            parametroId
        ) {

            const id =
                Number(
                    parametroId
                );


            if (
                Number.isInteger(
                    id
                )
                &&
                id > 0
            ) {

                this.modoEdicion.set(
                    true
                );


                this.idTransferencia.set(
                    id
                );

            }

        }


        /*
        |--------------------------------------------------------------------------
        | Cargar información
        |--------------------------------------------------------------------------
        */

        this.cargarDatos();

    }


    /*
    |--------------------------------------------------------------------------
    | Cargar catálogos
    |--------------------------------------------------------------------------
    */

    /*
|--------------------------------------------------------------------------
| Cargar catálogos
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

            sucursales:
                this.sucursalService
                    .listar(),

            variantes:
                this.varianteService
                    .listar(),

            stocks:
                this.stockService
                    .listar()

        })
            .subscribe({

                next: response => {

                    /*
                    |--------------------------------------------------------------------------
                    | Sucursales
                    |--------------------------------------------------------------------------
                    */

                    this.sucursales.set(

                        (
                            response
                                .sucursales
                                .data
                            ?? []
                        )
                            .filter(
                                sucursal =>
                                    sucursal.estado_registro
                                    === 'A'
                            )

                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Variantes
                    |--------------------------------------------------------------------------
                    */

                    this.variantes.set(

                        (
                            response
                                .variantes
                                .data
                            ?? []
                        )
                            .filter(
                                variante =>
                                    variante.estado_registro
                                    === 'A'
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
                                stock =>
                                    stock.estado_registro
                                    === 'A'
                            )

                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Modo edición
                    |--------------------------------------------------------------------------
                    */

                    const id =
                        this.idTransferencia();


                    if (
                        this.modoEdicion()
                        &&
                        id !== null
                    ) {

                        this.cargarTransferencia(
                            id
                        );

                        return;

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Modo creación
                    |--------------------------------------------------------------------------
                    */

                    const usuario =
                        this.usuario();


                    const idSucursalUsuario =
                        usuario
                            ?.sucursal
                            ?.id_sucursal
                        ?? null;


                    if (
                        idSucursalUsuario
                        !== null
                    ) {

                        const existe =
                            this.sucursales()
                                .some(
                                    sucursal =>
                                        sucursal.id_sucursal
                                        === idSucursalUsuario
                                );


                        if (
                            existe
                        ) {

                            this.idSucursalOrigen.set(
                                idSucursalUsuario
                            );

                        }

                    }


                    this.cargando.set(
                        false
                    );

                },


                error: (
                    error:
                        HttpErrorResponse
                ) => {

                    this.cargando.set(
                        false
                    );


                    this.errorMensaje.set(
                        this.mensajeError(
                            error
                        )
                    );

                }

            });

    }

    /*
|--------------------------------------------------------------------------
| Cargar transferencia para edición
|--------------------------------------------------------------------------
*/

    private cargarTransferencia(
        id:
            number
    ): void {

        this.transferenciaService
            .obtener(
                id
            )
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

                    const transferencia =
                        response.data;


                    /*
                    |--------------------------------------------------------------------------
                    | Validar estado
                    |--------------------------------------------------------------------------
                    */

                    if (
                        transferencia
                            .estado_transferencia
                        !== 'PENDIENTE'
                    ) {

                        this.errorMensaje.set(
                            'Solo pueden editarse transferencias pendientes.'
                        );

                        return;

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Cabecera
                    |--------------------------------------------------------------------------
                    */

                    this.codigoTransferencia.set(
                        transferencia
                            .codigo_transferencia
                    );


                    this.idSucursalOrigen.set(
                        transferencia
                            .id_sucursal_origen
                    );


                    this.idSucursalDestino.set(
                        transferencia
                            .id_sucursal_destino
                    );


                    this.observacionesTransferencia =
                        transferencia
                            .observaciones
                        ?? '';


                    /*
                    |--------------------------------------------------------------------------
                    | Detalles
                    |--------------------------------------------------------------------------
                    */

                    const lineas:
                        LineaTransferencia[] =

                        (
                            transferencia
                                .detalles
                            ?? []
                        )
                            .map(
                                detalle => {

                                    const variante =
                                        detalle
                                            .producto_variante
                                        ??
                                        this.variantes()
                                            .find(
                                                item =>
                                                    item.id_producto_variante
                                                    === detalle.id_producto_variante
                                            )
                                        ??
                                        null;


                                    const stock =
                                        this.stockDeVariante(
                                            detalle
                                                .id_producto_variante
                                        );


                                    return {

                                        id_producto_variante:
                                            detalle
                                                .id_producto_variante,

                                        producto:
                                            variante
                                                ?.producto
                                                ?.nombre
                                            ?? 'Producto',

                                        variante:
                                            variante
                                                ?.nombre
                                            ?? `Variante #${detalle.id_producto_variante}`,

                                        sku:
                                            variante
                                                ?.sku
                                            ?? '—',

                                        unidad_medida:
                                            variante
                                                ?.unidad_medida
                                            ?? '',

                                        cantidad:
                                            this.numero(
                                                detalle.cantidad
                                            ),

                                        stock_disponible:
                                            this.numero(
                                                stock
                                                    ?.stock_actual
                                            ),

                                        observaciones:
                                            detalle
                                                .observaciones
                                            ?? ''

                                    };

                                }
                            );


                    this.lineas.set(
                        lineas
                    );

                },


                error: (
                    error:
                        HttpErrorResponse
                ) => {

                    this.errorMensaje.set(
                        this.mensajeError(
                            error
                        )
                    );

                }

            });

    }


    /*
    |--------------------------------------------------------------------------
    | Cambiar sucursal origen
    |--------------------------------------------------------------------------
    */

    cambiarSucursalOrigen(
        id:
            number | null
    ): void {

        if (
            this.idSucursalOrigen()
            === id
        ) {

            return;

        }


        this.idSucursalOrigen.set(
            id
        );


        /*
         * Cambiar el origen cambia completamente
         * el stock disponible de las líneas.
         */

        this.lineas.set(
            []
        );


        this.idVarianteSeleccionada.set(
            null
        );


        /*
         * El destino nunca puede ser igual al origen.
         */

        if (
            id !== null
            &&
            this.idSucursalDestino()
            === id
        ) {

            this.idSucursalDestino.set(
                null
            );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Cambiar destino
    |--------------------------------------------------------------------------
    */

    cambiarSucursalDestino(
        id:
            number | null
    ): void {

        this.idSucursalDestino.set(
            id
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Seleccionar variante
    |--------------------------------------------------------------------------
    */

    seleccionarVariante(
        id:
            number | null
    ): void {

        this.idVarianteSeleccionada.set(
            id
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Stock
    |--------------------------------------------------------------------------
    */

    stockDeVariante(
        idVariante:
            number
    ): StockSucursal | null {

        const idSucursal =
            this.idSucursalOrigen();


        if (
            idSucursal === null
        ) {

            return null;

        }


        return this.stocks()
            .find(
                stock =>
                    stock.id_sucursal
                    === idSucursal
                    &&
                    stock.id_producto_variante
                    === idVariante
            )
            ?? null;

    }


    /*
    |--------------------------------------------------------------------------
    | Agregar producto
    |--------------------------------------------------------------------------
    */

    agregarProducto(): void {

        this.errorMensaje.set(
            ''
        );


        const variante =
            this.varianteSeleccionada();


        if (
            !variante
        ) {

            this.errorMensaje.set(
                'Seleccione un producto o variante.'
            );

            return;

        }


        const stock =
            this.stockDeVariante(
                variante.id_producto_variante
            );


        if (
            !stock
        ) {

            this.errorMensaje.set(
                'La variante no posee stock activo en la sucursal de origen.'
            );

            return;

        }


        const disponible =
            this.numero(
                stock.stock_actual
            );


        if (
            disponible <= 0
        ) {

            this.errorMensaje.set(
                'La variante seleccionada no tiene stock disponible.'
            );

            return;

        }


        const existe =
            this.lineas()
                .some(
                    linea =>
                        linea.id_producto_variante
                        === variante.id_producto_variante
                );


        if (
            existe
        ) {

            this.errorMensaje.set(
                'La variante ya fue agregada a la transferencia.'
            );

            return;

        }


        /*
         * Si el stock es menor a 1,
         * usamos todo el disponible como cantidad inicial.
         */

        const cantidadInicial =
            Math.min(
                1,
                disponible
            );


        const nuevaLinea:
            LineaTransferencia = {

            id_producto_variante:
                variante.id_producto_variante,

            producto:
                variante.producto
                    ?.nombre
                ?? 'Producto',

            variante:
                variante.nombre,

            sku:
                variante.sku,

            unidad_medida:
                variante.unidad_medida,

            cantidad:
                cantidadInicial,

            stock_disponible:
                disponible,

            observaciones:
                ''

        };


        this.lineas.update(
            lineas => [

                ...lineas,

                nuevaLinea

            ]
        );


        this.idVarianteSeleccionada.set(
            null
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Actualizar cantidad
    |--------------------------------------------------------------------------
    */

    actualizarCantidad(
        indice:
            number,

        value:
            number | string
    ): void {

        const cantidad =
            this.numero(
                value
            );


        this.lineas.update(
            lineas =>
                lineas.map(
                    (
                        linea,
                        index
                    ) =>

                        index === indice

                            ? {
                                ...linea,
                                cantidad
                            }

                            : linea
                )
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Actualizar observación
    |--------------------------------------------------------------------------
    */

    actualizarObservacion(
        indice:
            number,

        value:
            string
    ): void {

        this.lineas.update(
            lineas =>
                lineas.map(
                    (
                        linea,
                        index
                    ) =>

                        index === indice

                            ? {
                                ...linea,
                                observaciones:
                                    value
                            }

                            : linea
                )
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Eliminar producto
    |--------------------------------------------------------------------------
    */

    eliminarProducto(
        indice:
            number
    ): void {

        this.lineas.update(
            lineas =>
                lineas.filter(
                    (
                        _,
                        index
                    ) =>
                        index !== indice
                )
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error línea
    |--------------------------------------------------------------------------
    */

    errorLinea(
        linea:
            LineaTransferencia
    ): string | null {

        const cantidad =
            this.numero(
                linea.cantidad
            );


        if (
            cantidad <= 0
        ) {

            return (
                'La cantidad debe ser mayor que cero.'
            );

        }


        if (
            cantidad
            >
            linea.stock_disponible
        ) {

            return (
                `Stock disponible: ${linea.stock_disponible}`
            );

        }


        /*
         * Máximo tres decimales.
         */

        const decimales =
            String(
                cantidad
            )
                .split(
                    '.'
                )[1]
                ?.length
            ?? 0;


        if (
            decimales > 3
        ) {

            return (
                'La cantidad admite máximo 3 decimales.'
            );

        }


        return null;

    }


    /*
    |--------------------------------------------------------------------------
    | Guardar transferencia
    |--------------------------------------------------------------------------
    */

    guardarTransferencia(): void {

        if (
            this.guardando()
        ) {

            return;

        }


        this.errorMensaje.set(
            ''
        );


        /*
        |--------------------------------------------------------------------------
        | Usuario
        |--------------------------------------------------------------------------
        */

        const usuario =
            this.usuario();


        if (
            !usuario
        ) {

            this.errorMensaje.set(
                'No fue posible identificar al usuario autenticado.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Origen
        |--------------------------------------------------------------------------
        */

        const idOrigen =
            this.idSucursalOrigen();


        if (
            idOrigen === null
        ) {

            this.errorMensaje.set(
                'Seleccione la sucursal de origen.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Destino
        |--------------------------------------------------------------------------
        */

        const idDestino =
            this.idSucursalDestino();


        if (
            idDestino === null
        ) {

            this.errorMensaje.set(
                'Seleccione la sucursal de destino.'
            );

            return;

        }


        if (
            idOrigen
            === idDestino
        ) {

            this.errorMensaje.set(
                'La sucursal destino debe ser diferente de la sucursal origen.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Productos
        |--------------------------------------------------------------------------
        */

        if (
            this.lineas().length
            === 0
        ) {

            this.errorMensaje.set(
                'Agregue al menos un producto a la transferencia.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Validación de líneas
        |--------------------------------------------------------------------------
        */

        const error =
            this.lineas()
                .map(
                    linea =>
                        this.errorLinea(
                            linea
                        )
                )
                .find(
                    mensaje =>
                        mensaje !== null
                );


        if (
            error
        ) {

            this.errorMensaje.set(
                error
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Payload
        |--------------------------------------------------------------------------
        */

        /*
|--------------------------------------------------------------------------
| Detalles
|--------------------------------------------------------------------------
*/

        const detalles =
            this.lineas()
                .map(
                    linea => ({

                        id_producto_variante:
                            linea.id_producto_variante,

                        cantidad:
                            this.numero(
                                linea.cantidad
                            ),

                        observaciones:
                            linea.observaciones
                                .trim()
                            || null

                    })
                );


        /*
        |--------------------------------------------------------------------------
        | Crear petición
        |--------------------------------------------------------------------------
        */

        let request$:
            Observable<
                TransferenciaInventario
            >;


        /*
        |--------------------------------------------------------------------------
        | Editar
        |--------------------------------------------------------------------------
        */

        if (
            this.modoEdicion()
        ) {

            const id =
                this.idTransferencia();


            if (
                id === null
            ) {

                this.errorMensaje.set(
                    'No fue posible identificar la transferencia.'
                );

                return;

            }


            const data:
                TransferenciaInventarioActualizarRequest = {

                id_sucursal_origen:
                    idOrigen,

                id_sucursal_destino:
                    idDestino,

                observaciones:
                    this.observacionesTransferencia
                        .trim()
                    || null,

                usuario_modificacion:
                    usuario.id_usuario,

                detalles

            };


            request$ =
                this.transferenciaService
                    .actualizar(
                        id,
                        data
                    );

        }


        /*
        |--------------------------------------------------------------------------
        | Crear
        |--------------------------------------------------------------------------
        */

        else {

            const data:
                TransferenciaInventarioCrearRequest = {

                id_sucursal_origen:
                    idOrigen,

                id_sucursal_destino:
                    idDestino,

                id_usuario_solicitud:
                    usuario.id_usuario,

                usuario_creacion:
                    usuario.id_usuario,

                observaciones:
                    this.observacionesTransferencia
                        .trim()
                    || null,

                detalles

            };


            request$ =
                this.transferenciaService
                    .crear(
                        data
                    );

        }


        /*
        |--------------------------------------------------------------------------
        | Ejecutar
        |--------------------------------------------------------------------------
        */

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

                    this.router.navigate(
                        [
                            '/dashboard/transfers'
                        ]
                    );

                },


                error: (
                    error:
                        HttpErrorResponse
                ) => {

                    this.errorMensaje.set(
                        this.mensajeError(
                            error
                        )
                    );

                }

            });
    }


    /*
    |--------------------------------------------------------------------------
    | Cancelar
    |--------------------------------------------------------------------------
    */

    cancelar(): void {

        this.router.navigate(
            [
                '/dashboard/transfers'
            ]
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Número
    |--------------------------------------------------------------------------
    */

    numero(
        value:
            number
            |
            string
            |
            null
            |
            undefined
    ): number {

        const resultado =
            Number(
                value
                ?? 0
            );


        return Number.isFinite(
            resultado
        )
            ? resultado
            : 0;

    }


    /*
    |--------------------------------------------------------------------------
    | Mensaje de error
    |--------------------------------------------------------------------------
    */

    private mensajeError(
        error:
            HttpErrorResponse
    ): string {

        if (
            error.status === 422
            &&
            error.error
                ?.errors
        ) {

            const valores =
                Object.values(
                    error.error.errors
                );


            for (
                const value
                of valores
            ) {

                if (
                    Array.isArray(
                        value
                    )
                    &&
                    value.length > 0
                ) {

                    return String(
                        value[0]
                    );

                }

            }

        }


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


        if (
            error.status === 403
        ) {

            return (
                'No tiene permiso para crear transferencias.'
            );

        }


        if (
            error.status === 0
        ) {

            return (
                'No fue posible conectar con el servidor.'
            );

        }


        return (
            'No fue posible registrar la transferencia.'
        );

    }

}