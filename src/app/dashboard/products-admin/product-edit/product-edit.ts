import {
    Component,
    OnInit,
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
    ActivatedRoute,
    Router,
    RouterLink
} from '@angular/router';

import {
    HttpErrorResponse
} from '@angular/common/http';

import {
    finalize,
    forkJoin
} from 'rxjs';

import {
    ArrowLeft,
    CircleAlert,
    FileText,
    Package,
    RefreshCw,
    Save,
    LucideAngularModule
} from 'lucide-angular';

import {
    CategoriaService
} from '../../../core/services/catalogos/categoria.service';

import {
    ProductoService
} from '../../../core/services/catalogos/producto.service';

import {
    Categoria
} from '../../../shared/models/categoria.model';

import {
    Producto,
    ProductoRequest
} from '../../../shared/models/producto.model';

import {
    ProductVariants
} from './product-variants/product-variants';

import {
    ProductStock
} from './product-stock/product-stock';

import {
    ProductImages
} from './product-images/product-images';

@Component({
    selector: 'app-product-edit',

    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        LucideAngularModule,
        ProductVariants,
        ProductStock,
        ProductImages
    ],

    templateUrl: './product-edit.html',

    styleUrl: './product-edit.css'
})
export class ProductEdit
    implements OnInit {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly route =
        inject(
            ActivatedRoute
        );


    private readonly router =
        inject(
            Router
        );


    private readonly productoService =
        inject(
            ProductoService
        );


    private readonly categoriaService =
        inject(
            CategoriaService
        );


    /*
    |--------------------------------------------------------------------------
    | Producto
    |--------------------------------------------------------------------------
    */

    private idProducto:
        number | null = null;


    readonly producto =
        signal<Producto | null>(
            null
        );


    /*
    |--------------------------------------------------------------------------
    | Formulario
    |--------------------------------------------------------------------------
    */

    formData = {

        id_categoria:
            null as number | null,

        nombre: '',

        // marca: '',

        modelo: '',

        descripcion: '',

        catalogo_pdf: '',

        observaciones: '',

        estado_registro:
            'A'

    };


    /*
    |--------------------------------------------------------------------------
    | Categorías
    |--------------------------------------------------------------------------
    */

    readonly categorias =
        signal<Categoria[]>([]);


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


    readonly erroresCampos =
        signal<
            Record<string, string>
        >({});


    /*
    |--------------------------------------------------------------------------
    | Iconos
    |--------------------------------------------------------------------------
    */

    readonly ArrowLeft =
        ArrowLeft;


    readonly CircleAlert =
        CircleAlert;


    readonly FileText =
        FileText;


    readonly Package =
        Package;


    readonly RefreshCw =
        RefreshCw;


    readonly Save =
        Save;


    /*
    |--------------------------------------------------------------------------
    | Inicio
    |--------------------------------------------------------------------------
    */

    ngOnInit(): void {

        const id =
            Number(
                this.route
                    .snapshot
                    .paramMap
                    .get(
                        'id'
                    )
            );


        if (
            !Number.isInteger(
                id
            )
            ||
            id <= 0
        ) {

            this.errorMensaje.set(
                'El identificador del producto no es válido.'
            );

            return;

        }


        this.idProducto =
            id;


        this.cargarDatos();

    }


    /*
    |--------------------------------------------------------------------------
    | Cargar
    |--------------------------------------------------------------------------
    */

    cargarDatos(): void {

        if (
            !this.idProducto
            ||
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

            producto:
                this.productoService
                    .obtener(
                        this.idProducto
                    ),

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

                    const producto =
                        response
                            .producto
                            .data;


                    this.producto.set(
                        producto
                    );


                    this.categorias.set(
                        response
                            .categorias
                            .data
                        ?? []
                    );


                    this.cargarFormulario(
                        producto
                    );

                },


                error: (
                    error:
                        HttpErrorResponse
                ) => {

                    this.errorMensaje.set(
                        this.obtenerMensajeErrorCarga(
                            error
                        )
                    );

                }

            });

    }


    /*
    |--------------------------------------------------------------------------
    | Guardar
    |--------------------------------------------------------------------------
    */

    guardar(): void {

        if (
            !this.idProducto
            ||
            this.guardando()
        ) {

            return;

        }


        this.limpiarErrores();


        /*
        |--------------------------------------------------------------------------
        | Validación frontend
        |--------------------------------------------------------------------------
        */

        if (
            this.formData
                .id_categoria
            === null
        ) {

            this.agregarErrorCampo(
                'id_categoria',
                'Seleccione una categoría.'
            );

        }


        if (
            !this.formData
                .nombre
                .trim()
        ) {

            this.agregarErrorCampo(
                'nombre',
                'El nombre del producto es obligatorio.'
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
        | Payload completo
        |--------------------------------------------------------------------------
        */

        const data:
            ProductoRequest = {

            id_categoria:
                this.formData
                    .id_categoria!,

            nombre:
                this.formData
                    .nombre
                    .trim(),

            // marca:
            //     this.normalizarTexto(
            //         this.formData
            //             .marca
            //     ),

            modelo:
                this.normalizarTexto(
                    this.formData
                        .modelo
                ),

            descripcion:
                this.normalizarTexto(
                    this.formData
                        .descripcion
                ),

            catalogo_pdf:
                this.normalizarTexto(
                    this.formData
                        .catalogo_pdf
                ),

            observaciones:
                this.normalizarTexto(
                    this.formData
                        .observaciones
                ),

            estado_registro:
                this.formData
                    .estado_registro

        };


        /*
        |--------------------------------------------------------------------------
        | API
        |--------------------------------------------------------------------------
        */

        this.guardando.set(
            true
        );


        this.productoService
            .actualizar(
                this.idProducto,
                data
            )
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

                    void this.router
                        .navigate([
                            '/dashboard/products'
                        ]);

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
    | Cargar formulario
    |--------------------------------------------------------------------------
    */

    private cargarFormulario(
        producto: Producto
    ): void {

        this.formData = {

            id_categoria:
                producto.id_categoria
                ??
                producto
                    .categoria
                    ?.id_categoria
                ??
                null,

            nombre:
                producto.nombre
                ?? '',

            // marca:
            //     producto.marca
            //     ?? '',

            modelo:
                producto.modelo
                ?? '',

            descripcion:
                producto.descripcion
                ?? '',

            catalogo_pdf:
                producto.catalogo_pdf
                ?? '',

            observaciones:
                producto.observaciones
                ?? '',

            estado_registro:
                producto.estado_registro
                ?? 'A'

        };

    }


    /*
    |--------------------------------------------------------------------------
    | Error de campo
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
    | Errores Laravel
    |--------------------------------------------------------------------------
    */

    private procesarError(
        error: HttpErrorResponse
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
                'Revise los campos marcados en el formulario.'
            );


            return;

        }


        this.errorMensaje.set(
            this.obtenerMensajeErrorGuardado(
                error
            )
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Mensajes
    |--------------------------------------------------------------------------
    */

    private obtenerMensajeErrorCarga(
        error: HttpErrorResponse
    ): string {

        if (
            error.status === 404
        ) {

            return (
                'El producto solicitado no existe.'
            );

        }


        if (
            error.status === 403
        ) {

            return (
                'No tiene permiso para consultar este producto.'
            );

        }


        if (
            error.status === 0
        ) {

            return (
                'No se pudo conectar con el servidor.'
            );

        }


        return (
            'No fue posible cargar la información del producto.'
        );

    }


    private obtenerMensajeErrorGuardado(
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
                    'No tiene permiso para modificar productos.'
                );


            default:

                return (
                    'No fue posible actualizar el producto.'
                );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Helpers
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


    private limpiarErrores(): void {

        this.errorMensaje.set(
            ''
        );


        this.erroresCampos.set(
            {}
        );

    }


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