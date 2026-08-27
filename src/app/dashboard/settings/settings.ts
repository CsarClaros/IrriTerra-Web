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
  X
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

}