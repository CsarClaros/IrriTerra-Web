import {
  Component,
  OnDestroy,
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
  HttpErrorResponse
} from '@angular/common/http';

import {
  finalize
} from 'rxjs';

import {
  Building2,
  CircleAlert,
  ImageOff,
  LucideAngularModule,
  RefreshCcw,
  Save,
  Upload
} from 'lucide-angular';

import {
  EmpresaService
} from '../../../core/services/organizacion/empresa.service';

import {
  SessionService
} from '../../../core/services/session.service';

import {
  LanguageService
} from '../../../core/services/language.service';

import {
  Empresa,
  EmpresaRequest
} from '../../../shared/models/empresa.model';

import {
  Router
} from '@angular/router';


@Component({
  selector:
    'app-empresa-admin',

  standalone:
    true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule
  ],

  templateUrl:
    './empresa.html',

  styleUrl:
    './empresa.css'
})
export class EmpresaAdmin
  implements OnInit, OnDestroy {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly empresaService =
    inject(
      EmpresaService
    );


  private readonly sessionService =
    inject(
      SessionService
    );


  private readonly languageService =
    inject(
      LanguageService
    );


  private readonly fb =
    inject(
      FormBuilder
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

  readonly empresa =
    signal<
      Empresa | null
    >(
      null
    );


  readonly cargando =
    signal(
      false
    );


  readonly guardando =
    signal(
      false
    );


  readonly errorMensaje =
    signal(
      ''
    );


  readonly mensajeExito =
    signal(
      ''
    );


  /*
  |--------------------------------------------------------------------------
  | Logo
  |--------------------------------------------------------------------------
  */

  readonly logoSeleccionado =
    signal<
      File | null
    >(
      null
    );


  readonly previewLogo =
    signal<
      string | null
    >(
      null
    );


  /*
  |--------------------------------------------------------------------------
  | Permisos
  |--------------------------------------------------------------------------
  */

  readonly puedeEditar =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'empresa.editar'
          )
    );


  /*
  |--------------------------------------------------------------------------
  | Formulario
  |--------------------------------------------------------------------------
  */

  readonly form =
    this.fb.group({

      nombre: [
        '',
        [
          Validators.required,
          Validators.maxLength(
            150
          )
        ]
      ],

      nit: [
        '',
        [
          Validators.required,
          Validators.maxLength(
            50
          )
        ]
      ],

      telefono: [
        ''
      ],

      correo: [
        '',
        [
          Validators.email
        ]
      ],

      direccion: [
        ''
      ],

      sitio_web: [
        ''
      ],

      observaciones: [
        ''
      ],

      estado_registro: [
        'A',
        [
          Validators.required
        ]
      ]

    });


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly Building2 =
    Building2;

  readonly CircleAlert =
    CircleAlert;

  readonly ImageOff =
    ImageOff;

  readonly RefreshCcw =
    RefreshCcw;

  readonly Save =
    Save;

  readonly Upload =
    Upload;


  /*
  |--------------------------------------------------------------------------
  | Inicio
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    this.cargarEmpresa();

  }


  ngOnDestroy(): void {

    this.liberarPreview();

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar empresa
  |--------------------------------------------------------------------------
  */

  cargarEmpresa(): void {

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


    this.mensajeExito.set(
      ''
    );


    this.empresaService
      .listar()
      .pipe(

        finalize(
          () =>
            this.cargando.set(
              false
            )
        )

      )
      .subscribe({

        next:
          response => {

            const empresa =
              response.data?.[0]
              ?? null;


            this.empresa.set(
              empresa
            );


            if (
              !empresa
            ) {

              this.errorMensaje.set(

                this.t(
                  'No se encontró una empresa registrada.',
                  'No registered company was found.'
                )

              );

              return;

            }


            this.form.patchValue({

              nombre:
                empresa.nombre,

              nit:
                empresa.nit,

              telefono:
                empresa.telefono
                ?? '',

              correo:
                empresa.correo
                ?? '',

              direccion:
                empresa.direccion
                ?? '',

              sitio_web:
                empresa.sitio_web
                ?? '',

              observaciones:
                empresa.observaciones
                ?? '',

              estado_registro:
                empresa.estado_registro

            });


            this.logoSeleccionado.set(
              null
            );


            this.liberarPreview();

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
  | Seleccionar logo
  |--------------------------------------------------------------------------
  */

  seleccionarLogo(
    event: Event
  ): void {

    if (
      !this.puedeEditar()
    ) {

      return;

    }


    const input =
      event.target as HTMLInputElement;


    const archivo =
      input.files?.[0];


    if (
      !archivo
    ) {

      return;

    }


    const tiposPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];


    if (
      !tiposPermitidos.includes(
        archivo.type
      )
    ) {

      this.errorMensaje.set(

        this.t(
          'El logo debe ser JPG, PNG o WEBP.',
          'The logo must be JPG, PNG or WEBP.'
        )

      );

      input.value =
        '';

      return;

    }


    /*
     * 5 MB.
     */

    if (
      archivo.size
      >
      5 * 1024 * 1024
    ) {

      this.errorMensaje.set(

        this.t(
          'El logo no puede superar los 5 MB.',
          'The logo cannot exceed 5 MB.'
        )

      );

      input.value =
        '';

      return;

    }


    this.errorMensaje.set(
      ''
    );


    this.logoSeleccionado.set(
      archivo
    );


    this.liberarPreview();


    this.previewLogo.set(

      URL.createObjectURL(
        archivo
      )

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Guardar
  |--------------------------------------------------------------------------
  */

  guardar(): void {

    const empresa =
      this.empresa();


    if (
      !empresa
      ||
      !this.puedeEditar()
      ||
      this.guardando()
    ) {

      return;

    }


    if (
      this.form.invalid
    ) {

      this.form.markAllAsTouched();

      return;

    }


    const valores =
      this.form.getRawValue();


    const request:
      EmpresaRequest = {

      nombre:
        valores.nombre
        ?? '',

      nit:
        valores.nit
        ?? '',

      telefono:
        this.valorNullable(
          valores.telefono
        ),

      correo:
        this.valorNullable(
          valores.correo
        ),

      direccion:
        this.valorNullable(
          valores.direccion
        ),

      sitio_web:
        this.valorNullable(
          valores.sitio_web
        ),

      observaciones:
        this.valorNullable(
          valores.observaciones
        ),

      estado_registro:
        valores.estado_registro
        ?? 'A',

      logo:
        this.logoSeleccionado()

    };


    this.guardando.set(
      true
    );


    this.errorMensaje.set(
      ''
    );


    this.mensajeExito.set(
      ''
    );


    this.empresaService
      .actualizar(
        empresa.id_empresa,
        request
      )
      .pipe(

        finalize(
          () =>
            this.guardando.set(
              false
            )
        )

      )
      .subscribe({

        next:
    response => {

        this.empresa.set(
            response.data
        );

        this.logoSeleccionado.set(
            null
        );

        this.liberarPreview();


        window.alert(

            this.t(
                'Datos de la empresa actualizados correctamente.',
                'Company information updated successfully.'
            )

        );


        this.router.navigate(
            [
                '/dashboard'
            ]
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
  | Logo visible
  |--------------------------------------------------------------------------
  */

  logoVisible():
    string | null {

    return (
      this.previewLogo()
      ??
      this.empresa()
        ?.logo
      ??
      null
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  private valorNullable(
    valor:
      string | null | undefined
  ): string | null {

    const limpio =
      valor
        ?.trim()
      ?? '';


    return limpio
      ? limpio
      : null;

  }


  private liberarPreview(): void {

    const preview =
      this.previewLogo();


    if (
      preview
      &&
      preview.startsWith(
        'blob:'
      )
    ) {

      URL.revokeObjectURL(
        preview
      );

    }


    this.previewLogo.set(
      null
    );

  }


  t(
    es: string,
    en: string
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
      error.status === 403
    ) {

      return this.t(
        'No tiene permisos para realizar esta operación.',
        'You do not have permission to perform this operation.'
      );

    }


    /*
     * Error de validación Laravel.
     */

    if (
      error.status === 422
      &&
      error.error?.errors
    ) {

      const errores =
        Object.values(
          error.error.errors
        )
          .flat();


      if (
        errores.length > 0
      ) {

        return String(
          errores[0]
        );

      }

    }


    if (
      typeof error.error
        ?.message
      === 'string'
    ) {

      return error.error.message;

    }


    return this.t(
      'No fue posible actualizar la empresa.',
      'The company could not be updated.'
    );

  }

}