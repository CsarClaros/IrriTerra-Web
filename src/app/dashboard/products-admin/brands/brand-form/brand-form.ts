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
  FormBuilder,
  ReactiveFormsModule,
  Validators
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
  finalize
} from 'rxjs';

import {
  ArrowLeft,
  BadgeCheck,
  CircleAlert,
  LucideAngularModule,
  Save
} from 'lucide-angular';

import {
  MarcaService
} from '../../../../core/services/catalogos/marca.service';

import {
  LanguageService
} from '../../../../core/services/language.service';

import {
  MarcaRequest
} from '../../../../shared/models/marca.model';


@Component({
  selector:
    'app-brand-form',

  standalone:
    true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LucideAngularModule
  ],

  templateUrl:
    './brand-form.html',

  styleUrl:
    './brand-form.css'
})
export class BrandForm
  implements OnInit {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly marcaService =
    inject(
      MarcaService
    );


  private readonly languageService =
    inject(
      LanguageService
    );


  private readonly route =
    inject(
      ActivatedRoute
    );


  private readonly router =
    inject(
      Router
    );


  private readonly fb =
    inject(
      FormBuilder
    );


  /*
  |--------------------------------------------------------------------------
  | Modo
  |--------------------------------------------------------------------------
  */

  readonly idMarca =
    signal<number | null>(
      null
    );


  readonly esEdicion =
    signal(
      false
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


  readonly guardando =
    signal(
      false
    );


  readonly errorMensaje =
    signal(
      ''
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

      pais: [
        '',
        [
          Validators.maxLength(
            100
          )
        ]
      ],

      sitio_web: [
        '',
        [
          Validators.maxLength(
            255
          ),
          Validators.pattern(
            /^https?:\/\/.+/i
          )
        ]
      ],

      logo: [
        '',
        [
          Validators.maxLength(
            255
          )
        ]
      ],

      orden: [
        0,
        [
          Validators.min(
            0
          ),
          Validators.max(
            65535
          )
        ]
      ],

      observaciones: [
        ''
      ]

    });


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly ArrowLeft =
    ArrowLeft;

  readonly BadgeCheck =
    BadgeCheck;

  readonly CircleAlert =
    CircleAlert;

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
      Number.isInteger(
        id
      )
      &&
      id > 0
    ) {

      this.idMarca.set(
        id
      );


      this.esEdicion.set(
        true
      );


      this.cargarMarca();

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar
  |--------------------------------------------------------------------------
  */

  private cargarMarca(): void {

    const id =
      this.idMarca();


    if (
      !id
    ) {

      return;

    }


    this.cargando.set(
      true
    );


    this.errorMensaje.set(
      ''
    );


    this.marcaService
      .obtener(
        id
      )
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

            const marca =
              response.data;


            this.form.patchValue({

              nombre:
                marca.nombre,

              pais:
                marca.pais
                ?? '',

              sitio_web:
                marca.sitio_web
                ?? '',

              logo:
                marca.logo
                ?? '',

              orden:
                marca.orden
                ?? 0,

              observaciones:
                marca.observaciones
                ?? ''

            });

          },


        error:
          (
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
      this.form.invalid
      ||
      this.guardando()
    ) {

      this.form.markAllAsTouched();

      return;

    }


    const valores =
      this.form.getRawValue();


    const request:
      MarcaRequest = {

      nombre:
        valores.nombre
          ?.trim()
        ?? '',

      pais:
        this.valorNullable(
          valores.pais
        ),

      sitio_web:
        this.valorNullable(
          valores.sitio_web
        ),

      logo:
        this.valorNullable(
          valores.logo
        ),

      orden:
        Number(
          valores.orden
          ?? 0
        ),

      observaciones:
        this.valorNullable(
          valores.observaciones
        )

    };


    this.guardando.set(
      true
    );


    this.errorMensaje.set(
      ''
    );


    const operacion =
      this.esEdicion()

        ? this.marcaService
          .actualizar(
            this.idMarca()!,
            request
          )

        : this.marcaService
          .crear(
            request
          );


    operacion
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
          () => {

            window.alert(

              this.esEdicion()

                ? this.t(
                  'Marca actualizada correctamente.',
                  'Brand updated successfully.'
                )

                : this.t(
                  'Marca registrada correctamente.',
                  'Brand created successfully.'
                )

            );


            this.router.navigate(
              [
                '/dashboard/marcas'
              ]
            );

          },


        error:
          (
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
  | Nullables
  |--------------------------------------------------------------------------
  */

  private valorNullable(
    valor:
      string
      |
      null
      |
      undefined
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
  | Traducción
  |--------------------------------------------------------------------------
  */

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

  private obtenerMensajeError(
    error:
      HttpErrorResponse
  ): string {

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
      error.status === 403
    ) {

      return this.t(
        'No tiene permisos para realizar esta operación.',
        'You do not have permission to perform this operation.'
      );

    }


    if (
      error.status === 0
    ) {

      return this.t(
        'No fue posible conectar con el servidor.',
        'Unable to connect to the server.'
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
      'No fue posible guardar la marca.',
      'The brand could not be saved.'
    );

  }

}