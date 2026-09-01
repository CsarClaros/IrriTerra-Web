import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  finalize
} from 'rxjs';

import {
  Building2,
  Clock3,
  IdCard,
  LucideAngularModule,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  ShieldCheck,
  User,
  UserRound,
  Camera,
  Pencil,
  Save,
  X,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole
} from 'lucide-angular';

import {
  AuthService
} from '../../core/services/auth.service';

import {
  SessionService
} from '../../core/services/session.service';

import {
  LanguageService
} from '../../core/services/language.service';

import {
  FormsModule
} from '@angular/forms';


import {
  Router
} from '@angular/router';

import {
  CambiarContrasenaRequest
} from '../../shared/models/auth.model';


@Component({
  selector:
    'app-settings',

  standalone:
    true,

  imports: [
    LucideAngularModule,
    FormsModule
  ],

  templateUrl:
    './settings.html',

  styleUrl:
    './settings.css'
})
export class Settings {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly authService =
    inject(
      AuthService
    );


  private readonly sessionService =
    inject(
      SessionService
    );


  private readonly languageService =
    inject(
      LanguageService
    );

  private readonly router =
    inject(
      Router
    );


  /*
  |--------------------------------------------------------------------------
  | Estado
  |--------------------------------------------------------------------------
  */

  readonly cargando =
    signal(
      false
    );


  readonly errorMensaje =
    signal(
      ''
    );

  readonly editando =
    signal(
      false
    );


  readonly guardando =
    signal(
      false
    );


  readonly subiendoFoto =
    signal(
      false
    );


  readonly mensajeExito =
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


  formPerfil = {

    correo:
      '',

    telefono:
      '',

    direccion:
      ''

  };

  readonly mostrarCambioContrasena =
    signal(
      false
    );


  readonly guardandoContrasena =
    signal(
      false
    );


  readonly mostrarContrasenaActual =
    signal(
      false
    );


  readonly mostrarNuevaContrasena =
    signal(
      false
    );


  readonly mostrarConfirmacion =
    signal(
      false
    );


  readonly errorContrasena =
    signal(
      ''
    );


  readonly erroresContrasena =
    signal<
      Record<
        string,
        string[]
      >
    >(
      {}
    );

  formContrasena:
    CambiarContrasenaRequest = {

      contrasena_actual:
        '',

      nueva_contrasena:
        '',

      nueva_contrasena_confirmation:
        ''

    };


  /*
  |--------------------------------------------------------------------------
  | Usuario
  |--------------------------------------------------------------------------
  */

  readonly usuario =
    this.sessionService
      .usuario;


  readonly nombreCompleto =
    computed(
      () => {

        const usuario =
          this.usuario();


        if (
          !usuario
        ) {

          return '-';

        }


        return [

          usuario.nombre,

          usuario.apellido_paterno,

          usuario.apellido_materno

        ]
          .filter(
            Boolean
          )
          .join(
            ' '
          );

      }
    );


  readonly iniciales =
    computed(
      () => {

        const usuario =
          this.usuario();


        if (
          !usuario
        ) {

          return 'U';

        }


        const nombre =
          usuario.nombre
            ?.trim()
            .charAt(0)
            .toUpperCase()
          ?? '';


        const apellido =
          usuario
            .apellido_paterno
            ?.trim()
            .charAt(0)
            .toUpperCase()
          ?? '';


        return (
          `${nombre}${apellido}`
          || 'U'
        );

      }
    );


  readonly rol =
    computed(
      () =>
        this.sessionService
          .rol()
          ?.nombre
        ?? this.t(
          'Sin rol asignado',
          'No role assigned'
        )
    );


  readonly sucursal =
    computed(
      () =>
        this.sessionService
          .sucursal()
          ?.nombre
        ?? this.t(
          'Sin sucursal asignada',
          'No branch assigned'
        )
    );


  readonly cantidadPermisos =
    computed(
      () =>
        this.sessionService
          .permisos()
          .length
    );


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly User =
    User;


  readonly UserRound =
    UserRound;


  readonly IdCard =
    IdCard;


  readonly Mail =
    Mail;


  readonly Phone =
    Phone;


  readonly MapPin =
    MapPin;


  readonly Building2 =
    Building2;


  readonly ShieldCheck =
    ShieldCheck;


  readonly Clock3 =
    Clock3;


  readonly RefreshCcw =
    RefreshCcw;

  readonly Camera =
    Camera;


  readonly Pencil =
    Pencil;


  readonly Save =
    Save;


  readonly X =
    X;

  readonly KeyRound =
    KeyRound;

  readonly LockKeyhole =
    LockKeyhole;

  readonly Eye =
    Eye;

  readonly EyeOff =
    EyeOff;


  /*
  |--------------------------------------------------------------------------
  | Actualizar perfil
  |--------------------------------------------------------------------------
  */

  refrescarPerfil(): void {

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


    this.authService
      .me()
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
  | Estado
  |--------------------------------------------------------------------------
  */

  nombreEstado(
    estado:
      string | null | undefined
  ): string {

    switch (
    estado
    ) {

      case 'A':

        return this.t(
          'Activo',
          'Active'
        );


      case 'I':

        return this.t(
          'Inactivo',
          'Inactive'
        );


      default:

        return '-';

    }

  }


  claseEstado(
    estado:
      string | null | undefined
  ): string {

    switch (
    estado
    ) {

      case 'A':

        return (
          'bg-emerald-100 text-emerald-700'
        );


      case 'I':

        return (
          'bg-red-100 text-red-700'
        );


      default:

        return (
          'bg-gray-100 text-gray-700'
        );

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Fecha
  |--------------------------------------------------------------------------
  */

  formatearFecha(
    fecha:
      string | null | undefined
  ): string {

    if (
      !fecha
    ) {

      return this.t(
        'Sin registro',
        'No record'
      );

    }


    const date =
      new Date(
        fecha
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return fecha;

    }


    return new Intl
      .DateTimeFormat(
        'es-BO',
        {
          dateStyle:
            'medium',

          timeStyle:
            'short'
        }
      )
      .format(
        date
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
    error:
      HttpErrorResponse
  ): string {

    if (
      error.status === 0
    ) {

      return this.t(
        'No fue posible conectar con el servidor.',
        'Unable to connect to the server.'
      );

    }


    if (
      error.status === 401
    ) {

      return this.t(
        'La sesión ya no es válida.',
        'The session is no longer valid.'
      );

    }


    if (
      error.status === 403
    ) {

      return this.t(
        'No tiene permisos para consultar esta información.',
        'You do not have permission to view this information.'
      );

    }


    if (
      typeof error.error
        ?.message
      === 'string'
    ) {

      return error.error.message;

    }


    return this.t(
      'No fue posible actualizar la información del perfil.',
      'Unable to update profile information.'
    );

  }

  editarPerfil(): void {

    const usuario =
      this.usuario();


    if (
      !usuario
    ) {

      return;

    }


    this.formPerfil = {

      correo:
        usuario.correo
        ?? '',

      telefono:
        usuario.telefono
        ?? '',

      direccion:
        usuario.direccion
        ?? ''

    };


    this.errorMensaje.set(
      ''
    );


    this.erroresFormulario.set(
      {}
    );


    this.mensajeExito.set(
      ''
    );


    this.editando.set(
      true
    );

  }


  cancelarEdicion(): void {

    this.editando.set(
      false
    );


    this.erroresFormulario.set(
      {}
    );

  }

  guardarPerfil(): void {

    if (
      this.guardando()
    ) {

      return;

    }


    this.guardando.set(
      true
    );


    this.errorMensaje.set(
      ''
    );


    this.mensajeExito.set(
      ''
    );


    this.erroresFormulario.set(
      {}
    );


    this.authService
      .actualizarPerfil({

        correo:
          this.normalizarTexto(
            this.formPerfil.correo
          ),

        telefono:
          this.normalizarTexto(
            this.formPerfil.telefono
          ),

        direccion:
          this.normalizarTexto(
            this.formPerfil.direccion
          )

      })
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

          this.editando.set(
            false
          );


          this.mensajeExito.set(
            this.t(
              'Perfil actualizado correctamente.',
              'Profile updated successfully.'
            )
          );

        },


        error: (
          error:
            HttpErrorResponse
        ) => {

          if (
            error.status === 422
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
  seleccionarFoto(
    event:
      Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    const foto =
      input.files
        ?.item(
          0
        );


    input.value =
      '';


    if (
      !foto
    ) {

      return;

    }


    const tiposPermitidos = [

      'image/jpeg',

      'image/png',

      'image/webp'

    ];


    if (
      !tiposPermitidos
        .includes(
          foto.type
        )
    ) {

      this.errorMensaje.set(
        this.t(
          'La fotografía debe ser JPG, PNG o WEBP.',
          'The photo must be JPG, PNG or WEBP.'
        )
      );


      return;

    }


    if (
      foto.size
      >
      2 * 1024 * 1024
    ) {

      this.errorMensaje.set(
        this.t(
          'La fotografía no puede superar los 2 MB.',
          'The photo cannot exceed 2 MB.'
        )
      );


      return;

    }


    this.subiendoFoto.set(
      true
    );


    this.errorMensaje.set(
      ''
    );


    this.mensajeExito.set(
      ''
    );


    this.authService
      .actualizarFotoPerfil(
        foto
      )
      .pipe(

        finalize(
          () => {

            this.subiendoFoto.set(
              false
            );

          }
        )

      )
      .subscribe({

        next: () => {

          this.mensajeExito.set(
            this.t(
              'Fotografía actualizada correctamente.',
              'Photo updated successfully.'
            )
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

  /**-
   * 
   * 
   * HELPERS
   * 
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


  private normalizarTexto(
    valor:
      string
  ): string | null {

    const limpio =
      valor.trim();


    return (
      limpio.length
        ? limpio
        : null
    );

  }

  errorCampoContrasena(
    campo:
      string
  ): string | null {

    return (
      this.erroresContrasena()[
      campo
      ]?.[0]
      ?? null
    );

  }


  // Formulario

  abrirCambioContrasena():
    void {

    this.limpiarFormularioContrasena();

    this.mostrarCambioContrasena
      .set(
        true
      );

  }

  cerrarCambioContrasena():
    void {

    if (
      this.guardandoContrasena()
    ) {

      return;

    }


    this.mostrarCambioContrasena
      .set(
        false
      );


    this.limpiarFormularioContrasena();

  }

  private limpiarFormularioContrasena():
    void {

    this.formContrasena = {

      contrasena_actual:
        '',

      nueva_contrasena:
        '',

      nueva_contrasena_confirmation:
        ''

    };


    this.errorContrasena
      .set(
        ''
      );


    this.erroresContrasena
      .set(
        {}
      );


    this.mostrarContrasenaActual
      .set(
        false
      );


    this.mostrarNuevaContrasena
      .set(
        false
      );


    this.mostrarConfirmacion
      .set(
        false
      );

  }

  private validarFormularioContrasena():
    boolean {

    const errores:
      Record<
        string,
        string[]
      > = {};


    /*
    |--------------------------------------------------------------------------
    | Contraseña actual
    |--------------------------------------------------------------------------
    */

    if (
      !this.formContrasena
        .contrasena_actual
        .trim()
    ) {

      errores[
        'contrasena_actual'
      ] = [
          this.t(
            'Ingrese su contraseña actual.',
            'Enter your current password.'
          )
        ];

    }


    /*
    |--------------------------------------------------------------------------
    | Nueva contraseña
    |--------------------------------------------------------------------------
    */

    if (
      !this.formContrasena
        .nueva_contrasena
    ) {

      errores[
        'nueva_contrasena'
      ] = [
          this.t(
            'Ingrese una nueva contraseña.',
            'Enter a new password.'
          )
        ];

    }
    else if (
      this.formContrasena
        .nueva_contrasena
        .length
      < 8
    ) {

      errores[
        'nueva_contrasena'
      ] = [
          this.t(
            'La nueva contraseña debe contener al menos 8 caracteres.',
            'The new password must contain at least 8 characters.'
          )
        ];

    }
    else if (
      this.formContrasena
        .nueva_contrasena
      ===
      this.formContrasena
        .contrasena_actual
    ) {

      errores[
        'nueva_contrasena'
      ] = [
          this.t(
            'La nueva contraseña debe ser diferente de la contraseña actual.',
            'The new password must be different from the current password.'
          )
        ];

    }


    /*
    |--------------------------------------------------------------------------
    | Confirmación
    |--------------------------------------------------------------------------
    */

    if (
      !this.formContrasena
        .nueva_contrasena_confirmation
    ) {

      errores[
        'nueva_contrasena_confirmation'
      ] = [
          this.t(
            'Confirme la nueva contraseña.',
            'Confirm the new password.'
          )
        ];

    }
    else if (
      this.formContrasena
        .nueva_contrasena
      !==
      this.formContrasena
        .nueva_contrasena_confirmation
    ) {

      errores[
        'nueva_contrasena_confirmation'
      ] = [
          this.t(
            'Las contraseñas no coinciden.',
            'Passwords do not match.'
          )
        ];

    }


    this.erroresContrasena
      .set(
        errores
      );


    return (
      Object.keys(
        errores
      ).length
      === 0
    );

  }

  cambiarContrasena():
    void {

    if (
      this.guardandoContrasena()
    ) {

      return;

    }


    this.errorContrasena
      .set(
        ''
      );


    this.erroresContrasena
      .set(
        {}
      );


    if (
      !this.validarFormularioContrasena()
    ) {

      return;

    }


    this.guardandoContrasena
      .set(
        true
      );


    const data:
      CambiarContrasenaRequest = {

      contrasena_actual:
        this.formContrasena
          .contrasena_actual,

      nueva_contrasena:
        this.formContrasena
          .nueva_contrasena,

      nueva_contrasena_confirmation:
        this.formContrasena
          .nueva_contrasena_confirmation

    };


    this.authService
      .cambiarContrasena(
        data
      ).pipe(

        finalize(
          () => {

            this.guardandoContrasena
              .set(
                false
              );

          }
        )

      )
      .subscribe({

        next:
          response => {

            /*
             * AuthService ya eliminó
             * SessionStorage porque Laravel
             * revocó todos los tokens.
             */

            window.alert(
              response.message
            );


            this.router.navigate(
              [
                '/login'
              ]
            );

          },


        error:
          (
            error:
              HttpErrorResponse
          ) => {

            this.procesarErrorContrasena(
              error
            );

          }

      });

  }

  private procesarErrorContrasena(
    error:
      HttpErrorResponse
  ): void {

    const errores =
      error.error
        ?.errors;


    if (
      error.status === 422
      &&
      errores
      &&
      typeof errores
      === 'object'
    ) {

      this.erroresContrasena
        .set(
          errores
        );

    }


    const mensaje =
      error.error
        ?.message;


    if (
      typeof mensaje === 'string'
      &&
      mensaje.trim()
    ) {

      this.errorContrasena
        .set(
          mensaje
        );

      return;

    }


    this.errorContrasena
      .set(
        this.t(
          'No fue posible cambiar la contraseña.',
          'Password could not be changed.'
        )
      );

  }

}