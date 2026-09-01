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
    concatMap,
    finalize,
    from,
    toArray
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

import {
    ProductoVarianteService
} from '../../../../core/services/catalogos/producto-variante.service';

import {
    ProductoVariante
} from '../../../../shared/models/producto-variante.model';

interface ImagenPendiente {

    id: string;

    archivo: File;

    vistaPrevia: string;

    orden: number;

    es_principal: boolean;

}


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

    readonly imagenesPendientes =
        signal<ImagenPendiente[]>(
            []
        );
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

    private readonly varianteService =
        inject(
            ProductoVarianteService
        );


    readonly variantes =
        signal<
            ProductoVariante[]
        >([]);


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

        imagen:
            null as File | null,

        orden:
            1,

        es_principal:
            false

    };

    readonly vistaPrevia =
        signal<string | null>(
            null
        );


    readonly rutaActual =
        signal<string | null>(
            null
        );


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

            imagen:
                null,

            orden:
                siguienteOrden,

            es_principal:
                this.imagenes()
                    .length
                === 0

        };


        this.vistaPrevia.set(
            null
        );


        this.rutaActual.set(
            null
        );


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

            imagen:
                null,

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


        this.vistaPrevia.set(
            null
        );


        this.rutaActual.set(
            this.rutaImagen(
                imagen
            )
        );


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

            imagen:
                null,

            orden:
                1,

            es_principal:
                false

        };


        this.vistaPrevia.set(
            null
        );


        this.rutaActual.set(
            null
        );


        this.erroresCampos.set(
            {}
        );

    }


    /*
|--------------------------------------------------------------------------
| Selección de imagen
|--------------------------------------------------------------------------
*/

    seleccionarImagenes(
        event: Event
    ): void {

        const input =
            event.target as HTMLInputElement;


        const archivos =
            Array.from(
                input.files ?? []
            );


        if (
            archivos.length === 0
        ) {

            return;

        }


        const tiposPermitidos = [

            'image/jpeg',

            'image/png',

            'image/webp'

        ];


        const maximoBytes =
            5 * 1024 * 1024;


        const pendientes =
            [
                ...this.imagenesPendientes()
            ];


        const ordenesReservados =
            new Set<number>(

                this.imagenes()
                    .map(
                        imagen =>
                            Number(
                                imagen.orden
                            )
                    )

            );


        pendientes
            .forEach(
                imagen => {

                    ordenesReservados.add(
                        imagen.orden
                    );

                }
            );


        let existePrincipal =

            this.imagenes()
                .some(
                    imagen =>
                        imagen.es_principal
                )

            ||

            pendientes
                .some(
                    imagen =>
                        imagen.es_principal
                );


        for (
            const archivo
            of archivos
        ) {

            if (
                !tiposPermitidos.includes(
                    archivo.type
                )
            ) {

                this.errorMensaje.set(
                    'Solo se permiten imágenes JPG, PNG o WEBP.'
                );

                continue;

            }


            if (
                archivo.size
                >
                maximoBytes
            ) {

                this.errorMensaje.set(
                    `La imagen ${archivo.name} supera los 5 MB.`
                );

                continue;

            }


            const duplicada =
                pendientes.some(
                    item =>
                        item.archivo.name
                        === archivo.name
                        &&
                        item.archivo.size
                        === archivo.size
                        &&
                        item.archivo.lastModified
                        === archivo.lastModified
                );


            if (
                duplicada
            ) {

                continue;

            }


            const orden =
                this.siguienteOrdenDisponible(
                    ordenesReservados
                );


            ordenesReservados.add(
                orden
            );


            pendientes.push({

                id:
                    crypto.randomUUID(),

                archivo,

                vistaPrevia:
                    URL.createObjectURL(
                        archivo
                    ),

                orden,

                es_principal:
                    !existePrincipal

            });


            if (
                !existePrincipal
            ) {

                existePrincipal =
                    true;

            }

        }


        this.imagenesPendientes.set(
            pendientes
        );


        /*
         * Permite volver a seleccionar
         * posteriormente el mismo archivo.
         */
        input.value =
            '';

    }
    private siguienteOrdenDisponible(
        ocupados: Set<number>
    ): number {

        let orden =
            1;


        while (
            ocupados.has(
                orden
            )
        ) {

            orden++;

        }


        return orden;
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


        /*
        |--------------------------------------------------------------------------
        | Datos
        |--------------------------------------------------------------------------
        */

        const id =
            this.idEditando();


        /*
        |--------------------------------------------------------------------------
        | CREACIÓN MÚLTIPLE
        |--------------------------------------------------------------------------
        */

        if (
            id === null
        ) {

            const pendientes =
                this.imagenesPendientes();


            if (
                pendientes.length === 0
            ) {

                this.agregarErrorCampo(
                    'imagen',
                    'Debe seleccionar al menos una imagen.'
                );

                return;

            }


            /*
            |--------------------------------------------------------------------------
            | Validar órdenes
            |--------------------------------------------------------------------------
            */

            for (
                const imagen of pendientes
            ) {

                if (
                    !Number.isInteger(
                        imagen.orden
                    )
                    ||
                    imagen.orden < 1
                ) {

                    this.agregarErrorCampo(
                        'orden',
                        'El orden debe ser un número entero mayor o igual a 1.'
                    );

                    return;

                }

            }


            const data =
                pendientes.map(
                    imagen => ({

                        id_producto:
                            this.idProducto(),

                        imagen:
                            imagen.archivo,

                        orden:
                            imagen.orden,

                        es_principal:
                            imagen.es_principal

                    })
                );


            this.guardando.set(
                true
            );


            from(
                data
            )
                .pipe(

                    /*
                    |--------------------------------------------------------------------------
                    | Se cargan una por una
                    |--------------------------------------------------------------------------
                    */

                    concatMap(
                        imagen =>

                            this.imagenService
                                .crear(
                                    imagen
                                )
                    ),

                    toArray(),

                    finalize(
                        () => {

                            this.guardando.set(
                                false
                            );

                        }
                    )

                )
                .subscribe({

                    next:
                        () => {

                            this.cerrarFormulario(
                                true
                            );


                            this.cargarImagenes();

                        },


                    error:
                        (
                            error:
                                HttpErrorResponse
                        ) => {

                            this.procesarError(
                                error
                            );

                        }

                });


            return;

        }


        /*
        |--------------------------------------------------------------------------
        | EDICIÓN INDIVIDUAL
        |--------------------------------------------------------------------------
        */

        const imagen =
            this.formData
                .imagen;


        const orden =
            Number(
                this.formData
                    .orden
            );


        /*
        |--------------------------------------------------------------------------
        | Validación orden
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | Detener si existen errores
        |--------------------------------------------------------------------------
        */

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

            imagen,

            orden,

            es_principal:
                this.formData
                    .es_principal

        };


        /*
        |--------------------------------------------------------------------------
        | Actualizar imagen existente
        |--------------------------------------------------------------------------
        */

        this.guardando.set(
            true
        );


        this.imagenService
            .actualizar(
                id,
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

                next:
                    () => {

                        this.cerrarFormulario(
                            true
                        );


                        this.cargarImagenes();

                    },


                error:
                    (
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
            !ruta
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
            `${this.backendUrl}/${ruta.replace(
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

    ordenesDisponibles(
        actual:
            ImagenPendiente
    ): number[] {

        const ocupados =
            new Set<number>();


        /*
         * Imágenes ya guardadas.
         */
        this.imagenes()
            .forEach(
                imagen => {

                    ocupados.add(
                        Number(
                            imagen.orden
                        )
                    );

                }
            );


        /*
         * Otras imágenes pendientes.
         */
        this.imagenesPendientes()
            .filter(
                imagen =>
                    imagen.id
                    !== actual.id
            )
            .forEach(
                imagen => {

                    ocupados.add(
                        imagen.orden
                    );

                }
            );


        const maximoActual =
            Math.max(

                0,

                ...this.imagenes()
                    .map(
                        imagen =>
                            Number(
                                imagen.orden
                            )
                    ),

                ...this.imagenesPendientes()
                    .map(
                        imagen =>
                            imagen.orden
                    )

            );


        const limite =
            Math.max(

                maximoActual + 3,

                this.imagenes().length
                +
                this.imagenesPendientes().length
                +
                1

            );


        return Array.from(
            {
                length:
                    limite
            },

            (
                _,
                indice
            ) =>
                indice + 1
        )
            .filter(
                orden =>
                    orden === actual.orden
                    ||
                    !ocupados.has(
                        orden
                    )
            );

    }

    cambiarOrdenPendiente(
        id: string,
        orden: number | string
    ): void {

        const nuevoOrden =
            Number(
                orden
            );


        this.imagenesPendientes.update(
            imagenes =>

                imagenes.map(
                    imagen =>

                        imagen.id === id

                            ? {
                                ...imagen,
                                orden:
                                    nuevoOrden
                            }

                            : imagen
                )
        );

    }

    marcarPrincipalPendiente(
        id: string
    ): void {

        this.imagenesPendientes.update(
            imagenes =>

                imagenes.map(
                    imagen => ({

                        ...imagen,

                        es_principal:
                            imagen.id
                            === id

                    })
                )
        );

    }

    eliminarPendiente(
        id: string
    ): void {

        const imagen =
            this.imagenesPendientes()
                .find(
                    item =>
                        item.id === id
                );


        if (
            imagen
        ) {

            URL.revokeObjectURL(
                imagen.vistaPrevia
            );

        }


        this.imagenesPendientes.update(
            imagenes =>

                imagenes.filter(
                    item =>
                        item.id !== id
                )
        );

    }



}