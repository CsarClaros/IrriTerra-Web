import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  RouterLink
} from '@angular/router';

import {
  finalize
} from 'rxjs';

import {
  EChartsOption
} from 'echarts';

import {
  NgxEchartsDirective
} from 'ngx-echarts';

import {
  AlertTriangle,
  ArrowLeftRight,
  ArrowRight,
  BarChart3,
  Boxes,
  Clock3,
  LucideAngularModule,
  RefreshCcw,
  ShoppingCart
} from 'lucide-angular';

import {
  DashboardGeneralService
} from '../../core/services/dashboard/dashboard-general.service';

import {
  SessionService
} from '../../core/services/session.service';

import {
  LanguageService
} from '../../core/services/language.service';

import {
  DashboardGeneral
} from '../../shared/models/dashboard-general.model';

import {
  ReporteProductoOperacion
} from '../../shared/models/reportes/reporte-producto-operacion.model';

import { TransferenciaInventario } from "../../shared/models/transferencia-inventario.model";

import { ReporteStockInventario } from "../../shared/models/reportes/reporte-inventario.model";


@Component({
  selector:
    'app-dashboard-overview',

  standalone:
    true,

  imports: [
    RouterLink,
    LucideAngularModule,
    NgxEchartsDirective
  ],

  templateUrl:
    './overview.html',

  styleUrl:
    './overview.css'
})
export class Overview {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly dashboardService =
    inject(
      DashboardGeneralService
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

  readonly dashboard =
    signal<
      DashboardGeneral | null
    >(null);


  readonly cargando =
    signal(
      false
    );


  readonly errorMensaje =
    signal(
      ''
    );


  /*
  |--------------------------------------------------------------------------
  | Usuario
  |--------------------------------------------------------------------------
  */

  readonly usuario =
    this.sessionService
      .usuario;


  readonly nombreCompleto =
    computed(
      () => {

        const usuario =
          this.usuario();


        if (
          !usuario
        ) {

          return this.t(
            'Usuario',
            'User'
          );

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
    );


  readonly rol =
    computed(
      () =>
        this.sessionService
          .rol()
          ?.nombre
        ?? '-'
    );


  readonly sucursal =
    computed(
      () =>
        this.sessionService
          .sucursal()
          ?.nombre
        ?? this.t(
          'Sin sucursal asignada',
          'No branch assigned'
        )
    );


  /*
  |--------------------------------------------------------------------------
  | Permisos
  |--------------------------------------------------------------------------
  */

  readonly puedeVerVentas =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'reporte_ventas.ver'
          )
    );


  readonly puedeVerInventario =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'reporte_inventario.ver'
          )
    );


  readonly puedeVerCompras =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'reporte_compras.ver'
          )
    );


  readonly puedeVerTransferencias =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'reporte_transferencias.ver'
          )
    );


  readonly tieneReportes =
    computed(
      () =>
        this.puedeVerVentas()
        ||
        this.puedeVerInventario()
        ||
        this.puedeVerCompras()
        ||
        this.puedeVerTransferencias()
    );

  readonly hayErroresParciales =
    computed(
      () =>
        (
          this.dashboard()
            ?.errores
            .length
          ?? 0
        )
        > 0
    );

  /*
  |--------------------------------------------------------------------------
  | ECharts - Estados de ventas
  |--------------------------------------------------------------------------
  */

  readonly graficoVentasEstados =
    computed<EChartsOption>(
      () => {

        const resumen =
          this.dashboard()
            ?.ventas
            ?.resumen;


        if (
          !resumen
        ) {

          return {};

        }


        return this.crearGraficoCircular(

          this.t(
            'Ventas',
            'Sales'
          ),

          [

            {
              name:
                this.t(
                  'Borrador',
                  'Draft'
                ),

              value:
                resumen.borradores
            },

            {
              name:
                this.t(
                  'Completadas',
                  'Completed'
                ),

              value:
                resumen.completadas
            },

            {
              name:
                this.t(
                  'Anuladas',
                  'Cancelled'
                ),

              value:
                resumen.anuladas
            }

          ]

        );

      }
    );


  /*
  |--------------------------------------------------------------------------
  | ECharts - Productos más vendidos
  |--------------------------------------------------------------------------
  */

  readonly graficoProductosVendidos =
    computed<EChartsOption>(
      () => {

        const productos =
          this.dashboard()
            ?.ventas
            ?.productos
          ?? [];


        if (
          productos.length === 0
        ) {

          return {};

        }


        return {

          tooltip: {

            trigger:
              'axis',

            axisPointer: {
              type:
                'shadow'
            }

          },


          grid: {

            left:
              20,

            right:
              30,

            top:
              20,

            bottom:
              20,

            containLabel:
              true

          },


          xAxis: {

            type:
              'value',

            name:
              this.t(
                'Cantidad',
                'Quantity'
              )

          },


          yAxis: {

            type:
              'category',

            inverse:
              true,

            data:
              productos.map(
                producto =>
                  this.nombreProducto(
                    producto
                  )
              ),

            axisLabel: {

              width:
                180,

              overflow:
                'truncate'

            }

          },


          series: [

            {

              name:
                this.t(
                  'Cantidad vendida',
                  'Quantity sold'
                ),

              type:
                'bar',

              data:
                productos.map(
                  producto =>
                    Number(
                      producto.cantidad
                    )
                ),

              barMaxWidth:
                30

            }

          ]

        };

      }
    );


  /*
  |--------------------------------------------------------------------------
  | ECharts - Inventario crítico
  |--------------------------------------------------------------------------
  */

  readonly graficoInventarioCritico =
    computed<EChartsOption>(
      () => {

        const resumen =
          this.dashboard()
            ?.inventario
            ?.resumenCritico;


        if (
          !resumen
        ) {

          return {};

        }


        return this.crearGraficoCircular(

          this.t(
            'Stock crítico',
            'Critical stock'
          ),

          [

            {
              name:
                this.t(
                  'Agotados',
                  'Out of stock'
                ),

              value:
                resumen.agotados
            },

            {
              name:
                this.t(
                  'Bajo mínimo',
                  'Below minimum'
                ),

              value:
                resumen.bajo_minimo
            }

          ]

        );

      }
    );


  /*
  |--------------------------------------------------------------------------
  | ECharts - Estados de compras
  |--------------------------------------------------------------------------
  */

  readonly graficoComprasEstados =
    computed<EChartsOption>(
      () => {

        const resumen =
          this.dashboard()
            ?.compras
            ?.resumen;


        if (
          !resumen
        ) {

          return {};

        }


        return this.crearGraficoCircular(

          this.t(
            'Compras',
            'Purchases'
          ),

          [

            {
              name:
                this.t(
                  'Borrador',
                  'Draft'
                ),

              value:
                resumen.borradores
            },

            {
              name:
                this.t(
                  'Confirmadas',
                  'Confirmed'
                ),

              value:
                resumen.confirmadas
            },

            {
              name:
                this.t(
                  'Recibidas',
                  'Received'
                ),

              value:
                resumen.recibidas
            },

            {
              name:
                this.t(
                  'Anuladas',
                  'Cancelled'
                ),

              value:
                resumen.anuladas
            }

          ]

        );

      }
    );


  /*
  |--------------------------------------------------------------------------
  | ECharts - Estados de transferencias
  |--------------------------------------------------------------------------
  */

  readonly graficoTransferenciasEstados =
    computed<EChartsOption>(
      () => {

        const resumen =
          this.dashboard()
            ?.transferencias
            ?.resumen;


        if (
          !resumen
        ) {

          return {};

        }


        return this.crearGraficoCircular(

          this.t(
            'Transferencias',
            'Transfers'
          ),

          [

            {
              name:
                this.t(
                  'Pendientes',
                  'Pending'
                ),

              value:
                resumen.pendientes
            },

            {
              name:
                this.t(
                  'En tránsito',
                  'In transit'
                ),

              value:
                resumen.en_transito
            },

            {
              name:
                this.t(
                  'Completadas',
                  'Completed'
                ),

              value:
                resumen.completadas
            },

            {
              name:
                this.t(
                  'Rechazadas',
                  'Rejected'
                ),

              value:
                resumen.rechazadas
            }

          ]

        );

      }
    );


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly ShoppingCart =
    ShoppingCart;


  readonly Boxes =
    Boxes;


  readonly ArrowLeftRight =
    ArrowLeftRight;


  readonly BarChart3 =
    BarChart3;


  readonly RefreshCcw =
    RefreshCcw;


  readonly AlertTriangle =
    AlertTriangle;


  readonly ArrowRight =
    ArrowRight;


  readonly Clock3 =
    Clock3;

  /*
  |--------------------------------------------------------------------------
  | Inicio
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    this.cargarDashboard();

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar dashboard
  |--------------------------------------------------------------------------
  */

  cargarDashboard(): void {

    this.cargando.set(
      true
    );


    this.errorMensaje.set(
      ''
    );


    this.dashboardService
      .cargar()
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

          this.dashboard.set(
            response
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
  | Gráfico circular reutilizable
  |--------------------------------------------------------------------------
  */

  private crearGraficoCircular(

    nombre:
      string,

    datos:
      {
        name:
        string;

        value:
        number;
      }[]

  ): EChartsOption {

    return {

      tooltip: {

        trigger:
          'item',

        formatter:
          '{b}: {c} ({d}%)'

      },


      legend: {

        bottom:
          0,

        type:
          'scroll'

      },


      series: [

        {

          name:
            nombre,

          type:
            'pie',

          radius: [
            '45%',
            '70%'
          ],

          center: [
            '50%',
            '45%'
          ],

          avoidLabelOverlap:
            true,

          itemStyle: {

            borderRadius:
              6,

            borderWidth:
              2

          },

          label: {

            show:
              true,

            formatter:
              '{b}\n{c}'

          },

          data:
            datos

        }

      ]

    };

  }


  /*
  |--------------------------------------------------------------------------
  | Productos
  |--------------------------------------------------------------------------
  */

  nombreProducto(
    registro:
      ReporteProductoOperacion
  ): string {

    const variante =
      registro
        .producto_variante;


    if (
      !variante
    ) {

      return this.t(
        'Producto',
        'Product'
      );

    }


    const producto =
      variante
        .producto
        ?.nombre
      ?? this.t(
        'Producto',
        'Product'
      );


    return (
      `${producto} - ${variante.nombre}`
    );

  }


  /*
|--------------------------------------------------------------------------
| Stock crítico
|--------------------------------------------------------------------------
*/

  nombreProductoStock(
    registro:
      ReporteStockInventario
  ): string {

    const variante =
      registro
        .producto_variante;


    const producto =
      variante
        ?.producto
        ?.nombre
      ?? this.t(
        'Producto',
        'Product'
      );


    return (
      `${producto} - ${variante?.nombre ?? '-'}`
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Transferencias
  |--------------------------------------------------------------------------
  */

  cantidadTransferencia(
    transferencia:
      TransferenciaInventario
  ): number {

    return (
      transferencia
        .detalles
      ?? []
    )
      .reduce(
        (
          total,
          detalle
        ) =>
          total
          +
          Number(
            detalle.cantidad
            ?? 0
          ),

        0
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Estados de venta
  |--------------------------------------------------------------------------
  */

  nombreEstadoVenta(
    estado:
      string
  ): string {

    switch (
    estado
    ) {

      case 'BORRADOR':

        return this.t(
          'Borrador',
          'Draft'
        );


      case 'COMPLETADA':

        return this.t(
          'Completada',
          'Completed'
        );


      case 'ANULADA':

        return this.t(
          'Anulada',
          'Cancelled'
        );


      default:

        return estado;

    }

  }


  claseEstadoVenta(
    estado:
      string
  ): string {

    switch (
    estado
    ) {

      case 'BORRADOR':

        return (
          'bg-gray-100 text-gray-700'
        );


      case 'COMPLETADA':

        return (
          'bg-emerald-100 text-emerald-700'
        );


      case 'ANULADA':

        return (
          'bg-red-100 text-red-700'
        );


      default:

        return (
          'bg-gray-100 text-gray-700'
        );

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Estados de compra
  |--------------------------------------------------------------------------
  */

  nombreEstadoCompra(
    estado:
      string
  ): string {

    switch (
    estado
    ) {

      case 'BORRADOR':

        return this.t(
          'Borrador',
          'Draft'
        );


      case 'CONFIRMADA':

        return this.t(
          'Confirmada',
          'Confirmed'
        );


      case 'RECIBIDA':

        return this.t(
          'Recibida',
          'Received'
        );


      case 'ANULADA':

        return this.t(
          'Anulada',
          'Cancelled'
        );


      default:

        return estado;

    }

  }


  claseEstadoCompra(
    estado:
      string
  ): string {

    switch (
    estado
    ) {

      case 'BORRADOR':

        return (
          'bg-gray-100 text-gray-700'
        );


      case 'CONFIRMADA':

        return (
          'bg-blue-100 text-blue-700'
        );


      case 'RECIBIDA':

        return (
          'bg-emerald-100 text-emerald-700'
        );


      case 'ANULADA':

        return (
          'bg-red-100 text-red-700'
        );


      default:

        return (
          'bg-gray-100 text-gray-700'
        );

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Estados de transferencia
  |--------------------------------------------------------------------------
  */

  nombreEstadoTransferencia(
    estado:
      string
  ): string {

    switch (
    estado
    ) {

      case 'PENDIENTE':

        return this.t(
          'Pendiente',
          'Pending'
        );


      case 'EN_TRANSITO':

        return this.t(
          'En tránsito',
          'In transit'
        );


      case 'COMPLETADA':

        return this.t(
          'Completada',
          'Completed'
        );


      case 'RECHAZADA':

        return this.t(
          'Rechazada',
          'Rejected'
        );


      default:

        return estado;

    }

  }


  claseEstadoTransferencia(
    estado:
      string
  ): string {

    switch (
    estado
    ) {

      case 'PENDIENTE':

        return (
          'bg-amber-100 text-amber-700'
        );


      case 'EN_TRANSITO':

        return (
          'bg-blue-100 text-blue-700'
        );


      case 'COMPLETADA':

        return (
          'bg-emerald-100 text-emerald-700'
        );


      case 'RECHAZADA':

        return (
          'bg-red-100 text-red-700'
        );


      default:

        return (
          'bg-gray-100 text-gray-700'
        );

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Estado de stock
  |--------------------------------------------------------------------------
  */

  nombreEstadoStock(
    estado:
      string | null
  ): string {

    switch (
    estado
    ) {

      case 'AGOTADO':

        return this.t(
          'Agotado',
          'Out of stock'
        );


      case 'BAJO':

        return this.t(
          'Bajo mínimo',
          'Below minimum'
        );


      default:

        return (
          estado
          ?? '-'
        );

    }

  }


  claseEstadoStock(
    estado:
      string | null
  ): string {

    switch (
    estado
    ) {

      case 'AGOTADO':

        return (
          'bg-red-100 text-red-700'
        );


      case 'BAJO':

        return (
          'bg-amber-100 text-amber-700'
        );


      default:

        return (
          'bg-gray-100 text-gray-700'
        );

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Fechas
  |--------------------------------------------------------------------------
  */

  formatearFecha(
    fecha:
      string | null | undefined
  ): string {

    if (
      !fecha
    ) {

      return '-';

    }


    const date =
      new Date(
        fecha
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return fecha;

    }


    return new Intl
      .DateTimeFormat(
        'es-BO',
        {
          dateStyle:
            'short',

          timeStyle:
            'short'
        }
      )
      .format(
        date
      );

  }

  nombreModulo(
    modulo:
      string
  ): string {

    switch (
    modulo
    ) {

      case 'VENTAS':

        return this.t(
          'Ventas',
          'Sales'
        );


      case 'INVENTARIO':

        return this.t(
          'Inventario',
          'Inventory'
        );


      case 'COMPRAS':

        return this.t(
          'Compras',
          'Purchases'
        );


      case 'TRANSFERENCIAS':

        return this.t(
          'Transferencias',
          'Transfers'
        );


      default:

        return modulo;

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Formato
  |--------------------------------------------------------------------------
  */

  moneda(
    valor:
      number | string | null | undefined
  ): string {

    const numero =
      Number(
        valor
        ?? 0
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
            2
        }
      )
      .format(
        Number.isFinite(
          numero
        )
          ? numero
          : 0
      );

  }


  cantidad(
    valor:
      number | string | null | undefined
  ): string {

    const numero =
      Number(
        valor
        ?? 0
      );


    return new Intl
      .NumberFormat(
        'es-BO',
        {
          minimumFractionDigits:
            0,

          maximumFractionDigits:
            3
        }
      )
      .format(
        Number.isFinite(
          numero
        )
          ? numero
          : 0
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Idioma
  |--------------------------------------------------------------------------
  */

  t(
    es:
      string,

    en:
      string
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
      error.status === 401
    ) {

      return this.t(
        'La sesión ya no es válida.',
        'The session is no longer valid.'
      );

    }


    if (
      error.status === 403
    ) {

      return this.t(
        'No tiene permisos para consultar parte de la información del dashboard.',
        'You do not have permission to view part of the dashboard information.'
      );

    }


    if (
      typeof error.error
        ?.message
      === 'string'
    ) {

      return (
        error.error.message
      );

    }


    return this.t(
      'No fue posible cargar la información del dashboard.',
      'Unable to load dashboard information.'
    );

  }

}