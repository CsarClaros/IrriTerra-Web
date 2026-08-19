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
  FormsModule
} from '@angular/forms';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  finalize
} from 'rxjs';

import {
  ArrowRight,
  ArrowRightLeft,
  Eye,
  Package,
  RefreshCcw,
  Search,
  Truck,
  X,
  LucideAngularModule,
  Plus
} from 'lucide-angular';

import {
  TransferenciaInventarioService
} from '../../../core/services/transferencias/transferencia-inventario.service';

import {
  EstadoTransferenciaInventario,
  TransferenciaInventario
} from '../../../shared/models/transferencia-inventario.model';

import { RouterLink } from "@angular/router";

import {
  SessionService
} from '../../../core/services/session.service';

import {
  TransferActions
} from './transfer-actions/transfer-actions';


@Component({
  selector:
    'app-transfer-list',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    RouterLink,
    TransferActions
  ],

  templateUrl:
    './transfer-list.html',

  styleUrl:
    './transfer-list.css'
})
export class TransferList
  implements OnInit {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly transferenciaService =
    inject(
      TransferenciaInventarioService
    );

  private readonly sessionService =
    inject(
      SessionService
    );

  readonly puedeCrear =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'transferencia.crear'
          )
    );


  /*
  |--------------------------------------------------------------------------
  | Datos
  |--------------------------------------------------------------------------
  */

  readonly transferencias =
    signal<
      TransferenciaInventario[]
    >([]);


  readonly transferenciaSeleccionada =
    signal<
      TransferenciaInventario | null
    >(null);


  /*
  |--------------------------------------------------------------------------
  | Estado
  |--------------------------------------------------------------------------
  */

  readonly cargando =
    signal(false);


  readonly cargandoDetalle =
    signal(false);


  readonly errorMensaje =
    signal('');


  readonly errorDetalle =
    signal('');


  /*
  |--------------------------------------------------------------------------
  | Filtros
  |--------------------------------------------------------------------------
  */

  readonly busqueda =
    signal('');


  readonly estadoFiltro =
    signal<
      EstadoTransferenciaInventario | ''
    >('');


  /*
  |--------------------------------------------------------------------------
  | Transferencias filtradas
  |--------------------------------------------------------------------------
  */

  readonly transferenciasFiltradas =
    computed(
      () => {

        const texto =
          this.busqueda()
            .trim()
            .toLowerCase();


        const estado =
          this.estadoFiltro();


        return this.transferencias()
          .filter(
            transferencia => {

              /*
              |--------------------------------------------------------------------------
              | Estado
              |--------------------------------------------------------------------------
              */

              if (
                estado
                &&
                transferencia
                  .estado_transferencia
                !== estado
              ) {

                return false;

              }


              /*
              |--------------------------------------------------------------------------
              | Búsqueda
              |--------------------------------------------------------------------------
              */

              if (
                !texto
              ) {

                return true;

              }


              const codigo =
                transferencia
                  .codigo_transferencia
                  ?.toLowerCase()
                ?? '';


              const origen =
                transferencia
                  .sucursal_origen
                  ?.nombre
                  ?.toLowerCase()
                ?? '';


              const destino =
                transferencia
                  .sucursal_destino
                  ?.nombre
                  ?.toLowerCase()
                ?? '';


              return (
                codigo.includes(
                  texto
                )
                ||
                origen.includes(
                  texto
                )
                ||
                destino.includes(
                  texto
                )
              );

            }
          );

      }
    );


  /*
  |--------------------------------------------------------------------------
  | Resumen
  |--------------------------------------------------------------------------
  */

  readonly totalPendientes =
    computed(
      () =>
        this.transferencias()
          .filter(
            item =>
              item.estado_transferencia
              === 'PENDIENTE'
          )
          .length
    );


  readonly totalEnTransito =
    computed(
      () =>
        this.transferencias()
          .filter(
            item =>
              item.estado_transferencia
              === 'EN_TRANSITO'
          )
          .length
    );


  readonly totalCompletadas =
    computed(
      () =>
        this.transferencias()
          .filter(
            item =>
              item.estado_transferencia
              === 'COMPLETADA'
          )
          .length
    );


  readonly totalRechazadas =
    computed(
      () =>
        this.transferencias()
          .filter(
            item =>
              item.estado_transferencia
              === 'RECHAZADA'
          )
          .length
    );


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly ArrowRight =
    ArrowRight;


  readonly ArrowRightLeft =
    ArrowRightLeft;


  readonly Eye =
    Eye;


  readonly Package =
    Package;


  readonly RefreshCcw =
    RefreshCcw;


  readonly Search =
    Search;


  readonly Truck =
    Truck;


  readonly X =
    X;

  readonly Plus =
    Plus;

  /*
  |--------------------------------------------------------------------------
  | Inicio
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    this.cargarTransferencias();

  }


  /*
  |--------------------------------------------------------------------------
  | Listar
  |--------------------------------------------------------------------------
  */

  cargarTransferencias(): void {

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


    this.transferenciaService
      .listar()
      .pipe(

        finalize(
          () => {

            this.cargando.set(
              false
            );

          }
        )

      )
      .subscribe({

        next: response => {

          this.transferencias.set(

            response.data
            ?? []

          );

        },


        error: (
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
  | Ver detalle
  |--------------------------------------------------------------------------
  */

  verDetalle(
    transferencia:
      TransferenciaInventario
  ): void {

    if (
      this.cargandoDetalle()
    ) {

      return;

    }


    this.errorDetalle.set(
      ''
    );


    this.transferenciaSeleccionada.set(
      transferencia
    );


    this.cargandoDetalle.set(
      true
    );


    this.transferenciaService
      .obtener(
        transferencia
          .id_transferencia_inventario
      )
      .pipe(

        finalize(
          () => {

            this.cargandoDetalle.set(
              false
            );

          }
        )

      )
      .subscribe({

        next: response => {

          this.transferenciaSeleccionada.set(
            response.data
          );

        },


        error: (
          error:
            HttpErrorResponse
        ) => {

          this.errorDetalle.set(
            this.mensajeError(
              error
            )
          );

        }

      });

  }


  /*
  |--------------------------------------------------------------------------
  | Cerrar detalle
  |--------------------------------------------------------------------------
  */

  cerrarDetalle(): void {

    if (
      this.cargandoDetalle()
    ) {

      return;

    }


    this.transferenciaSeleccionada.set(
      null
    );


    this.errorDetalle.set(
      ''
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Búsqueda
  |--------------------------------------------------------------------------
  */

  actualizarBusqueda(
    value:
      string
  ): void {

    this.busqueda.set(
      value
    );

  }


  actualizarEstado(
    value:
      EstadoTransferenciaInventario | ''
  ): void {

    this.estadoFiltro.set(
      value
    );

  }


  limpiarFiltros(): void {

    this.busqueda.set(
      ''
    );


    this.estadoFiltro.set(
      ''
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Estado
  |--------------------------------------------------------------------------
  */

  nombreEstado(
    estado:
      EstadoTransferenciaInventario
  ): string {

    switch (
    estado
    ) {

      case 'PENDIENTE':

        return 'Pendiente';


      case 'EN_TRANSITO':

        return 'En tránsito';


      case 'COMPLETADA':

        return 'Completada';


      case 'RECHAZADA':

        return 'Rechazada';


      default:

        return estado;

    }

  }


  claseEstado(
    estado:
      EstadoTransferenciaInventario
  ): string {

    switch (
    estado
    ) {

      case 'PENDIENTE':

        return (
          'bg-amber-50 text-amber-700 ring-amber-600/20'
        );


      case 'EN_TRANSITO':

        return (
          'bg-blue-50 text-blue-700 ring-blue-600/20'
        );


      case 'COMPLETADA':

        return (
          'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
        );


      case 'RECHAZADA':

        return (
          'bg-red-50 text-red-700 ring-red-600/20'
        );


      default:

        return (
          'bg-gray-50 text-gray-700 ring-gray-600/20'
        );

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Fecha
  |--------------------------------------------------------------------------
  */

  formatearFecha(
    value:
      string | null | undefined
  ): string {

    if (
      !value
    ) {

      return '—';

    }


    const fecha =
      new Date(
        value
      );


    if (
      Number.isNaN(
        fecha.getTime()
      )
    ) {

      return value;

    }


    return new Intl.DateTimeFormat(
      'es-BO',
      {

        day:
          '2-digit',

        month:
          '2-digit',

        year:
          'numeric',

        hour:
          '2-digit',

        minute:
          '2-digit'

      }
    )
      .format(
        fecha
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Cantidad
  |--------------------------------------------------------------------------
  */

  numero(
    value:
      number
      |
      string
      |
      null
      |
      undefined
  ): number {

    const resultado =
      Number(
        value
        ?? 0
      );


    return Number.isFinite(
      resultado
    )
      ? resultado
      : 0;

  }


  /*
  |--------------------------------------------------------------------------
  | Nombre producto
  |--------------------------------------------------------------------------
  */

  nombreProducto(
    transferencia:
      TransferenciaInventario,

    idProductoVariante:
      number
  ): string {

    const detalle =
      transferencia
        .detalles
        ?.find(
          item =>
            item.id_producto_variante
            === idProductoVariante
        );


    const variante =
      detalle
        ?.producto_variante;


    if (
      !variante
    ) {

      return (
        `Variante #${idProductoVariante}`
      );

    }


    const producto =
      variante.producto
        ?.nombre;


    return producto

      ? `${producto} — ${variante.nombre}`

      : variante.nombre;

  }


  /*
  |--------------------------------------------------------------------------
  | Error HTTP
  |--------------------------------------------------------------------------
  */

  private mensajeError(
    error:
      HttpErrorResponse
  ): string {

    if (
      error.status === 422
      &&
      error.error
        ?.errors
    ) {

      const valores =
        Object.values(
          error.error.errors
        );


      for (
        const value
        of valores
      ) {

        if (
          Array.isArray(
            value
          )
          &&
          value.length > 0
        ) {

          return String(
            value[0]
          );

        }

      }

    }


    const mensaje =
      error.error
        ?.message;


    if (
      typeof mensaje
      === 'string'
      &&
      mensaje.trim()
    ) {

      return mensaje;

    }


    if (
      error.status === 403
    ) {

      return (
        'No tiene permiso para consultar transferencias.'
      );

    }


    if (
      error.status === 0
    ) {

      return (
        'No fue posible conectar con el servidor.'
      );

    }


    return (
      'No fue posible cargar las transferencias.'
    );

  }

  /*
|--------------------------------------------------------------------------
| Transferencia actualizada
|--------------------------------------------------------------------------
*/

  /*
|--------------------------------------------------------------------------
| Transferencia actualizada
|--------------------------------------------------------------------------
*/

  transferenciaActualizada(
    transferencia:
      TransferenciaInventario
  ): void {

    /*
    |--------------------------------------------------------------------------
    | Actualizar inmediatamente el listado
    |--------------------------------------------------------------------------
    */

    this.transferencias.update(
      transferencias =>
        transferencias.map(
          item =>
            item.id_transferencia_inventario
              === transferencia.id_transferencia_inventario

              ? transferencia

              : item
        )
    );


    /*
    |--------------------------------------------------------------------------
    | Cerrar modal de detalle
    |--------------------------------------------------------------------------
    */

    this.transferenciaSeleccionada.set(
      null
    );


    this.errorDetalle.set(
      ''
    );

  }
  /*
  |--------------------------------------------------------------------------
  | Transferencia eliminada
  |--------------------------------------------------------------------------
  */

  transferenciaEliminada(
    id:
      number
  ): void {

    this.transferencias.update(
      transferencias =>
        transferencias.filter(
          item =>
            item.id_transferencia_inventario
            !== id
        )
    );


    this.transferenciaSeleccionada.set(
      null
    );


    this.errorDetalle.set(
      ''
    );

  }

}