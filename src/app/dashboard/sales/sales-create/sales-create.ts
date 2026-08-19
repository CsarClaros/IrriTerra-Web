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
    Router,
    RouterLink
} from '@angular/router';

import {
    finalize,
    forkJoin,
    Observable,
    of
} from 'rxjs';

import {
    ArrowLeft,
    CircleAlert,
    PackagePlus,
    Plus,
    Save,
    Search,
    Trash2,
    LucideAngularModule
} from 'lucide-angular';

import {
    ClienteService
} from '../../../core/services/ventas/cliente.service';

import {
    VentaService
} from '../../../core/services/ventas/venta.service';

import {
    ProductoVarianteService
} from '../../../core/services/catalogos/producto-variante.service';

import {
    PrecioProductoVarianteService
} from '../../../core/services/catalogos/precio-producto-variante.service';

import {
    StockSucursalService
} from '../../../core/services/catalogos/stock-sucursal.service';

import {
    SessionService
} from '../../../core/services/session.service';

import {
    Cliente
} from '../../../shared/models/cliente.model';

import {
    ProductoVariante
} from '../../../shared/models/producto-variante.model';

import {
    PrecioProductoVariante
} from '../../../shared/models/precio-producto-variante.model';

import {
    StockSucursal
} from '../../../shared/models/stock-sucursal.model';

import {
    Venta,
    VentaActualizarRequest,
    VentaCrearRequest
} from '../../../shared/models/venta.model';

import {
    ApiResourceResponse
} from '../../../shared/models/api-response.model';


interface LineaVenta {

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

    precio_unitario:
    number;

    precio_venta:
    number;

    precio_minimo:
    number;

    descuento:
    number;

    stock_disponible:
    number;

    observaciones:
    string;

}


@Component({
    selector:
        'app-sales-create',

    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        LucideAngularModule
    ],

    templateUrl:
        './sales-create.html',

    styleUrl:
        './sales-create.css'
})
export class SalesCreate
    implements OnInit {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly clienteService =
        inject(
            ClienteService
        );


    private readonly ventaService =
        inject(
            VentaService
        );


    private readonly varianteService =
        inject(
            ProductoVarianteService
        );


    private readonly precioService =
        inject(
            PrecioProductoVarianteService
        );


    private readonly stockService =
        inject(
            StockSucursalService
        );


    private readonly sessionService =
        inject(
            SessionService
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
    | Datos
    |--------------------------------------------------------------------------
    */

    readonly clientes =
        signal<
            Cliente[]
        >([]);


    readonly variantes =
        signal<
            ProductoVariante[]
        >([]);


    readonly precios =
        signal<
            PrecioProductoVariante[]
        >([]);


    readonly stocks =
        signal<
            StockSucursal[]
        >([]);


    readonly idVenta =
        signal<number | null>(
            null
        );


    readonly ventaEditando =
        signal<Venta | null>(
            null
        );


    readonly modoEdicion =
        computed(
            () =>
                this.idVenta()
                !== null
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


    readonly errorProducto =
        signal('');


    /*
    |--------------------------------------------------------------------------
    | Venta
    |--------------------------------------------------------------------------
    */

    idCliente:
        number | null =
        null;


    observacionesVenta =
        '';


    /*
    |--------------------------------------------------------------------------
    | Buscador producto
    |--------------------------------------------------------------------------
    */

    readonly busquedaProducto =
        signal('');


    readonly idVarianteSeleccionada =
        signal<number | null>(
            null
        );

    cantidad =
        1;


    precioUnitario:
        number | null =
        null;


    descuento =
        0;


    observacionesDetalle =
        '';


    /*
    |--------------------------------------------------------------------------
    | Carrito
    |--------------------------------------------------------------------------
    */

    readonly lineas =
        signal<
            LineaVenta[]
        >([]);


    /*
    |--------------------------------------------------------------------------
    | Sesión
    |--------------------------------------------------------------------------
    */

    readonly usuario =
        this.sessionService
            .usuario;


    readonly sucursal =
        this.sessionService
            .sucursal;


    /*
    |--------------------------------------------------------------------------
    | Variantes filtradas
    |--------------------------------------------------------------------------
    */

    readonly variantesFiltradas =
        computed(
            () => {

                const texto =
                    this.busquedaProducto()
                        .trim()
                        .toLowerCase();


                return this.variantes()
                    .filter(
                        variante => {

                            /*
                             * Debe tener configuración
                             * de precios activa.
                             */

                            if (
                                !this.precioDeVariante(
                                    variante
                                        .id_producto_variante
                                )
                            ) {

                                return false;

                            }


                            if (
                                !texto
                            ) {

                                return true;

                            }


                            const producto =
                                variante
                                    .producto
                                    ?.nombre
                                ?? '';


                            return [

                                producto,

                                variante.nombre,

                                variante.sku,

                                variante
                                    .codigo_comercial
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
                            variante
                                .id_producto_variante
                            === id
                    )
                    ?? null;

            }
        );

    readonly precioSeleccionado =
        computed(
            () => {

                const variante =
                    this.varianteSeleccionada();


                if (
                    !variante
                ) {

                    return null;

                }


                return this.precioDeVariante(
                    variante
                        .id_producto_variante
                );

            }
        );


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
                    variante
                        .id_producto_variante
                );

            }
        );


    /*
    |--------------------------------------------------------------------------
    | Totales
    |--------------------------------------------------------------------------
    */

    readonly subtotal =
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
                            (
                                linea.cantidad
                                *
                                linea.precio_unitario
                            ),

                        0
                    )
        );


    readonly descuentoTotal =
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
                            linea.descuento,

                        0
                    )
        );


    readonly total =
        computed(
            () =>
                Math.max(
                    0,
                    this.subtotal()
                    -
                    this.descuentoTotal()
                )
        );


    /*
    |--------------------------------------------------------------------------
    | Iconos
    |--------------------------------------------------------------------------
    */

    readonly ArrowLeft =
        ArrowLeft;


    readonly CircleAlert =
        CircleAlert;


    readonly PackagePlus =
        PackagePlus;


    readonly Plus =
        Plus;


    readonly Save =
        Save;


    readonly Search =
        Search;


    readonly Trash2 =
        Trash2;


    /*
    |--------------------------------------------------------------------------
    | Inicio
    |--------------------------------------------------------------------------
    */

    ngOnInit(): void {

        const parametro =
            this.route
                .snapshot
                .paramMap
                .get(
                    'id'
                );


        if (
            parametro
        ) {

            const id =
                Number(
                    parametro
                );


            if (
                Number.isInteger(
                    id
                )
                &&
                id > 0
            ) {

                this.idVenta.set(
                    id
                );

            }

        }


        this.cargarDatos();

    }


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


        const idVenta =
            this.idVenta();


        forkJoin({

            clientes:
                this.clienteService
                    .listar(),

            variantes:
                this.varianteService
                    .listar(),

            precios:
                this.precioService
                    .listar(),

            stocks:
                this.stockService
                    .listar(),

            venta:
                idVenta !== null

                    ? this.ventaService
                        .obtener(
                            idVenta
                        )

                    : of(
                        null
                    )

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
                    | Clientes
                    |--------------------------------------------------------------------------
                    */

                    this.clientes.set(

                        (
                            response
                                .clientes
                                .data
                            ?? []
                        )
                            .filter(
                                cliente =>
                                    cliente.estado_registro
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
                    | Precios
                    |--------------------------------------------------------------------------
                    */

                    this.precios.set(

                        (
                            response
                                .precios
                                .data
                            ?? []
                        )
                            .filter(
                                precio =>
                                    precio.estado_registro
                                    === 'A'
                            )

                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Stocks
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
                    | Venta en edición
                    |--------------------------------------------------------------------------
                    |
                    | Es importante hacerlo DESPUÉS de cargar variantes,
                    | precios y stocks, porque cargarVenta() utiliza esos
                    | catálogos para reconstruir las líneas.
                    |
                    */

                    if (
                        response.venta
                    ) {

                        this.cargarVenta(
                            response
                                .venta
                                .data
                        );

                    }

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


    private cargarVenta(
        venta:
            Venta
    ): void {

        /*
        |--------------------------------------------------------------------------
        | Solo borradores
        |--------------------------------------------------------------------------
        */

        if (
            venta.estado_venta
            !== 'BORRADOR'
        ) {

            this.errorMensaje.set(
                'Solo pueden editarse ventas en borrador.'
            );

            return;

        }


        this.ventaEditando.set(
            venta
        );


        this.idCliente =
            venta.id_cliente
            ?? null;


        this.observacionesVenta =
            venta.observaciones
            ?? '';


        /*
        |--------------------------------------------------------------------------
        | Detalles
        |--------------------------------------------------------------------------
        */

        const lineas:
            LineaVenta[] = [];


        for (
            const detalle
            of venta.detalles
            ?? []
        ) {

            const variante =
                detalle
                    .producto_variante
                ??
                this.variantes()
                    .find(
                        item =>
                            item.id_producto_variante
                            ===
                            detalle.id_producto_variante
                    );


            if (
                !variante
            ) {

                continue;

            }


            const precio =
                this.precioDeVariante(
                    variante
                        .id_producto_variante
                );


            const stock =
                this.stockDeVariante(
                    variante
                        .id_producto_variante
                );


            lineas.push({

                id_producto_variante:
                    variante
                        .id_producto_variante,

                producto:
                    variante
                        .producto
                        ?.nombre
                    ?? 'Producto',

                variante:
                    variante.nombre,

                sku:
                    variante.sku,

                unidad_medida:
                    variante.unidad_medida,

                cantidad:
                    this.numero(
                        detalle.cantidad
                    ),

                precio_unitario:
                    this.numero(
                        detalle
                            .precio_unitario
                    ),

                precio_venta:
                    this.numero(
                        precio
                            ?.precio_venta
                    ),

                precio_minimo:
                    this.numero(
                        precio
                            ?.precio_minimo
                    ),

                descuento:
                    this.numero(
                        detalle.descuento
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

            });

        }


        this.lineas.set(
            lineas
        );

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


        this.busquedaProducto.set(
            input.value
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

        this.idVarianteSeleccionada.set(id);


        this.errorProducto.set(
            ''
        );


        if (
            id === null
        ) {

            this.precioUnitario =
                null;

            this.descuento =
                0;

            return;

        }


        const precio =
            this.precioDeVariante(
                id
            );


        this.precioUnitario =
            precio
                ? this.numero(
                    precio.precio_venta
                )
                : null;


        this.descuento =
            0;

    }


    /*
    |--------------------------------------------------------------------------
    | Precio
    |--------------------------------------------------------------------------
    */

    precioDeVariante(
        idVariante:
            number
    ):
        PrecioProductoVariante | null {

        return this.precios()
            .find(
                precio =>
                    precio.id_producto_variante
                    === idVariante
            )
            ?? null;

    }


    /*
    |--------------------------------------------------------------------------
    | Stock
    |--------------------------------------------------------------------------
    */

    stockDeVariante(
        idVariante:
            number
    ):
        StockSucursal | null {

        const idSucursal =

            this.ventaEditando()
                ?.id_sucursal

            ??

            this.sucursal()
                ?.id_sucursal;


        if (
            !idSucursal
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
    | Agregar detalle
    |--------------------------------------------------------------------------
    */

    agregarDetalle(): void {

        this.errorProducto.set(
            ''
        );


        const variante =
            this.varianteSeleccionada();


        const precio =
            this.precioSeleccionado();


        const stock =
            this.stockSeleccionado();


        if (
            !variante
        ) {

            this.errorProducto.set(
                'Seleccione una variante.'
            );

            return;

        }


        if (
            !precio
        ) {

            this.errorProducto.set(
                'La variante no tiene una configuración de precios activa.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Duplicados
        |--------------------------------------------------------------------------
        */

        const existe =
            this.lineas()
                .some(
                    linea =>
                        linea.id_producto_variante
                        ===
                        variante.id_producto_variante
                );


        if (
            existe
        ) {

            this.errorProducto.set(
                'La variante ya fue agregada a la venta.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Valores
        |--------------------------------------------------------------------------
        */

        const cantidad =
            Number(
                this.cantidad
            );


        const precioUnitario =
            Number(
                this.precioUnitario
            );


        const precioMinimo =
            this.numero(
                precio.precio_minimo
            );


        const precioVenta =
            this.numero(
                precio.precio_venta
            );


        const descuento =
            Number(
                this.descuento
                ?? 0
            );


        const stockDisponible =
            stock
                ? this.numero(
                    stock.stock_actual
                )
                : 0;


        /*
        |--------------------------------------------------------------------------
        | Cantidad
        |--------------------------------------------------------------------------
        */

        if (
            !Number.isFinite(
                cantidad
            )
            ||
            cantidad <= 0
        ) {

            this.errorProducto.set(
                'La cantidad debe ser mayor que cero.'
            );

            return;

        }


        if (
            stockDisponible <= 0
        ) {

            this.errorProducto.set(
                'La variante no tiene stock disponible en su sucursal.'
            );

            return;

        }


        if (
            cantidad
            >
            stockDisponible
        ) {

            this.errorProducto.set(
                'La cantidad supera el stock disponible.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Precio
        |--------------------------------------------------------------------------
        */

        if (
            !Number.isFinite(
                precioUnitario
            )
            ||
            precioUnitario <= 0
        ) {

            this.errorProducto.set(
                'El precio unitario no es válido.'
            );

            return;

        }


        if (
            precioUnitario
            <
            precioMinimo
        ) {

            this.errorProducto.set(
                'El precio unitario no puede ser menor al precio mínimo.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Descuento
        |--------------------------------------------------------------------------
        */

        const importeBruto =
            cantidad
            *
            precioUnitario;


        if (
            !Number.isFinite(
                descuento
            )
            ||
            descuento < 0
        ) {

            this.errorProducto.set(
                'El descuento no puede ser negativo.'
            );

            return;

        }


        if (
            descuento
            >
            importeBruto
        ) {

            this.errorProducto.set(
                'El descuento supera el importe del producto.'
            );

            return;

        }


        const importeFinal =
            importeBruto
            -
            descuento;


        const importeMinimo =
            cantidad
            *
            precioMinimo;


        if (
            importeFinal
            <
            importeMinimo
        ) {

            this.errorProducto.set(
                'El descuento deja el precio efectivo por debajo del mínimo permitido.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Agregar
        |--------------------------------------------------------------------------
        */

        this.lineas.update(
            lineas => [

                ...lineas,

                {

                    id_producto_variante:
                        variante
                            .id_producto_variante,

                    producto:
                        variante
                            .producto
                            ?.nombre
                        ?? 'Producto',

                    variante:
                        variante.nombre,

                    sku:
                        variante.sku,

                    unidad_medida:
                        variante.unidad_medida,

                    cantidad,

                    precio_unitario:
                        precioUnitario,

                    precio_venta:
                        precioVenta,

                    precio_minimo:
                        precioMinimo,

                    descuento,

                    stock_disponible:
                        stockDisponible,

                    observaciones:
                        this
                            .observacionesDetalle
                            .trim()

                }

            ]
        );


        this.limpiarProducto();

    }


    /*
    |--------------------------------------------------------------------------
    | Actualizar línea
    |--------------------------------------------------------------------------
    */

    actualizarLinea(
        idVariante: number,
        campo:
            'cantidad'
            |
            'precio_unitario'
            |
            'descuento',
        valor:
            number | null
    ): void {

        const numero =
            Number(
                valor
                ?? 0
            );


        this.lineas.update(
            lineas =>
                lineas.map(
                    linea => {

                        if (
                            linea.id_producto_variante
                            !== idVariante
                        ) {

                            return linea;

                        }


                        return {

                            ...linea,

                            [campo]:
                                numero

                        };

                    }
                )
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Validar línea
    |--------------------------------------------------------------------------
    */

    errorLinea(
        linea:
            LineaVenta
    ): string | null {

        if (
            !Number.isFinite(
                linea.cantidad
            )
            ||
            linea.cantidad <= 0
        ) {

            return (
                'Cantidad inválida.'
            );

        }


        if (
            linea.cantidad
            >
            linea.stock_disponible
        ) {

            return (
                'Supera el stock disponible.'
            );

        }


        if (
            linea.precio_unitario
            <
            linea.precio_minimo
        ) {

            return (
                'Precio menor al mínimo.'
            );

        }


        const bruto =
            linea.cantidad
            *
            linea.precio_unitario;


        if (
            linea.descuento < 0
            ||
            linea.descuento
            >
            bruto
        ) {

            return (
                'Descuento inválido.'
            );

        }


        const final =
            bruto
            -
            linea.descuento;


        const minimo =
            linea.cantidad
            *
            linea.precio_minimo;


        if (
            final < minimo
        ) {

            return (
                'El precio efectivo queda debajo del mínimo.'
            );

        }


        return null;

    }


    /*
    |--------------------------------------------------------------------------
    | Eliminar
    |--------------------------------------------------------------------------
    */

    eliminarLinea(
        idVariante:
            number
    ): void {

        this.lineas.update(
            lineas =>
                lineas.filter(
                    linea =>
                        linea.id_producto_variante
                        !== idVariante
                )
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Limpiar selección
    |--------------------------------------------------------------------------
    */

    limpiarProducto(): void {

        this.idVarianteSeleccionada.set(null);

        this.cantidad =
            1;

        this.precioUnitario =
            null;

        this.descuento =
            0;

        this.observacionesDetalle =
            '';

        this.errorProducto.set(
            ''
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Guardar venta
    |--------------------------------------------------------------------------
    */

    guardarVenta(): void {

        /*
        |--------------------------------------------------------------------------
        | Evitar doble envío
        |--------------------------------------------------------------------------
        */

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
        | Usuario autenticado
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
        | Venta
        |--------------------------------------------------------------------------
        */

        const idVenta =
            this.idVenta();


        const sucursal =
            this.sucursal();


        /*
        |--------------------------------------------------------------------------
        | Sucursal
        |--------------------------------------------------------------------------
        |
        | Para crear una venta Laravel exige id_sucursal.
        |
        | Para editar un borrador no necesitamos volver a enviarla,
        | ya que la venta conserva su sucursal actual.
        |
        */

        if (
            idVenta === null
            &&
            !sucursal
        ) {

            this.errorMensaje.set(
                'El usuario no tiene una sucursal asignada.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Detalles
        |--------------------------------------------------------------------------
        */

        if (
            this.lineas().length
            === 0
        ) {

            this.errorMensaje.set(
                'Agregue al menos un producto a la venta.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Validación de todas las líneas
        |--------------------------------------------------------------------------
        */

        const errorLinea =
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
            errorLinea
        ) {

            this.errorMensaje.set(
                errorLinea
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Construcción de detalles
        |--------------------------------------------------------------------------
        */

        const detalles =
            this.lineas()
                .map(
                    linea => ({

                        id_producto_variante:
                            linea
                                .id_producto_variante,

                        cantidad:
                            linea.cantidad,

                        precio_unitario:
                            linea
                                .precio_unitario,

                        descuento:
                            linea.descuento,

                        observaciones:
                            linea
                                .observaciones
                                .trim()
                            || null

                    })
                );


        /*
        |--------------------------------------------------------------------------
        | Petición
        |--------------------------------------------------------------------------
        */

        let peticion:
            Observable<
                ApiResourceResponse<
                    Venta
                >
            >;


        /*
        |--------------------------------------------------------------------------
        | MODO EDICIÓN
        |--------------------------------------------------------------------------
        */

        if (
            idVenta !== null
        ) {

            /*
             * Una venta que ya no sea BORRADOR
             * no debe poder modificarse.
             */

            const venta =
                this.ventaEditando();


            if (
                !venta
            ) {

                this.errorMensaje.set(
                    'No fue posible cargar la venta que desea editar.'
                );

                return;

            }


            if (
                venta.estado_venta
                !== 'BORRADOR'
            ) {

                this.errorMensaje.set(
                    'Solo pueden editarse ventas en borrador.'
                );

                return;

            }


            const data:
                VentaActualizarRequest = {

                id_cliente:
                    this.idCliente,

                observaciones:
                    this.observacionesVenta
                        .trim()
                    || null,

                usuario_modificacion:
                    usuario.id_usuario,

                detalles

            };


            peticion =
                this.ventaService
                    .actualizar(
                        idVenta,
                        data
                    );

        }


        /*
        |--------------------------------------------------------------------------
        | MODO CREACIÓN
        |--------------------------------------------------------------------------
        */

        else {

            /*
             * Aquí TypeScript todavía podría considerar
             * sucursal nullable, por eso hacemos una
             * comprobación explícita.
             */

            if (
                !sucursal
            ) {

                this.errorMensaje.set(
                    'El usuario no tiene una sucursal asignada.'
                );

                return;

            }


            const data:
                VentaCrearRequest = {

                id_sucursal:
                    sucursal.id_sucursal,

                id_cliente:
                    this.idCliente,

                id_usuario_vendedor:
                    usuario.id_usuario,

                observaciones:
                    this.observacionesVenta
                        .trim()
                    || null,

                usuario_creacion:
                    usuario.id_usuario,

                detalles

            };


            peticion =
                this.ventaService
                    .crear(
                        data
                    );

        }


        /*
        |--------------------------------------------------------------------------
        | Ejecutar petición
        |--------------------------------------------------------------------------
        */

        this.guardando.set(
            true
        );


        peticion
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

                /*
                |--------------------------------------------------------------------------
                | Éxito
                |--------------------------------------------------------------------------
                */

                next: () => {

                    this.router.navigate(
                        [
                            '/dashboard/sales'
                        ]
                    );

                },


                /*
                |--------------------------------------------------------------------------
                | Error
                |--------------------------------------------------------------------------
                */

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
    | Nombre variante
    |--------------------------------------------------------------------------
    */

    nombreVariante(
        variante:
            ProductoVariante
    ): string {

        const producto =
            variante
                .producto
                ?.nombre;


        if (
            producto
        ) {

            return (
                `${producto} — ${variante.nombre}`
            );

        }


        return variante.nombre;

    }


    /*
    |--------------------------------------------------------------------------
    | Decimal API
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
    | Error HTTP
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
            &&
            typeof error.error.errors
            === 'object'
        ) {

            const mensajes =
                Object.values(
                    error.error.errors
                );


            for (
                const value
                of mensajes
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


        switch (
        error.status
        ) {

            case 0:

                return (
                    'No se pudo conectar con el servidor.'
                );


            case 403:

                return (
                    'No tiene permiso para registrar ventas.'
                );


            case 422:

                return (
                    'Revise los datos de la venta.'
                );


            default:

                return (
                    'No fue posible registrar la venta.'
                );

        }

    }

}