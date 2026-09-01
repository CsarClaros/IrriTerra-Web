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
  ExternalLink,
  LucideAngularModule,
  Plus,
  RefreshCcw,
  Search,
  Trash2
} from 'lucide-angular';

import {
  SucursalService
} from '../../../../core/services/organizacion/sucursal.service';

import {
  SessionService
} from '../../../../core/services/session.service';

import {
  LanguageService
} from '../../../../core/services/language.service';

import {
  Sucursal
} from '../../../../shared/models/sucursal.model';


@Component({
  selector:
    'app-sucursal-list',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule
  ],

  templateUrl:
    './sucursal-list.html',

  styleUrl:
    './sucursal-list.css'
})
export class SucursalList
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

  readonly sucursales =
    signal<Sucursal[]>(
      []
    );


  readonly busqueda =
    signal(
      ''
    );


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
            'sucursal.crear'
          )
    );


  readonly puedeEditar =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'sucursal.editar'
          )
    );


  readonly puedeEliminar =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'sucursal.eliminar'
          )
    );


  /*
  |--------------------------------------------------------------------------
  | Filtrado
  |--------------------------------------------------------------------------
  */

  readonly sucursalesFiltradas =
    computed(
      () => {

        const termino =
          this.busqueda()
            .trim()
            .toLowerCase();


        if (
          !termino
        ) {

          return this.sucursales();

        }


        return this.sucursales()
          .filter(
            sucursal => {

              const campos = [

                sucursal.codigo,

                sucursal.nombre,

                sucursal.departamento,

                sucursal.ciudad,

                sucursal.direccion,

                sucursal.telefono,

                sucursal.correo

              ];


              return campos.some(
                campo =>
                  campo
                    ?.toString()
                    .toLowerCase()
                    .includes(
                      termino
                    )
              );

            }
          );

      }
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

  readonly ExternalLink =
    ExternalLink;

  readonly Plus =
    Plus;

  readonly RefreshCcw =
    RefreshCcw;

  readonly Search =
    Search;

  readonly Trash2 =
    Trash2;


  /*
  |--------------------------------------------------------------------------
  | Inicio
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    this.cargar();

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar
  |--------------------------------------------------------------------------
  */

  cargar(): void {

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


    this.sucursalService
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

            this.sucursales.set(
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
              this.mensajeError(
                error
              )
            );

          }

      });

  }


  /*
  |--------------------------------------------------------------------------
  | Buscar
  |--------------------------------------------------------------------------
  */

  actualizarBusqueda(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    this.busqueda.set(
      input.value
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Desactivar
  |--------------------------------------------------------------------------
  */

  desactivar(
    sucursal:
      Sucursal
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

          `¿Desactivar la sucursal "${sucursal.nombre}"?`,

          `Deactivate branch "${sucursal.nombre}"?`

        )

      );


    if (
      !confirmar
    ) {

      return;

    }


    this.procesandoId.set(
      sucursal.id_sucursal
    );


    this.errorMensaje.set(
      ''
    );


    this.sucursalService
      .eliminar(
        sucursal.id_sucursal
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
                'Sucursal desactivada correctamente.',
                'Branch deactivated successfully.'
              )

            );


            this.cargar();

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