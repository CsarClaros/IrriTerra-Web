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
  RouterLink
} from '@angular/router';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  finalize
} from 'rxjs';

import {
  Building2,
  CircleAlert,
  Edit3,
  LucideAngularModule,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  Trash2,
  UserRound
} from 'lucide-angular';

import {
  ProveedorService
} from '../../../../core/services/compras/proveedor.service';

import {
  SessionService
} from '../../../../core/services/session.service';

import {
  LanguageService
} from '../../../../core/services/language.service';

import {
  Proveedor,
  TipoProveedor
} from '../../../../shared/models/proveedor.model';


type FiltroEstado =
  'TODOS'
  | 'A'
  | 'I';


type FiltroTipo =
  'TODOS'
  | TipoProveedor;


@Component({
  selector:
    'app-provider-list',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule
  ],

  templateUrl:
    './provider-list.html',

  styleUrl:
    './provider-list.css'
})
export class ProviderList
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
  | Datos
  |--------------------------------------------------------------------------
  */

  readonly proveedores =
    signal<Proveedor[]>(
      []
    );


  /*
  |--------------------------------------------------------------------------
  | Filtros
  |--------------------------------------------------------------------------
  */

  readonly busqueda =
    signal(
      ''
    );


  readonly filtroEstado =
    signal<FiltroEstado>(
      'TODOS'
    );


  readonly filtroTipo =
    signal<FiltroTipo>(
      'TODOS'
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


  readonly procesandoId =
    signal<number | null>(
      null
    );


  readonly errorMensaje =
    signal(
      ''
    );


  /*
  |--------------------------------------------------------------------------
  | Permisos
  |--------------------------------------------------------------------------
  */

  readonly puedeCrear =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'proveedor.crear'
          )
    );


  readonly puedeEditar =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'proveedor.editar'
          )
    );


  readonly puedeEliminar =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'proveedor.eliminar'
          )
    );


  /*
  |--------------------------------------------------------------------------
  | Filtrado
  |--------------------------------------------------------------------------
  */

  readonly proveedoresFiltrados =
    computed(
      () => {

        const texto =
          this.busqueda()
            .trim()
            .toLowerCase();


        const estado =
          this.filtroEstado();


        const tipo =
          this.filtroTipo();


        return this.proveedores()
          .filter(
            proveedor => {

              /*
               * Estado.
               */

              if (
                estado !== 'TODOS'
                &&
                proveedor.estado_registro
                !== estado
              ) {

                return false;

              }


              /*
               * Tipo.
               */

              if (
                tipo !== 'TODOS'
                &&
                proveedor.tipo_proveedor
                !== tipo
              ) {

                return false;

              }


              /*
               * Búsqueda.
               */

              if (
                !texto
              ) {

                return true;

              }


              return [

                proveedor.nombre_razon_social,

                proveedor.numero_documento,

                proveedor.tipo_documento,

                proveedor.nombre_contacto,

                proveedor.telefono,

                proveedor.correo,

                proveedor.direccion,

                proveedor.ciudad,

                proveedor.departamento

              ]
                .some(
                  valor =>
                    valor
                      ?.toLowerCase()
                      .includes(
                        texto
                      )
                );

            }
          );

      }
    );


  /*
  |--------------------------------------------------------------------------
  | Contadores
  |--------------------------------------------------------------------------
  */

  readonly totalActivos =
    computed(
      () =>
        this.proveedores()
          .filter(
            proveedor =>
              proveedor.estado_registro
              === 'A'
          )
          .length
    );


  readonly totalInactivos =
    computed(
      () =>
        this.proveedores()
          .filter(
            proveedor =>
              proveedor.estado_registro
              === 'I'
          )
          .length
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

  readonly Edit3 =
    Edit3;

  readonly Plus =
    Plus;

  readonly RefreshCcw =
    RefreshCcw;

  readonly RotateCcw =
    RotateCcw;

  readonly Search =
    Search;

  readonly Trash2 =
    Trash2;

  readonly UserRound =
    UserRound;


  /*
  |--------------------------------------------------------------------------
  | Inicio
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    this.cargarProveedores();

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar
  |--------------------------------------------------------------------------
  */

  cargarProveedores(): void {

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


    /*
     * true:
     *
     * Administración necesita
     * activos e inactivos.
     */

    this.proveedorService
      .listar(
        true
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

            this.proveedores.set(
              response.data
              ?? []
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
  | Búsqueda
  |--------------------------------------------------------------------------
  */

  actualizarBusqueda(
    event:
      Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    this.busqueda.set(
      input.value
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Estado
  |--------------------------------------------------------------------------
  */

  actualizarEstado(
    event:
      Event
  ): void {

    const select =
      event.target as HTMLSelectElement;


    this.filtroEstado.set(
      select.value as FiltroEstado
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Tipo
  |--------------------------------------------------------------------------
  */

  actualizarTipo(
    event:
      Event
  ): void {

    const select =
      event.target as HTMLSelectElement;


    this.filtroTipo.set(
      select.value as FiltroTipo
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Desactivar
  |--------------------------------------------------------------------------
  */

  desactivar(
    proveedor:
      Proveedor
  ): void {

    if (
      !this.puedeEliminar()
      ||
      this.procesandoId()
      !== null
    ) {

      return;

    }


    const confirmar =
      window.confirm(

        this.t(

          `¿Desactivar al proveedor "${proveedor.nombre_razon_social}"?`,

          `Deactivate provider "${proveedor.nombre_razon_social}"?`

        )

      );


    if (
      !confirmar
    ) {

      return;

    }


    this.procesandoId.set(
      proveedor.id_proveedor
    );


    this.errorMensaje.set(
      ''
    );


    this.proveedorService
      .eliminar(
        proveedor.id_proveedor
      )
      .pipe(

        finalize(
          () =>
            this.procesandoId.set(
              null
            )
        )

      )
      .subscribe({

        next:
          () => {

            window.alert(

              this.t(
                'Proveedor desactivado correctamente.',
                'Provider deactivated successfully.'
              )

            );


            this.cargarProveedores();

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
  | Reactivar
  |--------------------------------------------------------------------------
  */

  reactivar(
    proveedor:
      Proveedor
  ): void {

    if (
      !this.puedeEditar()
      ||
      this.procesandoId()
      !== null
    ) {

      return;

    }


    const confirmar =
      window.confirm(

        this.t(

          `¿Reactivar al proveedor "${proveedor.nombre_razon_social}"?`,

          `Reactivate provider "${proveedor.nombre_razon_social}"?`

        )

      );


    if (
      !confirmar
    ) {

      return;

    }


    this.procesandoId.set(
      proveedor.id_proveedor
    );


    this.errorMensaje.set(
      ''
    );


    this.proveedorService
      .reactivar(
        proveedor.id_proveedor
      )
      .pipe(

        finalize(
          () =>
            this.procesandoId.set(
              null
            )
        )

      )
      .subscribe({

        next:
          () => {

            window.alert(

              this.t(
                'Proveedor reactivado correctamente.',
                'Provider reactivated successfully.'
              )

            );


            this.cargarProveedores();

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


    if (
      typeof error.error
        ?.message
      === 'string'
    ) {

      return error.error.message;

    }


    return this.t(
      'No fue posible completar la operación.',
      'The operation could not be completed.'
    );

  }

}