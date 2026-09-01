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
  CircleAlert,
  LucideAngularModule,
  Save,
  Tags
} from 'lucide-angular';

import {
  CategoriaService
} from '../../../../core/services/catalogos/categoria.service';

import {
  LanguageService
} from '../../../../core/services/language.service';

import {
  CategoriaRequest
} from '../../../../shared/models/categoria.model';


@Component({
  selector:
    'app-category-form',

  standalone:
    true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LucideAngularModule
  ],

  templateUrl:
    './category-form.html',

  styleUrl:
    './category-form.css'
})
export class CategoryForm
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

  readonly idCategoria =
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

      descripcion: [
        '',
        [
          Validators.maxLength(
            255
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

  readonly CircleAlert =
    CircleAlert;

  readonly Save =
    Save;

  readonly Tags =
    Tags;


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

      this.idCategoria.set(
        id
      );


      this.esEdicion.set(
        true
      );


      this.cargarCategoria();

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar categoría
  |--------------------------------------------------------------------------
  */

  private cargarCategoria(): void {

    const id =
      this.idCategoria();


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


    this.categoriaService
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

            const categoria =
              response.data;


            this.form.patchValue({

              nombre:
                categoria.nombre,

              descripcion:
                categoria.descripcion
                ?? '',

              observaciones:
                categoria.observaciones
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
      CategoriaRequest = {

      nombre:
        valores.nombre
          ?.trim()
        ?? '',

      descripcion:
        this.valorNullable(
          valores.descripcion
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

        ? this.categoriaService
          .actualizar(
            this.idCategoria()!,
            request
          )

        : this.categoriaService
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
                  'Categoría actualizada correctamente.',
                  'Category updated successfully.'
                )

                : this.t(
                  'Categoría registrada correctamente.',
                  'Category created successfully.'
                )

            );


            /*
             * Regla acordada:
             *
             * éxito → cerrar formulario
             * → volver al listado.
             */

            this.router.navigate(
              [
                '/dashboard/categorias'
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
        errores.length
        > 0
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
      'No fue posible guardar la categoría.',
      'The category could not be saved.'
    );

  }

}