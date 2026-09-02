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
  ContactRound,
  FileText,
  LucideAngularModule,
  MapPin,
  Save,
  UsersRound
} from 'lucide-angular';

import {
  ClienteService
} from '../../../../core/services/ventas/cliente.service';

import {
  LanguageService
} from '../../../../core/services/language.service';

import {
  ClienteRequest
} from '../../../../shared/models/cliente.model';


@Component({
  selector:
    'app-client-form',

  standalone:
    true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LucideAngularModule
  ],

  templateUrl:
    './client-form.html',

  styleUrl:
    './client-form.css'
})
export class ClientForm
  implements OnInit {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly clienteService =
    inject(
      ClienteService
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

  readonly idCliente =
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

      tipo_cliente: [
        'PERSONA',
        [
          Validators.required
        ]
      ],

      nombre_razon_social: [
        '',
        [
          Validators.required,
          Validators.maxLength(
            150
          )
        ]
      ],

      tipo_documento: [
        '',
        [
          Validators.maxLength(
            20
          )
        ]
      ],

      numero_documento: [
        '',
        [
          Validators.maxLength(
            30
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

      correo: [
        '',
        [
          Validators.email,
          Validators.maxLength(
            150
          )
        ]
      ],

      direccion: [
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

  readonly ContactRound =
    ContactRound;

  readonly FileText =
    FileText;

  readonly MapPin =
    MapPin;

  readonly Save =
    Save;

  readonly UsersRound =
    UsersRound;


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

      this.idCliente.set(
        id
      );


      this.esEdicion.set(
        true
      );


      this.cargarCliente();

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar cliente
  |--------------------------------------------------------------------------
  */

  private cargarCliente(): void {

    const id =
      this.idCliente();


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


    this.clienteService
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

            const cliente =
              response.data;


            this.form.patchValue({

              tipo_cliente:
                cliente.tipo_cliente,

              nombre_razon_social:
                cliente.nombre_razon_social,

              tipo_documento:
                cliente.tipo_documento
                ?? '',

              numero_documento:
                cliente.numero_documento
                ?? '',

              telefono:
                cliente.telefono
                ?? '',

              correo:
                cliente.correo
                ?? '',

              direccion:
                cliente.direccion
                ?? '',

              observaciones:
                cliente.observaciones
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
  | Consumidor final
  |--------------------------------------------------------------------------
  */

  esConsumidorFinal(): boolean {

    return this.form
      .controls
      .tipo_cliente
      .value
      === 'CONSUMIDOR_FINAL';

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
      ClienteRequest = {

      tipo_cliente:
        valores.tipo_cliente as ClienteRequest[
        'tipo_cliente'
        ],

      nombre_razon_social:
        valores.nombre_razon_social
          ?.trim()
        ?? '',

      tipo_documento:
        this.valorNullable(
          valores.tipo_documento
        ),

      numero_documento:
        this.valorNullable(
          valores.numero_documento
        ),

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

        ? this.clienteService
          .actualizar(
            this.idCliente()!,
            request
          )

        : this.clienteService
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
                  'Cliente actualizado correctamente.',
                  'Client updated successfully.'
                )

                : this.t(
                  'Cliente registrado correctamente.',
                  'Client created successfully.'
                )

            );


            /*
             * Flujo administrativo:
             *
             * Guardar
             * → éxito
             * → cerrar formulario
             * → listado.
             */

            this.router.navigate(
              [
                '/dashboard/clientes'
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
  | Error
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
      'No fue posible guardar el cliente.',
      'The client could not be saved.'
    );

  }

}