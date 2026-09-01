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
  Building2,
  CircleAlert,
  ExternalLink,
  LucideAngularModule,
  MapPin,
  Save
} from 'lucide-angular';

import {
  SucursalService
} from '../../../../core/services/organizacion/sucursal.service';

import {
  EmpresaService
} from '../../../../core/services/organizacion/empresa.service';

import {
  LanguageService
} from '../../../../core/services/language.service';

import {
  SucursalRequest
} from '../../../../shared/models/sucursal.model';


@Component({
  selector:
    'app-sucursal-form',

  standalone:
    true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LucideAngularModule
  ],

  templateUrl:
    './sucursal-form.html',

  styleUrl:
    './sucursal-form.css'
})
export class SucursalForm
  implements OnInit {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly sucursalService =
    inject(
      SucursalService
    );


  private readonly empresaService =
    inject(
      EmpresaService
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

  readonly idSucursal =
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

      id_empresa: [
        0,
        [
          Validators.required,
          Validators.min(
            1
          )
        ]
      ],

      codigo: [
        '',
        [
          Validators.required,
          Validators.maxLength(
            50
          )
        ]
      ],

      nombre: [
        '',
        [
          Validators.required,
          Validators.maxLength(
            150
          )
        ]
      ],

      departamento: [
        '',
        [
          Validators.required
        ]
      ],

      ciudad: [
        '',
        [
          Validators.required
        ]
      ],

      direccion: [
        ''
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

      latitud: [
        null as number | null
      ],

      longitud: [
        null as number | null
      ],

      url_maps: [
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

  readonly ArrowLeft =
    ArrowLeft;

  readonly Building2 =
    Building2;

  readonly CircleAlert =
    CircleAlert;

  readonly ExternalLink =
    ExternalLink;

  readonly MapPin =
    MapPin;

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
        this.route.snapshot
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

      this.idSucursal.set(
        id
      );


      this.esEdicion.set(
        true
      );

    }


    this.cargarEmpresa();


    if (
      this.esEdicion()
    ) {

      this.cargarSucursal();

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Empresa
  |--------------------------------------------------------------------------
  */

  private cargarEmpresa(): void {

    this.empresaService
      .listar()
      .subscribe({

        next:
          response => {

            const empresa =
              response.data?.[0];


            if (
              empresa
              &&
              !this.esEdicion()
            ) {

              this.form.patchValue({

                id_empresa:
                  empresa.id_empresa

              });

            }

          }

      });

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar sucursal
  |--------------------------------------------------------------------------
  */

  private cargarSucursal(): void {

    const id =
      this.idSucursal();


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


    this.sucursalService
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

            const sucursal =
              response.data;


            this.form.patchValue({

              id_empresa:
                sucursal.id_empresa,

              codigo:
                sucursal.codigo,

              nombre:
                sucursal.nombre,

              departamento:
                sucursal.departamento,

              ciudad:
                sucursal.ciudad,

              direccion:
                sucursal.direccion
                ?? '',

              telefono:
                sucursal.telefono
                ?? '',

              correo:
                sucursal.correo
                ?? '',

              latitud:
                sucursal.latitud !== null
                  ? Number(
                    sucursal.latitud
                  )
                  : null,

              longitud:
                sucursal.longitud !== null
                  ? Number(
                    sucursal.longitud
                  )
                  : null,

              url_maps:
                sucursal.url_maps
                ?? '',

              observaciones:
                sucursal.observaciones
                ?? '',

              estado_registro:
                sucursal.estado_registro

            });

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
      SucursalRequest = {

      id_empresa:
        Number(
          valores.id_empresa
        ),

      codigo:
        valores.codigo
          ?.trim()
        ?? '',

      nombre:
        valores.nombre
          ?.trim()
        ?? '',

      departamento:
        valores.departamento
          ?.trim()
        ?? '',

      ciudad:
        valores.ciudad
          ?.trim()
        ?? '',

      direccion:
        this.valorNullable(
          valores.direccion
        ),

      telefono:
        this.valorNullable(
          valores.telefono
        ),

      correo:
        this.valorNullable(
          valores.correo
        ),

      latitud:
        valores.latitud !== null
          &&
          valores.latitud !== undefined
          ? Number(
            valores.latitud
          )
          : null,

      longitud:
        valores.longitud !== null
          &&
          valores.longitud !== undefined
          ? Number(
            valores.longitud
          )
          : null,

      url_maps:
        this.valorNullable(
          valores.url_maps
        ),

      observaciones:
        this.valorNullable(
          valores.observaciones
        ),

      estado_registro:
        valores.estado_registro
        ?? 'A'

    };


    this.guardando.set(
      true
    );


    this.errorMensaje.set(
      ''
    );


    const operacion =
      this.esEdicion()

        ? this.sucursalService
          .actualizar(
            this.idSucursal()!,
            request
          )

        : this.sucursalService
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
                  'Sucursal actualizada correctamente.',
                  'Branch updated successfully.'
                )

                : this.t(
                  'Sucursal registrada correctamente.',
                  'Branch created successfully.'
                )

            );


            this.router.navigate(
              [
                '/dashboard/sucursales'
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
  | Helpers
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


  private mensajeError(
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
      typeof error.error
        ?.message
      === 'string'
    ) {

      return error.error.message;

    }


    return this.t(
      'No fue posible guardar la sucursal.',
      'The branch could not be saved.'
    );

  }

}