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
  BadgeCheck,
  CircleAlert,
  Edit3,
  ExternalLink,
  LucideAngularModule,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  Trash2
} from 'lucide-angular';

import {
  MarcaService
} from '../../../../core/services/catalogos/marca.service';

import {
  SessionService
} from '../../../../core/services/session.service';

import {
  LanguageService
} from '../../../../core/services/language.service';

import {
  Marca
} from '../../../../shared/models/marca.model';


type FiltroEstado =
  'TODAS'
  |
  'A'
  |
  'I';


@Component({
  selector:
    'app-brand-list',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule
  ],

  templateUrl:
    './brand-list.html',

  styleUrl:
    './brand-list.css'
})
export class BrandList
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

  readonly marcas =
    signal<Marca[]>(
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
      'TODAS'
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
            'marca.crear'
          )
    );


  readonly puedeEditar =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'marca.editar'
          )
    );


  readonly puedeEliminar =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'marca.eliminar'
          )
    );


  /*
  |--------------------------------------------------------------------------
  | Filtrado
  |--------------------------------------------------------------------------
  */

  readonly marcasFiltradas =
    computed(
      () => {

        const texto =
          this.busqueda()
            .trim()
            .toLowerCase();


        const estado =
          this.filtroEstado();


        return this.marcas()
          .filter(
            marca => {

              if (
                estado !== 'TODAS'
                &&
                marca.estado_registro
                !== estado
              ) {

                return false;

              }


              if (
                !texto
              ) {

                return true;

              }


              return [

                marca.nombre,

                marca.pais,

                marca.sitio_web,

                marca.observaciones

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

  readonly totalActivas =
    computed(
      () =>
        this.marcas()
          .filter(
            marca =>
              marca.estado_registro
              === 'A'
          )
          .length
    );


  readonly totalInactivas =
    computed(
      () =>
        this.marcas()
          .filter(
            marca =>
              marca.estado_registro
              === 'I'
          )
          .length
    );


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly BadgeCheck =
    BadgeCheck;

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

  readonly RotateCcw =
    RotateCcw;

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

    this.cargarMarcas();

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar
  |--------------------------------------------------------------------------
  */

  cargarMarcas(): void {

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


    this.marcaService
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

            this.marcas.set(
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
  | Desactivar
  |--------------------------------------------------------------------------
  */

  desactivar(
    marca:
      Marca
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

          `¿Desactivar la marca "${marca.nombre}"?`,

          `Deactivate brand "${marca.nombre}"?`

        )

      );


    if (
      !confirmar
    ) {

      return;

    }


    this.procesandoId.set(
      marca.id_marca
    );


    this.errorMensaje.set(
      ''
    );


    this.marcaService
      .eliminar(
        marca.id_marca
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
                'Marca desactivada correctamente.',
                'Brand deactivated successfully.'
              )

            );


            this.cargarMarcas();

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
    marca:
      Marca
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

          `¿Reactivar la marca "${marca.nombre}"?`,

          `Reactivate brand "${marca.nombre}"?`

        )

      );


    if (
      !confirmar
    ) {

      return;

    }


    this.procesandoId.set(
      marca.id_marca
    );


    this.errorMensaje.set(
      ''
    );


    this.marcaService
      .reactivar(
        marca.id_marca
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
                'Marca reactivada correctamente.',
                'Brand reactivated successfully.'
              )

            );


            this.cargarMarcas();

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