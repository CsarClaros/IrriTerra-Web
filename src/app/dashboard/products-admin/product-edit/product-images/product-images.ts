import {
    Component,
    OnInit,
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
    finalize
} from 'rxjs';

import {
    CircleAlert,
    Image,
    ImageOff,
    Pencil,
    Plus,
    RefreshCw,
    Save,
    Star,
    X,
    LucideAngularModule
} from 'lucide-angular';

import {
    ProductoImagenService
} from '../../../../core/services/catalogos/producto-imagen.service';

import {
    ProductoImagen,
    ProductoImagenRequest
} from '../../../../shared/models/producto-imagen.model';

import {
    environment
} from '../../../../../environments/environment';


@Component({
    selector:
        'app-product-images',

    imports: [
        CommonModule,
        FormsModule,
        LucideAngularModule
    ],

    templateUrl:
        './product-images.html',

    styleUrl:
        './product-images.css'
})
export class ProductImages
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

    private readonly imagenService =
        inject(
            ProductoImagenService
        );


    /*
    |--------------------------------------------------------------------------
    | URL Backend
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

    readonly imagenes =
        signal<
            ProductoImagen[]
        >([]);


    /*
    |--------------------------------------------------------------------------
    | Imágenes fallidas
    |--------------------------------------------------------------------------
    */

    readonly erroresImagen =
        signal<
            Record<number, boolean>
        >({});


    /*
    |--------------------------------------------------------------------------
    | Estado
    |--------------------------------------------------------------------------
    */

    readonly cargando =
        signal(false);


    readonly guardando =
        signal(false);


    readonly mostrarFormulario =
        signal(false);


    readonly idEditando =
        signal<number | null>(
            null
        );


    readonly errorMensaje =
        signal('');


    readonly erroresCampos =
        signal<
            Record<string, string>
        >({});


    /*
    |--------------------------------------------------------------------------
    | Formulario
    |--------------------------------------------------------------------------
    */

    formData = {

        ruta: '',

        orden:
            1,

        es_principal:
            false

    };


    /*
    |--------------------------------------------------------------------------
    | Iconos
    |--------------------------------------------------------------------------
    */

    readonly CircleAlert =
        CircleAlert;


    readonly Image =
        Image;


    readonly ImageOff =
        ImageOff;


    readonly Pencil =
        Pencil;


    readonly Plus =
        Plus;


    readonly RefreshCw =
        RefreshCw;


    readonly Save =
        Save;


    readonly Star =
        Star;


    readonly X =
        X;


    /*
    |--------------------------------------------------------------------------
    | Inicio
    |--------------------------------------------------------------------------
    */

    ngOnInit(): void {

        this.cargarImagenes();

    }


    /*
    |--------------------------------------------------------------------------
    | Cargar
    |--------------------------------------------------------------------------
    */

    cargarImagenes(): void {

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


        this.erroresImagen.set(
            {}
        );


        this.imagenService
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

                next: response => {

                    const imagenes =
                        (
                            response.data
                            ?? []
                        )
                            .filter(
                                imagen =>
                                    this.obtenerIdProducto(
                                        imagen
                                    )
                                    ===
                                    this.idProducto()
                            )
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


                    this.imagenes.set(
                        imagenes
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
    | Nueva
    |--------------------------------------------------------------------------
    */

    nuevaImagen(): void {

        this.idEditando.set(
            null
        );


        const siguienteOrden =
            this.imagenes()
                .reduce(
                    (
                        maximo,
                        imagen
                    ) =>
                        Math.max(
                            maximo,
                            Number(
                                imagen.orden
                            )
                        ),

                    0
                )
            + 1;


        this.formData = {

            ruta: '',

            orden:
                siguienteOrden,

            es_principal:
                this.imagenes()
                    .length
                === 0

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
    | Editar
    |--------------------------------------------------------------------------
    */

    editarImagen(
        imagen:
            ProductoImagen
    ): void {

        this.idEditando.set(
            imagen
                .id_producto_imagen
        );


        this.formData = {

            ruta:
                imagen.ruta_imagen
                ?? '',

            orden:
                Number(
                    imagen.orden
                    ?? 1
                ),

            es_principal:
                Boolean(
                    imagen.es_principal
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

    cerrarFormulario(
        forzar = false
    ): void {

        if (
            this.guardando()
            &&
            !forzar
        ) {

            return;

        }


        this.mostrarFormulario
            .set(
                false
            );


        this.idEditando.set(
            null
        );


        this.formData = {

            ruta: '',

            orden:
                1,

            es_principal:
                false

        };


        this.erroresCampos.set(
            {}
        );

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


        this.erroresCampos.set(
            {}
        );


        this.errorMensaje.set(
            ''
        );


        const ruta =
            this.formData
                .ruta
                .trim();


        const orden =
            Number(
                this.formData
                    .orden
            );


        /*
        |--------------------------------------------------------------------------
        | Validaciones
        |--------------------------------------------------------------------------
        */

        if (
            !ruta
        ) {

            this.agregarErrorCampo(
                'ruta',
                'La ruta de la imagen es obligatoria.'
            );

        }


        if (
            !Number.isInteger(
                orden
            )
            ||
            orden < 1
        ) {

            this.agregarErrorCampo(
                'orden',
                'El orden debe ser un número entero mayor o igual a 1.'
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
            ProductoImagenRequest = {

            id_producto:
                this.idProducto(),

            ruta,

            orden,

            es_principal:
                this.formData
                    .es_principal,

            estado_registro:
                'A'

        };


        /*
        |--------------------------------------------------------------------------
        | Crear / actualizar
        |--------------------------------------------------------------------------
        */

        const id =
            this.idEditando();


        const request$ =
            id === null

                ? this.imagenService
                    .crear(
                        data
                    )

                : this.imagenService
                    .actualizar(
                        id,
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

                    this.cerrarFormulario(
                        true
                    );


                    this.cargarImagenes();

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
    | Ruta visible
    |--------------------------------------------------------------------------
    */

    rutaImagen(
        imagen:
            ProductoImagen
    ): string | null {
    
        /*
        |--------------------------------------------------------------------------
        | Ruta
        |--------------------------------------------------------------------------
        */
    
        const ruta =
            typeof imagen.ruta_imagen === 'string'
    
                ? imagen.ruta_imagen.trim()
    
                : '';
    
    
        /*
        |--------------------------------------------------------------------------
        | Sin ruta
        |--------------------------------------------------------------------------
        */
    
        if (
            ! ruta
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
        | Assets Angular
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
        | Laravel
        |--------------------------------------------------------------------------
        */
    
        return (
            `${this.backendUrl}/${
                ruta.replace(
                    /^\/+/,
                    ''
                )
            }`
        );
    
    }


    /*
    |--------------------------------------------------------------------------
    | Error visual imagen
    |--------------------------------------------------------------------------
    */

    registrarErrorImagen(
        imagen:
            ProductoImagen
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
            ProductoImagen
    ): boolean {

        return Boolean(
            this.erroresImagen()[
            imagen
                .id_producto_imagen
            ]
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error campo
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
    | ID Producto
    |--------------------------------------------------------------------------
    */

    private obtenerIdProducto(
        imagen:
            ProductoImagen
    ): number | null {

        return (
            imagen.id_producto
            ??
            imagen
                .producto
                ?.id_producto
            ??
            null
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Errores Laravel
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
                    'No tiene permiso para administrar las imágenes.'
                );


            case 404:

                return (
                    'La imagen solicitada no existe.'
                );


            case 422:

                return (
                    'Verifique los datos ingresados.'
                );


            default:

                return (
                    'No fue posible procesar la imagen.'
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