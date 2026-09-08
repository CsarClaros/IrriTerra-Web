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
    Router,
    RouterLink
} from '@angular/router';

import {
    HttpErrorResponse
} from '@angular/common/http';

import {
    finalize
} from 'rxjs';

import {
    ArrowLeft,
    CircleAlert,
    FileText,
    PackagePlus,
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
    ProductoRequest
} from '../../../shared/models/producto.model';


@Component({
    selector: 'app-product-create',

    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        LucideAngularModule
    ],

    templateUrl: './product-create.html',

    styleUrl: './product-create.css'
})
export class ProductCreate
    implements OnInit {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly categoriaService =
        inject(
            CategoriaService
        );


    private readonly productoService =
        inject(
            ProductoService
        );


    private readonly router =
        inject(
            Router
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

        observaciones: ''

    };


    /*
    |--------------------------------------------------------------------------
    | Datos
    |--------------------------------------------------------------------------
    */

    readonly categorias =
        signal<Categoria[]>([]);


    /*
    |--------------------------------------------------------------------------
    | Estado
    |--------------------------------------------------------------------------
    */

    readonly cargandoCategorias =
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


    readonly PackagePlus =
        PackagePlus;


    readonly Save =
        Save;


    /*
    |--------------------------------------------------------------------------
    | Inicio
    |--------------------------------------------------------------------------
    */

    ngOnInit(): void {

        this.cargarCategorias();

    }


    /*
    |--------------------------------------------------------------------------
    | Categorías
    |--------------------------------------------------------------------------
    */

    cargarCategorias(): void {

        this.cargandoCategorias.set(
            true
        );


        this.errorMensaje.set(
            ''
        );


        this.categoriaService
            .listar()
            .pipe(

                finalize(
                    () => {

                        this.cargandoCategorias
                            .set(
                                false
                            );

                    }
                )

            )
            .subscribe({

                next: response => {

                    this.categorias.set(
                        response.data
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
    | Guardar
    |--------------------------------------------------------------------------
    */

    guardar(): void {

        if (
            this.guardando()
        ) {

            return;

        }


        this.limpiarErrores();


        /*
        |--------------------------------------------------------------------------
        | Validación básica frontend
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
        | Payload
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
                )

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
            .crear(
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

                next: response => {

                    void this.router
                        .navigate([
                            '/dashboard/products/edit',
                            response
                                .data
                                .id_producto
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
    | Procesar errores Laravel
    |--------------------------------------------------------------------------
    */

    private procesarError(
        error: HttpErrorResponse
    ): void {

        /*
         * Laravel ValidationException
         */

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
                    'No tiene permiso para registrar productos.'
                );


            case 422:

                return (
                    'Verifique los datos ingresados.'
                );


            default:

                return (
                    'No fue posible registrar el producto.'
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