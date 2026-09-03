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
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import {
    DomSanitizer,
    SafeResourceUrl
} from '@angular/platform-browser';

import {
    HttpErrorResponse
} from '@angular/common/http';

import {
    finalize,
    forkJoin
} from 'rxjs';

import {
    Building2,
    CircleAlert,
    CircleCheck,
    LoaderCircle,
    LucideAngularModule,
    Mail,
    MapPin,
    Phone,
    Send
} from 'lucide-angular';

import {
    LanguageService
} from '../../core/services/language.service';

import {
    SeoService
} from '../../core/services/seo.service';

import {
    EmpresaPublicaService
} from '../../core/services/publico/empresa-publica.service';

import {
    SucursalPublicaService
} from '../../core/services/publico/sucursal-publica.service';

import {
    ContactoPublicoService
} from '../../core/services/publico/contacto-publico.service';

import {
    EmpresaPublica
} from '../../shared/models/empresa-publica.model';

import {
    SucursalPublica
} from '../../shared/models/sucursal-publica.model';

import {
    ContactoPublicoRequest,
    MotivoContacto
} from '../../shared/models/contacto-publico.model';

import {
    ViewChild
} from '@angular/core';

import {
    TurnstileComponent
} from '../../shared/components/turnstile/turnstile.component';

import {
    environment
} from '../../../environments/environment';


@Component({
    selector:
        'app-contact',

    standalone:
        true,

    imports: [
        CommonModule,
        ReactiveFormsModule,
        LucideAngularModule,
        TurnstileComponent
    ],

    templateUrl:
        './contact.html',

    styleUrl:
        './contact.css'
})
export class Contact
    implements OnInit {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly fb =
        inject(
            FormBuilder
        );


    private readonly languageService =
        inject(
            LanguageService
        );


    private readonly seoService =
        inject(
            SeoService
        );


    private readonly contactoService =
        inject(
            ContactoPublicoService
        );


    private readonly empresaService =
        inject(
            EmpresaPublicaService
        );


    private readonly sucursalService =
        inject(
            SucursalPublicaService
        );


    private readonly sanitizer =
        inject(
            DomSanitizer
        );


    /*
    |--------------------------------------------------------------------------
    | Formulario
    |--------------------------------------------------------------------------
    */

    readonly form =
        this.fb.nonNullable.group({

            nombre: [
                '',
                [
                    Validators.required,
                    Validators.minLength(
                        2
                    ),
                    Validators.maxLength(
                        100
                    )
                ]
            ],

            correo: [
                '',
                [
                    Validators.required,
                    Validators.email,
                    Validators.maxLength(
                        150
                    )
                ]
            ],

            telefono: [
                '',
                [
                    Validators.maxLength(
                        30
                    )
                ]
            ],

            motivo: [
                '' as MotivoContacto | '',
                [
                    Validators.required
                ]
            ],

            mensaje: [
                '',
                [
                    Validators.required,
                    Validators.minLength(
                        10
                    ),
                    Validators.maxLength(
                        2000
                    )
                ]
            ]

        });


    /*
    |--------------------------------------------------------------------------
    | Empresa
    |--------------------------------------------------------------------------
    */

    readonly empresa =
        signal<
            EmpresaPublica | null
        >(
            null
        );


    /*
    |--------------------------------------------------------------------------
    | Sucursales
    |--------------------------------------------------------------------------
    */

    readonly sucursales =
        signal<
            SucursalPublica[]
        >(
            []
        );


    readonly sucursalSeleccionada =
        signal<
            SucursalPublica | null
        >(
            null
        );


    /*
    |--------------------------------------------------------------------------
    | Datos de contacto
    |--------------------------------------------------------------------------
    */

    readonly telefonoContacto =
        computed(
            () =>
                this
                    .sucursalSeleccionada()
                    ?.telefono
                ??
                this
                    .empresa()
                    ?.telefono
                ??
                null
        );


    readonly correoEmpresa =
        computed(
            () =>
                this
                    .empresa()
                    ?.correo
                ??
                null
        );


    /*
    |--------------------------------------------------------------------------
    | Turnstile
    |--------------------------------------------------------------------------
    */

    readonly turnstileSiteKey =
        environment
            .turnstileSiteKey;

    readonly turnstileAction =
        environment
            .turnstileAction;


    readonly turnstileToken =
        signal(
            ''
        );


    @ViewChild(
        TurnstileComponent
    )
    private turnstileComponent?:
        TurnstileComponent;


    actualizarTurnstileToken(
        token:
            string
    ): void {

        this.turnstileToken
            .set(
                token
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Mapa
    |--------------------------------------------------------------------------
    */

    readonly mapaSeguro =
        computed<
            SafeResourceUrl | null
        >(
            () => {

                const url =
                    this
                        .sucursalSeleccionada()
                        ?.url_maps_embed;


                if (
                    !url
                    ||
                    !this.esUrlMapsEmbedValida(
                        url
                    )
                ) {

                    return null;

                }


                return this.sanitizer
                    .bypassSecurityTrustResourceUrl(
                        url
                    );

            }
        );


    /*
    |--------------------------------------------------------------------------
    | Estados
    |--------------------------------------------------------------------------
    */

    readonly cargandoDatos =
        signal(
            false
        );


    readonly enviando =
        signal(
            false
        );


    readonly mensajeExito =
        signal(
            ''
        );


    readonly mensajeError =
        signal(
            ''
        );


    readonly errorDatos =
        signal(
            ''
        );


    /*
    |--------------------------------------------------------------------------
    | Iconos
    |--------------------------------------------------------------------------
    */

    readonly Building2 =
        Building2;

    readonly CircleAlert =
        CircleAlert;

    readonly CircleCheck =
        CircleCheck;

    readonly LoaderCircle =
        LoaderCircle;

    readonly Mail =
        Mail;

    readonly MapPin =
        MapPin;

    readonly Phone =
        Phone;

    readonly Send =
        Send;


    /*
    |--------------------------------------------------------------------------
    | Inicio
    |--------------------------------------------------------------------------
    */

    ngOnInit(): void {

        this.seoService
            .configurar({

                title:
                    'Contacto | Irriterra S.R.L.',

                description:
                    'Contacta con Irriterra S.R.L. para consultas sobre productos, riego, maquinaria agrícola, repuestos y soluciones para el sector agrícola en Bolivia.',

                path:
                    '/contactos'

            });


        this.cargarDatos();

    }


    /*
    |--------------------------------------------------------------------------
    | Cargar empresa y sucursales
    |--------------------------------------------------------------------------
    */

    private cargarDatos(): void {

        if (
            this.cargandoDatos()
        ) {

            return;

        }


        this.cargandoDatos.set(
            true
        );

        this.errorDatos.set(
            ''
        );


        forkJoin({

            empresa:
                this.empresaService
                    .obtener(),

            sucursales:
                this.sucursalService
                    .listar()

        })
            .pipe(

                finalize(
                    () =>
                        this.cargandoDatos
                            .set(
                                false
                            )
                )

            )
            .subscribe({

                next:
                    response => {

                        this.empresa.set(
                            response
                                .empresa
                                .data
                        );


                        const sucursales =
                            response
                                .sucursales
                                .data
                            ?? [];


                        this.sucursales.set(
                            sucursales
                        );


                        this.sucursalSeleccionada
                            .set(

                                sucursales.length
                                    > 0
                                    ? sucursales[0]
                                    : null

                            );

                    },

                error:
                    () => {

                        this.errorDatos.set(

                            this.t(
                                'No fue posible cargar la información de contacto.',
                                'Unable to load contact information.'
                            )

                        );

                    }

            });

    }


    /*
    |--------------------------------------------------------------------------
    | Enviar formulario
    |--------------------------------------------------------------------------
    */

    enviar(): void {

        if (
            this.form.invalid
            ||
            this.enviando()
            ||
            !this.turnstileToken()
        ) {

            this.form
                .markAllAsTouched();

            return;

        }


        const valores =
            this.form
                .getRawValue();


        const request:
            ContactoPublicoRequest = {

            nombre:
                valores.nombre
                    .trim(),

            correo:
                valores.correo
                    .trim(),

            telefono:
                this.valorNullable(
                    valores.telefono
                ),

            motivo:
                valores.motivo as MotivoContacto,

            mensaje:
                valores.mensaje
                    .trim(),

            turnstile_token:
                this.turnstileToken()

        };


        this.enviando.set(
            true
        );

        this.mensajeExito.set(
            ''
        );

        this.mensajeError.set(
            ''
        );


        this.contactoService
            .enviar(
                request
            )
            .pipe(

                finalize(
                    () => {

                        this.enviando
                            .set(
                                false
                            );


                        this.turnstileToken
                            .set(
                                ''
                            );


                        this.turnstileComponent
                            ?.reset();

                    }
                )

            )
            .subscribe({

                next:
                    () => {

                        this.mensajeExito.set(

                            this.t(
                                'Tu mensaje fue enviado correctamente. Nos pondremos en contacto contigo.',
                                'Your message was sent successfully. We will contact you soon.'
                            )

                        );


                        this.form.reset({

                            nombre:
                                '',

                            correo:
                                '',

                            telefono:
                                '',

                            motivo:
                                '',

                            mensaje:
                                ''

                        });

                    },

                error:
                    (
                        error:
                            HttpErrorResponse
                    ) => {

                        this.mensajeError.set(
                            this.obtenerMensajeError(
                                error
                            )
                        );

                    }

            });

    }


    /*
    |--------------------------------------------------------------------------
    | Seleccionar sucursal
    |--------------------------------------------------------------------------
    */

    seleccionarSucursal(
        sucursal:
            SucursalPublica
    ): void {

        this.sucursalSeleccionada
            .set(
                sucursal
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Sucursal seleccionada
    |--------------------------------------------------------------------------
    */

    esSucursalSeleccionada(
        sucursal:
            SucursalPublica
    ): boolean {

        return this
            .sucursalSeleccionada()
            ?.id_sucursal
            ===
            sucursal.id_sucursal;

    }


    /*
    |--------------------------------------------------------------------------
    | Mensajes de error HTTP
    |--------------------------------------------------------------------------
    */

    private obtenerMensajeError(
        error:
            HttpErrorResponse
    ): string {

        if (
            error.status
            === 429
        ) {

            return this.t(
                'Has enviado demasiados mensajes. Espera un momento antes de volver a intentarlo.',
                'Too many messages were sent. Please wait before trying again.'
            );

        }


        if (
            error.status
            === 422
        ) {

            return this.t(
                'Revisa los datos ingresados antes de enviar el mensaje.',
                'Please review the information entered before sending the message.'
            );

        }


        if (
            error.status
            === 503
        ) {

            return this.t(
                'No fue posible enviar el mensaje en este momento. Inténtalo nuevamente más tarde.',
                'The message could not be sent at this time. Please try again later.'
            );

        }


        return this.t(
            'Ocurrió un problema al enviar el mensaje. Inténtalo nuevamente.',
            'There was a problem sending the message. Please try again.'
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Nullable
    |--------------------------------------------------------------------------
    */

    private valorNullable(
        valor:
            string
            | null
            | undefined
    ): string | null {

        const limpio =
            valor
                ?.trim()
            ?? '';


        return limpio
            ? limpio
            : null;

    }


    /*
    |--------------------------------------------------------------------------
    | Validar Google Maps Embed
    |--------------------------------------------------------------------------
    */

    private esUrlMapsEmbedValida(
        valor:
            string
    ): boolean {

        try {

            const url =
                new URL(
                    valor
                );


            if (
                url.protocol
                !== 'https:'
            ) {

                return false;

            }


            const host =
                url.hostname
                    .toLowerCase();


            if (
                (
                    host
                    === 'www.google.com'
                    ||
                    host
                    === 'google.com'
                )
                &&
                url.pathname
                    .startsWith(
                        '/maps/embed'
                    )
            ) {

                return true;

            }


            if (
                host
                === 'maps.google.com'
                &&
                url.pathname
                    .startsWith(
                        '/maps'
                    )
            ) {

                return true;

            }


            return false;

        } catch {

            return false;

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Traducción
    |--------------------------------------------------------------------------
    */

    t(
        es:
            string,
        en:
            string
    ): string {

        return this.languageService
            .t(
                es,
                en
            );

    }

}