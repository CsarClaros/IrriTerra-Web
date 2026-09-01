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
  ContactRound,
  LucideAngularModule,
  MapPin,
  Save
} from 'lucide-angular';

import {
  ProveedorService
} from '../../../../core/services/compras/proveedor.service';

import {
  LanguageService
} from '../../../../core/services/language.service';

import {
  ProveedorRequest,
  TipoProveedor
} from '../../../../shared/models/proveedor.model';


@Component({
  selector:
      'app-provider-form',

  standalone:
      true,

  imports: [
      CommonModule,
      ReactiveFormsModule,
      RouterLink,
      LucideAngularModule
  ],

  templateUrl:
      './provider-form.html',

  styleUrl:
      './provider-form.css'
})
export class ProviderForm
  implements OnInit {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly proveedorService =
      inject(
          ProveedorService
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

  readonly idProveedor =
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

          tipo_proveedor: [
              'EMPRESA',
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

          nombre_contacto: [
              '',
              [
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

          ciudad: [
              '',
              [
                  Validators.maxLength(
                      100
                  )
              ]
          ],

          departamento: [
              '',
              [
                  Validators.maxLength(
                      100
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

  readonly Building2 =
      Building2;

  readonly CircleAlert =
      CircleAlert;

  readonly ContactRound =
      ContactRound;

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

          this.idProveedor.set(
              id
          );


          this.esEdicion.set(
              true
          );


          this.cargarProveedor();

      }

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar
  |--------------------------------------------------------------------------
  */

  private cargarProveedor(): void {

      const id =
          this.idProveedor();


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


      this.proveedorService
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

                      const proveedor =
                          response.data;


                      this.form.patchValue({

                          tipo_proveedor:
                              proveedor.tipo_proveedor,

                          nombre_razon_social:
                              proveedor.nombre_razon_social,

                          tipo_documento:
                              proveedor.tipo_documento
                              ?? '',

                          numero_documento:
                              proveedor.numero_documento
                              ?? '',

                          nombre_contacto:
                              proveedor.nombre_contacto
                              ?? '',

                          telefono:
                              proveedor.telefono
                              ?? '',

                          correo:
                              proveedor.correo
                              ?? '',

                          direccion:
                              proveedor.direccion
                              ?? '',

                          ciudad:
                              proveedor.ciudad
                              ?? '',

                          departamento:
                              proveedor.departamento
                              ?? '',

                          observaciones:
                              proveedor.observaciones
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
          ProveedorRequest = {

              tipo_proveedor:
                  valores.tipo_proveedor as TipoProveedor,

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

              nombre_contacto:
                  this.valorNullable(
                      valores.nombre_contacto
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

              ciudad:
                  this.valorNullable(
                      valores.ciudad
                  ),

              departamento:
                  this.valorNullable(
                      valores.departamento
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

              ? this.proveedorService
                  .actualizar(
                      this.idProveedor()!,
                      request
                  )

              : this.proveedorService
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
                                  'Proveedor actualizado correctamente.',
                                  'Provider updated successfully.'
                              )

                              : this.t(
                                  'Proveedor registrado correctamente.',
                                  'Provider created successfully.'
                              )

                      );


                      /*
                       * Flujo administrativo acordado:
                       *
                       * éxito
                       * → mensaje
                       * → salir del formulario
                       * → listado.
                       */

                      this.router.navigate(
                          [
                              '/dashboard/proveedores'
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
  | Traducciones
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
          'No fue posible guardar el proveedor.',
          'The provider could not be saved.'
      );

  }

}