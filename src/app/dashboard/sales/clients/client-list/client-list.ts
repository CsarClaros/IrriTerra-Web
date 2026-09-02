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
  UserRound,
  UsersRound
} from 'lucide-angular';

import {
  ClienteService
} from '../../../../core/services/ventas/cliente.service';

import {
  SessionService
} from '../../../../core/services/session.service';

import {
  LanguageService
} from '../../../../core/services/language.service';

import {
  Cliente
} from '../../../../shared/models/cliente.model';


type FiltroEstado =
  'TODOS'
  | 'A'
  | 'I';


type FiltroTipo =
  'TODOS'
  | 'PERSONA'
  | 'EMPRESA'
  | 'CONSUMIDOR_FINAL';


@Component({
  selector:
    'app-client-list',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule
  ],

  templateUrl:
    './client-list.html',

  styleUrl:
    './client-list.css'
})
export class ClientList
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

  readonly clientes =
    signal<Cliente[]>(
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
            'cliente.crear'
          )
    );


  readonly puedeEditar =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'cliente.editar'
          )
    );


  readonly puedeEliminar =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'cliente.eliminar'
          )
    );


  /*
  |--------------------------------------------------------------------------
  | Listado filtrado
  |--------------------------------------------------------------------------
  */

  readonly clientesFiltrados =
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


        return this.clientes()
          .filter(
            cliente => {

              /*
               * Estado.
               */

              if (
                estado !== 'TODOS'
                &&
                cliente.estado_registro
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
                cliente.tipo_cliente
                !== tipo
              ) {

                return false;

              }


              /*
               * Sin búsqueda.
               */

              if (
                !texto
              ) {

                return true;

              }


              /*
               * Búsqueda general.
               */

              return [

                cliente.nombre_razon_social,

                cliente.tipo_cliente,

                cliente.tipo_documento,

                cliente.numero_documento,

                cliente.telefono,

                cliente.correo,

                cliente.direccion,

                cliente.observaciones

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
        this.clientes()
          .filter(
            cliente =>
              cliente.estado_registro
              === 'A'
          )
          .length
    );


  readonly totalInactivos =
    computed(
      () =>
        this.clientes()
          .filter(
            cliente =>
              cliente.estado_registro
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

  readonly UsersRound =
    UsersRound;


  /*
  |--------------------------------------------------------------------------
  | Inicio
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    this.cargarClientes();

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar clientes
  |--------------------------------------------------------------------------
  */

  cargarClientes(): void {

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
     * El administrador necesita
     * activos e inactivos.
     */

    this.clienteService
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

            this.clientes.set(
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
  | Filtro estado
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
  | Filtro tipo
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
    cliente:
      Cliente
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

          `¿Desactivar al cliente "${cliente.nombre_razon_social}"?`,

          `Deactivate client "${cliente.nombre_razon_social}"?`

        )

      );


    if (
      !confirmar
    ) {

      return;

    }


    this.procesandoId.set(
      cliente.id_cliente
    );


    this.errorMensaje.set(
      ''
    );


    this.clienteService
      .eliminar(
        cliente.id_cliente
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
                'Cliente desactivado correctamente.',
                'Client deactivated successfully.'
              )

            );


            this.cargarClientes();

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
    cliente:
      Cliente
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

          `¿Reactivar al cliente "${cliente.nombre_razon_social}"?`,

          `Reactivate client "${cliente.nombre_razon_social}"?`

        )

      );


    if (
      !confirmar
    ) {

      return;

    }


    this.procesandoId.set(
      cliente.id_cliente
    );


    this.errorMensaje.set(
      ''
    );


    this.clienteService
      .reactivar(
        cliente.id_cliente
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
                'Cliente reactivado correctamente.',
                'Client reactivated successfully.'
              )

            );


            this.cargarClientes();

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
  | Tipo
  |--------------------------------------------------------------------------
  */

  nombreTipo(
    tipo:
      string
  ): string {

    switch (
    tipo
    ) {

      case 'EMPRESA':

        return this.t(
          'Empresa',
          'Company'
        );


      case 'CONSUMIDOR_FINAL':

        return this.t(
          'Consumidor final',
          'Final consumer'
        );


      default:

        return this.t(
          'Persona',
          'Individual'
        );

    }

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