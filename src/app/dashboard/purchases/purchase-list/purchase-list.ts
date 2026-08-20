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
  CheckCircle2,
  Eye,
  Package,
  RefreshCcw,
  Search,
  X,
  XCircle,
  Plus,
  LucideAngularModule,
  Route
} from 'lucide-angular';

import {
  CompraService
} from '../../../core/services/compras/compra.service';

import {
  Compra,
  EstadoCompra
} from '../../../shared/models/compra.model';

import {
  Usuario
} from '../../../shared/models/user.model';

import { RouterLink } from '@angular/router';

import {
  SessionService
} from '../../../core/services/session.service';

import { PurchaseActions } from "./purchase-actions/purchase-actions";

@Component({
  selector:
    'app-purchase-list',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    RouterLink,
    PurchaseActions
  ],

  templateUrl:
    './purchase-list.html',

  styleUrl:
    './purchase-list.css'
})
export class PurchaseList
  implements OnInit {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly compraService =
    inject(
      CompraService
    );

  private readonly sessionService =
    inject(
      SessionService
    );
  /*
  |--------------------------------------------------------------------------
  | Datos
  |--------------------------------------------------------------------------
  */

  readonly compras =
    signal<
      Compra[]
    >([]);


  readonly compraSeleccionada =
    signal<
      Compra | null
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
      EstadoCompra | ''
    >('');


  readonly proveedorFiltro =
    signal<
      number | null
    >(null);


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly CheckCircle2 =
    CheckCircle2;


  readonly Eye =
    Eye;


  readonly Package =
    Package;


  readonly RefreshCcw =
    RefreshCcw;


  readonly Search =
    Search;


  readonly X =
    X;


  readonly XCircle =
    XCircle;

  readonly Plus =
    Plus;

  /*
  |--------------------------------------------------------------------------
  | Proveedores disponibles
  |--------------------------------------------------------------------------
  */

  readonly proveedores =
    computed(
      () => {

        const mapa =
          new Map<
            number,
            {
              id_proveedor:
              number;

              nombre:
              string;
            }
          >();


        for (
          const compra
          of this.compras()
        ) {

          const proveedor =
            compra.proveedor;


          if (
            !proveedor
          ) {

            continue;

          }


          mapa.set(
            proveedor.id_proveedor,
            {
              id_proveedor:
                proveedor.id_proveedor,

              nombre:
                proveedor.nombre_razon_social
            }
          );

        }


        return Array
          .from(
            mapa.values()
          )
          .sort(
            (
              a,
              b
            ) =>
              a.nombre.localeCompare(
                b.nombre,
                'es'
              )
          );

      }
    );


  /*
  |--------------------------------------------------------------------------
  | Compras filtradas
  |--------------------------------------------------------------------------
  */

  readonly comprasFiltradas =
    computed(
      () => {

        const texto =
          this.busqueda()
            .trim()
            .toLowerCase();


        const estado =
          this.estadoFiltro();


        const proveedor =
          this.proveedorFiltro();


        return this.compras()
          .filter(
            compra => {

              /*
              |--------------------------------------------------------------------------
              | Estado
              |--------------------------------------------------------------------------
              */

              if (
                estado
                &&
                compra.estado_compra
                !== estado
              ) {

                return false;

              }


              /*
              |--------------------------------------------------------------------------
              | Proveedor
              |--------------------------------------------------------------------------
              */

              if (
                proveedor
                !== null
                &&
                compra.id_proveedor
                !== proveedor
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


              const valores = [

                compra.codigo_compra,

                compra.numero_factura
                ?? '',

                compra.proveedor
                  ?.nombre_razon_social
                ?? '',

                compra.sucursal
                  ?.nombre
                ?? '',

                this.nombreUsuario(
                  compra.comprador
                )

              ];


              return valores
                .some(
                  valor =>
                    valor
                      .toLowerCase()
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

  readonly totalBorradores =
    computed(
      () =>
        this.compras()
          .filter(
            compra =>
              compra.estado_compra
              === 'BORRADOR'
          )
          .length
    );


  readonly totalConfirmadas =
    computed(
      () =>
        this.compras()
          .filter(
            compra =>
              compra.estado_compra
              === 'CONFIRMADA'
          )
          .length
    );


  readonly totalRecibidas =
    computed(
      () =>
        this.compras()
          .filter(
            compra =>
              compra.estado_compra
              === 'RECIBIDA'
          )
          .length
    );


  readonly totalAnuladas =
    computed(
      () =>
        this.compras()
          .filter(
            compra =>
              compra.estado_compra
              === 'ANULADA'
          )
          .length
    );



  readonly puedeCrear =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'compra.crear'
          )
    );


  /*
  |--------------------------------------------------------------------------
  | Inicialización
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    this.cargarCompras();

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar compras
  |--------------------------------------------------------------------------
  */

  cargarCompras(): void {

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


    this.compraService
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

          this.compras.set(
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
  | Detalle
  |--------------------------------------------------------------------------
  */

  verDetalle(
    compra:
      Compra
  ): void {

    this.compraSeleccionada.set(
      compra
    );


    this.cargandoDetalle.set(
      true
    );


    this.errorDetalle.set(
      ''
    );


    this.compraService
      .obtener(
        compra.id_compra
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

          this.compraSeleccionada.set(
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


  cerrarDetalle(): void {

    if (
      this.cargandoDetalle()
    ) {

      return;

    }


    this.compraSeleccionada.set(
      null
    );


    this.errorDetalle.set(
      ''
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Filtros
  |--------------------------------------------------------------------------
  */

  actualizarBusqueda(
    valor:
      string
  ): void {

    this.busqueda.set(
      valor
    );

  }


  actualizarEstado(
    valor:
      string
  ): void {

    this.estadoFiltro.set(
      valor as
      EstadoCompra | ''
    );

  }


  actualizarProveedor(
    valor:
      string
  ): void {

    if (
      !valor
    ) {

      this.proveedorFiltro.set(
        null
      );

      return;

    }


    const id =
      Number(
        valor
      );


    this.proveedorFiltro.set(
      Number.isFinite(
        id
      )
        ? id
        : null
    );

  }


  limpiarFiltros(): void {

    this.busqueda.set(
      ''
    );


    this.estadoFiltro.set(
      ''
    );


    this.proveedorFiltro.set(
      null
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Estado
  |--------------------------------------------------------------------------
  */

  nombreEstado(
    estado:
      EstadoCompra
  ): string {

    switch (
    estado
    ) {

      case 'BORRADOR':

        return 'Borrador';


      case 'CONFIRMADA':

        return 'Confirmada';


      case 'RECIBIDA':

        return 'Recibida';


      case 'ANULADA':

        return 'Anulada';

    }

  }


  claseEstado(
    estado:
      EstadoCompra
  ): string {

    switch (
    estado
    ) {

      case 'BORRADOR':

        return (
          'bg-amber-50 text-amber-700 ring-amber-600/20'
        );


      case 'CONFIRMADA':

        return (
          'bg-blue-50 text-blue-700 ring-blue-600/20'
        );


      case 'RECIBIDA':

        return (
          'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
        );


      case 'ANULADA':

        return (
          'bg-red-50 text-red-700 ring-red-600/20'
        );

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Formatos
  |--------------------------------------------------------------------------
  */

  formatearFecha(
    fecha:
      string | null | undefined
  ): string {

    if (
      !fecha
    ) {

      return '—';

    }


    const valor =
      new Date(
        fecha
      );


    if (
      Number.isNaN(
        valor.getTime()
      )
    ) {

      return '—';

    }


    return new Intl
      .DateTimeFormat(
        'es-BO',
        {
          dateStyle:
            'medium',

          timeStyle:
            'short'
        }
      )
      .format(
        valor
      );

  }


  moneda(
    valor:
      number | string | null | undefined
  ): string {

    const numero =
      this.numero(
        valor
      );


    return new Intl
      .NumberFormat(
        'es-BO',
        {
          style:
            'currency',

          currency:
            'BOB',

          minimumFractionDigits:
            2,

          maximumFractionDigits:
            2
        }
      )
      .format(
        numero
      );

  }


  numero(
    valor:
      number | string | null | undefined
  ): number {

    const numero =
      Number(
        valor
        ?? 0
      );


    return Number.isFinite(
      numero
    )
      ? numero
      : 0;

  }


  /*
  |--------------------------------------------------------------------------
  | Usuario
  |--------------------------------------------------------------------------
  */

  nombreUsuario(
    usuario:
      Usuario | null | undefined
  ): string {

    if (
      !usuario
    ) {

      return '—';

    }


    return [

      usuario.nombre,

      usuario.apellido_paterno,

      usuario.apellido_materno

    ]
      .filter(
        Boolean
      )
      .join(
        ' '
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Producto
  |--------------------------------------------------------------------------
  */

  nombreProducto(
    compra:
      Compra,

    idVariante:
      number
  ): string {

    const detalle =
      compra.detalles
        ?.find(
          item =>
            item.id_producto_variante
            === idVariante
        );


    const variante =
      detalle
        ?.producto_variante;


    if (
      !variante
    ) {

      return (
        `Variante #${idVariante}`
      );

    }


    const producto =
      variante.producto
        ?.nombre;


    if (
      producto
    ) {

      return (
        `${producto} - ${variante.nombre}`
      );

    }


    return variante.nombre;

  }


  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  private mensajeError(
    error:
      HttpErrorResponse
  ): string {

    if (
      error.status === 403
    ) {

      return (
        'No tiene permiso para consultar las compras.'
      );

    }


    if (
      error.status === 0
    ) {

      return (
        'No fue posible conectar con el servidor.'
      );

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


    return (
      'No fue posible obtener la información de compras.'
    );

  }

  // puedeEditar(
  //   compra:
  //     Compra
  // ): boolean {

  //   return (
  //     compra.estado_compra
  //     === 'BORRADOR'
  //     &&
  //     this.sessionService
  //       .tienePermiso(
  //         'compra.editar'
  //       )
  //   );

  // }

  /*
|--------------------------------------------------------------------------
| Compra actualizada
|--------------------------------------------------------------------------
*/

  compraActualizada(
    compra:
      Compra
  ): void {

    this.compras.update(
      compras =>
        compras.map(
          item =>
            item.id_compra
              === compra.id_compra

              ? compra

              : item
        )
    );


    /*
    |--------------------------------------------------------------------------
    | Cerrar detalle
    |--------------------------------------------------------------------------
    */

    this.compraSeleccionada.set(
      null
    );


    this.errorDetalle.set(
      ''
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Compra eliminada
  |--------------------------------------------------------------------------
  */

  compraEliminada(
    id:
      number
  ): void {

    this.compras.update(
      compras =>
        compras.filter(
          compra =>
            compra.id_compra
            !== id
        )
    );


    this.compraSeleccionada.set(
      null
    );


    this.errorDetalle.set(
      ''
    );

  }

}