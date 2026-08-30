import {
    Component,
    computed,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
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
    Camera,
    LucideAngularModule,
    Save,
    UserRound,
    X
} from 'lucide-angular';

import {
    UsuarioService
} from '../../../core/services/seguridad/usuario.service';

import {
    RolService
} from '../../../core/services/seguridad/rol.service';

import {
    SucursalService
} from '../../../core/services/organizacion/sucursal.service';

import {
    LanguageService
} from '../../../core/services/language.service';

import {
    RolResumen,
    Usuario
} from '../../../shared/models/user.model';

import {
    Sucursal
} from '../../../shared/models/sucursal.model';

import {
    ModoFormularioUsuario,
    UsuarioFormData
} from '../../../shared/models/usuario-form.model';

import {
    SessionService
} from '../../../core/services/session.service';


@Component({
    selector:
        'app-user-form-modal',

    standalone:
        true,

    imports: [
        CommonModule,
        FormsModule,
        LucideAngularModule
    ],

    templateUrl:
        './user-form-modal.html',

    styleUrl:
        './user-form-modal.css'
})
export class UserFormModal
    implements OnInit, OnDestroy {

    /*
    |--------------------------------------------------------------------------
    | Entradas
    |--------------------------------------------------------------------------
    */

    @Input({
        required:
            true
    })
    modo:
        ModoFormularioUsuario =
        'CREAR';


    @Input()
    usuario:
        Usuario | null =
        null;


    /*
    |--------------------------------------------------------------------------
    | Salidas
    |--------------------------------------------------------------------------
    */

    @Output()
    cerrar =
        new EventEmitter<void>();


    @Output()
    guardado =
        new EventEmitter<
            Usuario
        >();


    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly usuarioService =
        inject(
            UsuarioService
        );


    private readonly rolService =
        inject(
            RolService
        );


    private readonly sucursalService =
        inject(
            SucursalService
        );


    private readonly languageService =
        inject(
            LanguageService
        );

    private readonly sessionService =
        inject(
            SessionService
        );

    /*
    |--------------------------------------------------------------------------
    | Estado
    |--------------------------------------------------------------------------
    */

    readonly cargandoCatalogos =
        signal(
            true
        );


    readonly guardando =
        signal(
            false
        );


    readonly errorMensaje =
        signal(
            ''
        );


    readonly erroresFormulario =
        signal<
            Record<
                string,
                string[]
            >
        >(
            {}
        );


    readonly roles =
        signal<
            RolResumen[]
        >(
            []
        );


    readonly sucursales =
        signal<
            Sucursal[]
        >(
            []
        );


    previewFoto:
        string | null =
        null;


    private previewTemporal:
        string | null =
        null;


    readonly rolesAsignables =
        computed(
            () => {

                const rolActual =
                    this.sessionService
                        .rol();


                if (
                    !rolActual
                ) {

                    return [];

                }


                switch (
                rolActual.nombre
                ) {

                    case 'SuperAdministrador':

                        return this.roles()
                            .filter(
                                rol =>
                                    rol.nivel
                                    <=
                                    rolActual.nivel
                            );


                    case 'Administrador':

                        return this.roles()
                            .filter(
                                rol =>
                                    rol.nivel
                                    <=
                                    rolActual.nivel
                            );


                    case 'Gerente':

                        return this.roles()
                            .filter(
                                rol =>
                                    rol.nivel
                                    <
                                    rolActual.nivel
                            );


                    default:

                        return [];

                }

            }
        );


    /*
    |--------------------------------------------------------------------------
    | Formulario
    |--------------------------------------------------------------------------
    */

    form:
        UsuarioFormData = {

            id_rol:
                null,

            id_sucursal:
                null,

            ci:
                '',

            nombre:
                '',

            apellido_paterno:
                '',

            apellido_materno:
                '',

            correo:
                '',

            telefono:
                '',

            direccion:
                '',

            foto:
                null

        };


    /*
    |--------------------------------------------------------------------------
    | Iconos
    |--------------------------------------------------------------------------
    */

    readonly Camera =
        Camera;


    readonly Save =
        Save;


    readonly UserRound =
        UserRound;


    readonly X =
        X;


    /*
    |--------------------------------------------------------------------------
    | Inicialización
    |--------------------------------------------------------------------------
    */

    ngOnInit(): void {

        this.cargarFormulario();

        this.cargarCatalogos();

    }


    ngOnDestroy(): void {

        this.liberarPreview();

    }


    /*
    |--------------------------------------------------------------------------
    | Formulario
    |--------------------------------------------------------------------------
    */

    private cargarFormulario(): void {

        if (
            this.modo
            !== 'EDITAR'
            ||
            !this.usuario
        ) {

            return;

        }


        this.form = {

            id_rol:
                this.usuario.id_rol,

            id_sucursal:
                this.usuario.id_sucursal,

            ci:
                this.usuario.ci,

            nombre:
                this.usuario.nombre,

            apellido_paterno:
                this.usuario.apellido_paterno,

            apellido_materno:
                this.usuario.apellido_materno
                ?? '',

            correo:
                this.usuario.correo
                ?? '',

            telefono:
                this.usuario.telefono
                ?? '',

            direccion:
                this.usuario.direccion
                ?? '',

            foto:
                null

        };


        this.previewFoto =
            this.usuario.foto;

    }


    /*
    |--------------------------------------------------------------------------
    | Catálogos
    |--------------------------------------------------------------------------
    */

    private cargarCatalogos(): void {

        this.cargandoCatalogos.set(
            true
        );


        forkJoin({

            roles:
                this.rolService
                    .listar(),

            sucursales:
                this.sucursalService
                    .listar()

        })
            .pipe(

                finalize(
                    () =>
                        this.cargandoCatalogos
                            .set(
                                false
                            )
                )

            )
            .subscribe({

                next:
                    response => {

                        this.roles.set(
                            response
                                .roles
                                .data
                        );


                        this.sucursales.set(
                            response
                                .sucursales
                                .data
                        );

                    },


                error:
                    (
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
    | Foto
    |--------------------------------------------------------------------------
    */

    seleccionarFoto(
        event:
            Event
    ): void {

        const input =
            event.target as HTMLInputElement;


        const archivo =
            input.files
                ?.item(
                    0
                );


        if (
            !archivo
        ) {

            return;

        }


        const permitidos = [

            'image/jpeg',

            'image/png',

            'image/webp'

        ];


        if (
            !permitidos.includes(
                archivo.type
            )
        ) {

            this.errorMensaje.set(
                this.t(
                    'La fotografía debe ser JPG, PNG o WEBP.',
                    'The photo must be JPG, PNG or WEBP.'
                )
            );


            input.value =
                '';


            return;

        }


        if (
            archivo.size
            >
            2 * 1024 * 1024
        ) {

            this.errorMensaje.set(
                this.t(
                    'La fotografía no puede superar los 2 MB.',
                    'The photo cannot exceed 2 MB.'
                )
            );


            input.value =
                '';


            return;

        }


        this.liberarPreview();


        this.form.foto =
            archivo;


        this.previewTemporal =
            URL.createObjectURL(
                archivo
            );


        this.previewFoto =
            this.previewTemporal;


        this.errorMensaje.set(
            ''
        );

    }


    private liberarPreview(): void {

        if (
            this.previewTemporal
        ) {

            URL.revokeObjectURL(
                this.previewTemporal
            );


            this.previewTemporal =
                null;

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Guardar
    |--------------------------------------------------------------------------
    */

    guardar(): void {

        if (
            this.guardando()
            ||
            !this.formularioValido()
        ) {

            return;

        }


        this.guardando.set(
            true
        );


        this.errorMensaje.set(
            ''
        );


        this.erroresFormulario.set(
            {}
        );


        const request$ =

            this.modo
                === 'CREAR'

                ? this.usuarioService
                    .crear(
                        this.form
                    )

                : this.usuarioService
                    .actualizar(

                        this.usuario!
                            .id_usuario,

                        this.form

                    );


        request$
            .pipe(

                finalize(
                    () =>
                        this.guardando
                            .set(
                                false
                            )
                )

            )
            .subscribe({

                next:
                    usuario => {

                        this.guardado.emit(
                            usuario
                        );

                    },


                error:
                    (
                        error:
                            HttpErrorResponse
                    ) => {

                        if (
                            error.status
                            === 422
                            &&
                            error.error
                                ?.errors
                        ) {

                            this.erroresFormulario.set(
                                error.error.errors
                            );

                        }


                        this.errorMensaje.set(
                            this.mensajeError(
                                error
                            )
                        );

                    }

            });

    }


    formularioValido(): boolean {

        return (

            this.form.id_rol
            !== null

            &&

            this.form.id_sucursal
            !== null

            &&

            this.form.ci
                .trim()
                .length
            > 0

            &&

            this.form.nombre
                .trim()
                .length
            > 0

            &&

            this.form
                .apellido_paterno
                .trim()
                .length
            > 0

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error de campo
    |--------------------------------------------------------------------------
    */

    errorCampo(
        campo:
            string
    ): string | null {

        return (
            this.erroresFormulario()[
                campo
            ]
                ?.at(
                    0
                )
            ?? null
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Presentación
    |--------------------------------------------------------------------------
    */

    titulo(): string {

        return this.modo
            === 'CREAR'

            ? this.t(
                'Registrar usuario',
                'Register user'
            )

            : this.t(
                'Editar usuario',
                'Edit user'
            );

    }


    textoBoton(): string {

        return this.modo
            === 'CREAR'

            ? this.t(
                'Registrar usuario',
                'Register user'
            )

            : this.t(
                'Guardar cambios',
                'Save changes'
            );

    }


    iniciales(): string {

        const nombre =
            this.form.nombre
                .trim()
                .charAt(
                    0
                )
                .toUpperCase();


        const apellido =
            this.form
                .apellido_paterno
                .trim()
                .charAt(
                    0
                )
                .toUpperCase();


        return (
            `${nombre}${apellido}`
            || 'U'
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Idioma
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


    /*
    |--------------------------------------------------------------------------
    | Errores
    |--------------------------------------------------------------------------
    */

    private mensajeError(
        error: HttpErrorResponse
    ): string {
    
        /*
        |--------------------------------------------------------------------------
        | Error de conexión
        |--------------------------------------------------------------------------
        */
    
        if (
            error.status === 0
        ) {
    
            return this.t(
                'No fue posible conectar con el servidor.',
                'Unable to connect to the server.'
            );
    
        }
    
    
        /*
        |--------------------------------------------------------------------------
        | Error de permisos
        |--------------------------------------------------------------------------
        */
    
        if (
            error.status === 403
        ) {
    
            return this.t(
                'No tiene permisos para realizar esta operación.',
                'You do not have permission to perform this operation.'
            );
    
        }
    
    
        /*
        |--------------------------------------------------------------------------
        | Validación de campos
        |--------------------------------------------------------------------------
        */
    
        const errores =
            error.error
                ?.errors;
    
    
        if (
            error.status === 422
            &&
            errores
            &&
            typeof errores === 'object'
        ) {
    
            return this.t(
                'Revise los datos ingresados.',
                'Please review the entered data.'
            );
    
        }
    
    
        /*
        |--------------------------------------------------------------------------
        | Mensaje enviado por el backend
        |--------------------------------------------------------------------------
        */
    
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
    
    
        /*
        |--------------------------------------------------------------------------
        | Error genérico
        |--------------------------------------------------------------------------
        */
    
        return this.t(
            'No fue posible completar la operación.',
            'The operation could not be completed.'
        );
    
    }

}