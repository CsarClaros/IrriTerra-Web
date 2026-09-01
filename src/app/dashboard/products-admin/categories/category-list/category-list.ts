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
  CircleAlert,
  Edit3,
  LucideAngularModule,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  Tags,
  Trash2
} from 'lucide-angular';

import {
  CategoriaService
} from '../../../../core/services/catalogos/categoria.service';

import {
  SessionService
} from '../../../../core/services/session.service';

import {
  LanguageService
} from '../../../../core/services/language.service';

import {
  Categoria
} from '../../../../shared/models/categoria.model';


type FiltroEstado =
  'TODAS'
  | 'A'
  | 'I';


@Component({
  selector:
    'app-category-list',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule
  ],

  templateUrl:
    './category-list.html',

  styleUrl:
    './category-list.css'
})
export class CategoryList
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

  readonly categorias =
    signal<Categoria[]>(
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
            'categoria.crear'
          )
    );


  readonly puedeEditar =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'categoria.editar'
          )
    );


  readonly puedeEliminar =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'categoria.eliminar'
          )
    );


  /*
  |--------------------------------------------------------------------------
  | Filtrado
  |--------------------------------------------------------------------------
  */

  readonly categoriasFiltradas =
    computed(
      () => {

        const texto =
          this.busqueda()
            .trim()
            .toLowerCase();


        const estado =
          this.filtroEstado();


        return this.categorias()
          .filter(
            categoria => {

              /*
               * Estado.
               */

              if (
                estado !== 'TODAS'
                &&
                categoria.estado_registro
                !== estado
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

                categoria.nombre,

                categoria.descripcion,

                categoria.observaciones

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
        this.categorias()
          .filter(
            categoria =>
              categoria.estado_registro
              === 'A'
          )
          .length
    );


  readonly totalInactivas =
    computed(
      () =>
        this.categorias()
          .filter(
            categoria =>
              categoria.estado_registro
              === 'I'
          )
          .length
    );


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

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

  readonly Tags =
    Tags;

  readonly Trash2 =
    Trash2;


  /*
  |--------------------------------------------------------------------------
  | Inicio
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    this.cargarCategorias();

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar
  |--------------------------------------------------------------------------
  */

  cargarCategorias(): void {

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
     * En administración necesitamos
     * activas e inactivas.
     */

    this.categoriaService
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

            this.categorias.set(
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
  | Desactivar
  |--------------------------------------------------------------------------
  */

  desactivar(
    categoria:
      Categoria
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

          `¿Desactivar la categoría "${categoria.nombre}"?`,

          `Deactivate category "${categoria.nombre}"?`

        )

      );


    if (
      !confirmar
    ) {

      return;

    }


    this.procesandoId.set(
      categoria.id_categoria
    );


    this.errorMensaje.set(
      ''
    );


    this.categoriaService
      .eliminar(
        categoria.id_categoria
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
                'Categoría desactivada correctamente.',
                'Category deactivated successfully.'
              )

            );


            this.cargarCategorias();

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
    categoria:
      Categoria
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

          `¿Reactivar la categoría "${categoria.nombre}"?`,

          `Reactivate category "${categoria.nombre}"?`

        )

      );


    if (
      !confirmar
    ) {

      return;

    }


    this.procesandoId.set(
      categoria.id_categoria
    );


    this.errorMensaje.set(
      ''
    );


    this.categoriaService
      .reactivar(
        categoria.id_categoria
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
                'Categoría reactivada correctamente.',
                'Category reactivated successfully.'
              )

            );


            this.cargarCategorias();

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