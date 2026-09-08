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
    BadgeDollarSign,
    Barcode,
    CircleAlert,
    Pencil,
    Plus,
    RefreshCw,
    Save,
    X,
    LucideAngularModule
} from 'lucide-angular';

import {
    ProductoVarianteService
} from '../../../../core/services/catalogos/producto-variante.service';

import {
    PrecioProductoVarianteService
} from '../../../../core/services/catalogos/precio-producto-variante.service';

import {
    SessionService
} from '../../../../core/services/session.service';

import {
    ProductoVariante,
    ProductoVarianteRequest
} from '../../../../shared/models/producto-variante.model';

import {
    PrecioProductoVariante,
    PrecioProductoVarianteRequest
} from '../../../../shared/models/precio-producto-variante.model';

import {
    MarcaService
} from '../../../../core/services/catalogos/marca.service';

import {
    Marca
} from '../../../../shared/models/marca.model';


@Component({
    selector: 'app-product-variants',

    imports: [
        CommonModule,
        FormsModule,
        LucideAngularModule
    ],

    templateUrl:
        './product-variants.html',

    styleUrl:
        './product-variants.css'
})
export class ProductVariants
    implements OnInit {

    /*
    |--------------------------------------------------------------------------
    | Input
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


    private readonly precioService =
        inject(
            PrecioProductoVarianteService
        );

    private readonly marcaService =
        inject(
            MarcaService
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


    readonly precios =
        signal<
            PrecioProductoVariante[]
        >([]);

    readonly marcas =
        signal<
            Marca[]
        >([]);

    /*
    |--------------------------------------------------------------------------
    | Estado general
    |--------------------------------------------------------------------------
    */

    readonly cargando =
        signal(false);


    readonly errorMensaje =
        signal('');


    /*
    |--------------------------------------------------------------------------
    | Permisos
    |--------------------------------------------------------------------------
    */

    readonly puedeVerCostoCompra =
        computed(
            () =>
                this.sessionService
                    .tienePermiso(
                        'precio.costo_compra.ver'
                    )
        );


    /*
    |--------------------------------------------------------------------------
    | Formulario variante
    |--------------------------------------------------------------------------
    */

    readonly guardandoVariante =
        signal(false);


    readonly mostrarFormularioVariante =
        signal(false);


    readonly idVarianteEditando =
        signal<number | null>(
            null
        );


    readonly erroresVariante =
        signal<
            Record<string, string>
        >({});


    formVariante = {

        id_marca:
            null as number | null,

        nombre: '',

        sku: '',

        codigo_comercial: '',

        unidad_medida:
            'UND',

        descripcion: '',

        observaciones: ''

    };


    readonly editandoVariante =
        computed(
            () =>
                this.idVarianteEditando()
                !== null
        );


    /*
    |--------------------------------------------------------------------------
    | Formulario precio
    |--------------------------------------------------------------------------
    */

    readonly mostrarFormularioPrecio =
        signal(false);


    readonly guardandoPrecio =
        signal(false);


    readonly variantePrecio =
        signal<
            ProductoVariante | null
        >(
            null
        );


    readonly idPrecioEditando =
        signal<number | null>(
            null
        );


    readonly errorPrecioMensaje =
        signal('');


    readonly erroresPrecio =
        signal<
            Record<string, string>
        >({});


    formPrecio = {

        costo_compra:
            null as number | null,

        precio_venta:
            null as number | null,

        precio_minimo:
            null as number | null

    };


    readonly editandoPrecio =
        computed(
            () =>
                this.idPrecioEditando()
                !== null
        );


    /*
    |--------------------------------------------------------------------------
    | Iconos
    |--------------------------------------------------------------------------
    */

    readonly BadgeDollarSign =
        BadgeDollarSign;


    readonly Barcode =
        Barcode;


    readonly CircleAlert =
        CircleAlert;


    readonly Pencil =
        Pencil;


    readonly Plus =
        Plus;


    readonly RefreshCw =
        RefreshCw;


    readonly Save =
        Save;


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
    | Cargar variantes + precios
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

            precios:
                this.precioService
                    .listar(),

            marcas:
                this.marcaService
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
    | Marcas
    |--------------------------------------------------------------------------
    */

    this.marcas.set(
        response
            .marcas
            .data
        ?? []
    );

                    /*
                    |--------------------------------------------------------------------------
                    | Variantes del producto actual
                    |--------------------------------------------------------------------------
                    */

                    const variantesProducto =
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
                        variantesProducto
                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Precios de esas variantes
                    |--------------------------------------------------------------------------
                    */

                    const idsVariantes =
                        new Set(
                            variantesProducto
                                .map(
                                    variante =>
                                        variante
                                            .id_producto_variante
                                )
                        );


                    this.precios.set(

                        (
                            response
                                .precios
                                .data
                            ?? []
                        )
                            .filter(
                                precio => {

                                    const idVariante =
                                        this.obtenerIdVariantePrecio(
                                            precio
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
    | Precio de una variante
    |--------------------------------------------------------------------------
    */

    precioDeVariante(
        variante:
            ProductoVariante
    ):
        PrecioProductoVariante | null {

        return this.precios()
            .find(
                precio =>
                    this.obtenerIdVariantePrecio(
                        precio
                    )
                    ===
                    variante
                        .id_producto_variante
            )
            ?? null;

    }


    /*
    |--------------------------------------------------------------------------
    | Nueva variante
    |--------------------------------------------------------------------------
    */

    nuevaVariante(): void {

        this.cerrarFormularioPrecio();


        this.idVarianteEditando.set(
            null
        );


        this.limpiarFormularioVariante();


        this.erroresVariante.set(
            {}
        );


        this.errorMensaje.set(
            ''
        );


        this.mostrarFormularioVariante
            .set(
                true
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Editar variante
    |--------------------------------------------------------------------------
    */

    editarVariante(
        variante:
            ProductoVariante
    ): void {

        this.cerrarFormularioPrecio();


        this.idVarianteEditando.set(
            variante
                .id_producto_variante
        );


        this.formVariante = {

            id_marca:
                variante.id_marca
                ?? null,

            nombre:
                variante.nombre
                ?? '',

            sku:
                variante.sku
                ?? '',

            codigo_comercial:
                variante
                    .codigo_comercial
                ?? '',

            unidad_medida:
                variante
                    .unidad_medida
                ?? 'UND',

            descripcion:
                variante.descripcion
                ?? '',

            observaciones:
                variante.observaciones
                ?? ''

        };


        this.erroresVariante.set(
            {}
        );


        this.errorMensaje.set(
            ''
        );


        this.mostrarFormularioVariante
            .set(
                true
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Cancelar variante
    |--------------------------------------------------------------------------
    */

    cancelarVariante(): void {

        if (
            this.guardandoVariante()
        ) {

            return;

        }


        this.mostrarFormularioVariante
            .set(
                false
            );


        this.idVarianteEditando.set(
            null
        );


        this.limpiarFormularioVariante();


        this.erroresVariante.set(
            {}
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Guardar variante
    |--------------------------------------------------------------------------
    */

    guardarVariante(): void {

        if (
            this.guardandoVariante()
        ) {

            return;

        }


        this.erroresVariante.set(
            {}
        );


        this.errorMensaje.set(
            ''
        );


        /*
        |--------------------------------------------------------------------------
        | Validación
        |--------------------------------------------------------------------------
        */

        if (
            !this.formVariante
                .nombre
                .trim()
        ) {

            this.agregarErrorVariante(
                'sku',
                'El código interno de inventario (SKU) es obligatorio.'
            );

        }


        if (
            !this.formVariante
                .sku
                .trim()
        ) {

            this.agregarErrorVariante(
                'sku',
                'El SKU es obligatorio.'
            );

        }


        if (
            !this.formVariante
                .unidad_medida
                .trim()
        ) {

            this.agregarErrorVariante(
                'unidad_medida',
                'La unidad de medida es obligatoria.'
            );

        }


        if (
            Object.keys(
                this.erroresVariante()
            ).length > 0
        ) {

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Payload
        |--------------------------------------------------------------------------
        */

        const data:
            ProductoVarianteRequest = {

            id_producto:
                this.idProducto(),

            id_marca:
                this.formVariante
                    .id_marca,

            nombre:
                this.formVariante
                    .nombre
                    .trim(),

            sku:
                this.formVariante
                    .sku
                    .trim(),

            codigo_comercial:
                this.normalizarTexto(
                    this.formVariante
                        .codigo_comercial
                ),

            unidad_medida:
                this.formVariante
                    .unidad_medida
                    .trim()
                    .toUpperCase(),

            descripcion:
                this.normalizarTexto(
                    this.formVariante
                        .descripcion
                ),

            observaciones:
                this.normalizarTexto(
                    this.formVariante
                        .observaciones
                ),

            estado_registro:
                'A'

        };


        /*
        |--------------------------------------------------------------------------
        | API
        |--------------------------------------------------------------------------
        */

        const id =
            this.idVarianteEditando();


        const request$ =
            id === null

                ? this.varianteService
                    .crear(
                        data
                    )

                : this.varianteService
                    .actualizar(
                        id,
                        data
                    );


        this.guardandoVariante.set(
            true
        );


        request$
            .pipe(

                finalize(
                    () => {

                        this.guardandoVariante
                            .set(
                                false
                            );

                    }
                )

            )
            .subscribe({

                next: () => {

                    this.cancelarVariante();

                    this.cargarDatos();

                },


                error: (
                    error:
                        HttpErrorResponse
                ) => {

                    this.procesarErrorVariante(
                        error
                    );

                }

            });

    }


    /*
    |--------------------------------------------------------------------------
    | Configurar precio
    |--------------------------------------------------------------------------
    */

    configurarPrecio(
        variante:
            ProductoVariante
    ): void {

        this.cancelarVariante();


        const precio =
            this.precioDeVariante(
                variante
            );


        this.variantePrecio.set(
            variante
        );


        this.idPrecioEditando.set(

            precio
                ?.id_precio_producto_variante
            ?? null

        );


        this.formPrecio = {

            costo_compra:
                this.puedeVerCostoCompra()
                    ? (
                        precio
                            ?.costo_compra
                        ?? null
                    )
                    : null,

            precio_venta:
                precio
                    ?.precio_venta
                ?? null,

            precio_minimo:
                precio
                    ?.precio_minimo
                ?? null

        };


        this.erroresPrecio.set(
            {}
        );


        this.errorPrecioMensaje.set(
            ''
        );


        this.mostrarFormularioPrecio
            .set(
                true
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Cerrar precio
    |--------------------------------------------------------------------------
    */

    cerrarFormularioPrecio(): void {

        if (
            this.guardandoPrecio()
        ) {

            return;

        }


        this.mostrarFormularioPrecio
            .set(
                false
            );


        this.variantePrecio.set(
            null
        );


        this.idPrecioEditando.set(
            null
        );


        this.formPrecio = {

            costo_compra:
                null,

            precio_venta:
                null,

            precio_minimo:
                null

        };


        this.erroresPrecio.set(
            {}
        );


        this.errorPrecioMensaje.set(
            ''
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Guardar precio
    |--------------------------------------------------------------------------
    */

    guardarPrecio(): void {

        if (
            this.guardandoPrecio()
        ) {

            return;

        }


        const variante =
            this.variantePrecio();


        if (
            !variante
        ) {

            return;

        }


        this.erroresPrecio.set(
            {}
        );


        this.errorPrecioMensaje.set(
            ''
        );


        /*
        |--------------------------------------------------------------------------
        | Precio venta
        |--------------------------------------------------------------------------
        */

        if (
            this.formPrecio
                .precio_venta
            === null
            ||
            Number(
                this.formPrecio
                    .precio_venta
            ) <= 0
        ) {

            this.agregarErrorPrecio(
                'precio_venta',
                'Ingrese un precio de venta mayor a cero.'
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Precio mínimo
        |--------------------------------------------------------------------------
        */

        if (
            this.formPrecio
                .precio_minimo
            === null
            ||
            Number(
                this.formPrecio
                    .precio_minimo
            ) < 0
        ) {

            this.agregarErrorPrecio(
                'precio_minimo',
                'Ingrese un precio mínimo válido.'
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Mínimo <= venta
        |--------------------------------------------------------------------------
        */

        if (
            this.formPrecio
                .precio_venta
            !== null
            &&
            this.formPrecio
                .precio_minimo
            !== null
            &&
            Number(
                this.formPrecio
                    .precio_minimo
            )
            >
            Number(
                this.formPrecio
                    .precio_venta
            )
        ) {

            this.agregarErrorPrecio(
                'precio_minimo',
                'El precio mínimo no puede superar el precio de venta.'
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Costo compra
        |--------------------------------------------------------------------------
        */

        if (
            this.puedeVerCostoCompra()
            &&
            this.formPrecio
                .costo_compra
            !== null
            &&
            Number(
                this.formPrecio
                    .costo_compra
            ) < 0
        ) {

            this.agregarErrorPrecio(
                'costo_compra',
                'El costo de compra no puede ser negativo.'
            );

        }


        if (
            Object.keys(
                this.erroresPrecio()
            ).length > 0
        ) {

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Payload
        |--------------------------------------------------------------------------
        */

        const data:
            PrecioProductoVarianteRequest = {

            id_producto_variante:
                variante
                    .id_producto_variante,

            precio_venta:
                Number(
                    this.formPrecio
                        .precio_venta
                ),

            precio_minimo:
                Number(
                    this.formPrecio
                        .precio_minimo
                ),

            estado_registro:
                'A'

        };


        /*
        |--------------------------------------------------------------------------
        | Costo protegido
        |--------------------------------------------------------------------------
        |
        | Si el usuario no posee permiso, ni siquiera enviamos la propiedad.
        |
        */

        if (
            this.puedeVerCostoCompra()
        ) {

            data.costo_compra =
                this.formPrecio
                    .costo_compra
                    === null

                    ? null

                    : Number(
                        this.formPrecio
                            .costo_compra
                    );

        }


        /*
        |--------------------------------------------------------------------------
        | Crear / actualizar
        |--------------------------------------------------------------------------
        */

        const idPrecio =
            this.idPrecioEditando();


        const request$ =
            idPrecio === null

                ? this.precioService
                    .crear(
                        data
                    )

                : this.precioService
                    .actualizar(
                        idPrecio,
                        data
                    );


        this.guardandoPrecio.set(
            true
        );


        request$
            .pipe(

                finalize(
                    () => {

                        this.guardandoPrecio
                            .set(
                                false
                            );

                    }
                )

            )
            .subscribe({

                next: () => {

                    this.cerrarFormularioPrecio();

                    this.cargarDatos();

                },


                error: (
                    error:
                        HttpErrorResponse
                ) => {

                    this.procesarErrorPrecio(
                        error
                    );

                }

            });

    }


    /*
    |--------------------------------------------------------------------------
    | Errores campos
    |--------------------------------------------------------------------------
    */

    errorVariante(
        campo: string
    ): string | null {

        return this.erroresVariante()[
            campo
        ] ?? null;

    }


    errorPrecio(
        campo: string
    ): string | null {

        return this.erroresPrecio()[
            campo
        ] ?? null;

    }


    /*
    |--------------------------------------------------------------------------
    | IDs
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


    private obtenerIdVariantePrecio(
        precio:
            PrecioProductoVariante
    ): number | null {

        return (
            precio.id_producto_variante
            ??
            precio
                .producto_variante
                ?.id_producto_variante
            ??
            precio
                .variante
                ?.id_producto_variante
            ??
            null
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error variante
    |--------------------------------------------------------------------------
    */

    private procesarErrorVariante(
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


            this.erroresVariante.set(
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
    | Error precio
    |--------------------------------------------------------------------------
    */

    private procesarErrorPrecio(
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


            this.erroresPrecio.set(
                errores
            );


            this.errorPrecioMensaje.set(
                'Revise los campos marcados.'
            );


            return;

        }


        this.errorPrecioMensaje.set(
            this.obtenerMensajeError(
                error
            )
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Mensaje HTTP
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
                    'No tiene permiso para realizar esta operación.'
                );


            case 404:

                return (
                    'El registro solicitado no existe.'
                );


            case 422:

                return (
                    'Verifique los datos ingresados.'
                );


            default:

                return (
                    'No fue posible procesar la solicitud.'
                );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Helpers variante
    |--------------------------------------------------------------------------
    */

    private limpiarFormularioVariante(): void {

        this.formVariante = {

            id_marca:
                null,

            nombre: '',

            sku: '',

            codigo_comercial: '',

            unidad_medida:
                'UND',

            descripcion: '',

            observaciones: ''

        };

    }


    private agregarErrorVariante(
        campo: string,
        mensaje: string
    ): void {

        this.erroresVariante.update(
            errores => ({

                ...errores,

                [campo]:
                    mensaje

            })
        );

    }



    nombreMarca(
        variante:
            ProductoVariante
    ): string {

        if (
            variante.marca
                ?.nombre
        ) {

            return variante
                .marca
                .nombre;

        }


        if (
            variante.id_marca
            === null
            ||
            variante.id_marca
            === undefined
        ) {

            return 'Sin marca';

        }


        return this.marcas()
            .find(
                marca =>
                    marca.id_marca
                    === variante.id_marca
            )
            ?.nombre
            ?? 'Sin marca';

    }


    /*
    |--------------------------------------------------------------------------
    | Helpers precio
    |--------------------------------------------------------------------------
    */

    private agregarErrorPrecio(
        campo: string,
        mensaje: string
    ): void {

        this.erroresPrecio.update(
            errores => ({

                ...errores,

                [campo]:
                    mensaje

            })
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Texto
    |--------------------------------------------------------------------------
    */

    private normalizarTexto(
        value: string
    ): string | null {

        const texto =
            value.trim();


        return texto
            ? texto
            : null;

    }

}