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
  finalize,
  forkJoin,
  of
} from 'rxjs';

import {
  CalendarDays,
  CircleDollarSign,
  Filter,
  PackageSearch,
  ReceiptText,
  RefreshCcw,
  ShoppingCart,
  TrendingUp,
  ArrowLeft,
  LucideAngularModule
} from 'lucide-angular';

import {
  NgxEchartsDirective,
  provideEchartsCore
} from 'ngx-echarts';

import * as echarts
  from 'echarts/core';

import {
  EChartsCoreOption
} from 'echarts/core';

import {
  LineChart
} from 'echarts/charts';

import {
  GridComponent,
  TooltipComponent
} from 'echarts/components';

import {
  CanvasRenderer
} from 'echarts/renderers';

import {
  ReporteVentasService
} from '../../../core/services/reportes/reporte-ventas.service';

import {
  ReporteVentasResumen,
  ReporteVentasProductosResponse
} from '../../../shared/models/reportes/reporte-ventas.model';

import {
  ReporteVentasFiltros
} from '../../../shared/models/reportes/reporte-filtros.model';

import {
  ReporteProductoOperacion,
  ReporteProductoOperacionResumen
} from '../../../shared/models/reportes/reporte-producto-operacion.model';

import {
  Venta
} from '../../../shared/models/venta.model';

import {
  RouterLink
} from '@angular/router';


/*
|--------------------------------------------------------------------------
| Configuración ECharts
|--------------------------------------------------------------------------
*/

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  CanvasRenderer
]);


/*
|--------------------------------------------------------------------------
| Opciones de filtros
|--------------------------------------------------------------------------
*/

interface OpcionFiltro {

  id:
  number;

  nombre:
  string;

  detalle?:
  string;

}


@Component({
  selector:
    'app-sales-reports',

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LucideAngularModule,
    NgxEchartsDirective
  ],

  providers: [
    provideEchartsCore({
      echarts
    })
  ],

  templateUrl:
    './sales-reports.html',

  styleUrl:
    './sales-reports.css'
})
export class SalesReports
  implements OnInit {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly reporteService =
    inject(
      ReporteVentasService
    );


  /*
  |--------------------------------------------------------------------------
  | Estado
  |--------------------------------------------------------------------------
  */

  readonly cargando =
    signal(false);


  readonly errorMensaje =
    signal('');


  /*
  |--------------------------------------------------------------------------
  | Resumen
  |--------------------------------------------------------------------------
  */

  readonly resumen =
    signal<
      ReporteVentasResumen
    >(
      this.resumenVacio()
    );


  readonly resumenProductos =
    signal<
    ReporteProductoOperacionResumen
    >(
      this.resumenProductosVacio()
    );


  /*
  |--------------------------------------------------------------------------
  | Datos
  |--------------------------------------------------------------------------
  */

  readonly ventas =
    signal<
      Venta[]
    >([]);


  readonly productos =
    signal<
    ReporteProductoOperacion[]
    >([]);


  /*
  |--------------------------------------------------------------------------
  | Catálogos para filtros
  |--------------------------------------------------------------------------
  */

  readonly sucursales =
    signal<
      OpcionFiltro[]
    >([]);


  readonly clientes =
    signal<
      OpcionFiltro[]
    >([]);


  readonly vendedores =
    signal<
      OpcionFiltro[]
    >([]);


  readonly variantes =
    signal<
      OpcionFiltro[]
    >([]);


  /*
  |--------------------------------------------------------------------------
  | Filtros
  |--------------------------------------------------------------------------
  */

  filtros:
    ReporteVentasFiltros = {

      id_sucursal:
        null,

      id_cliente:
        null,

      id_usuario_vendedor:
        null,

      id_producto_variante:
        null,

      estado_venta:
        null,

      fecha_desde:
        null,

      fecha_hasta:
        null,

      limite:
        10

    };


  /*
  |--------------------------------------------------------------------------
  | Gráfico
  |--------------------------------------------------------------------------
  */

  readonly graficoVentas =
    signal<
      EChartsCoreOption
    >(
      this.crearGraficoVacio()
    );


  readonly hayVentasCompletadas =
    computed(
      () =>
        this.ventas()
          .some(
            venta =>
              venta.estado_venta
              === 'COMPLETADA'
          )
    );


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly CalendarDays =
    CalendarDays;


  readonly CircleDollarSign =
    CircleDollarSign;


  readonly Filter =
    Filter;


  readonly PackageSearch =
    PackageSearch;


  readonly ReceiptText =
    ReceiptText;


  readonly RefreshCcw =
    RefreshCcw;


  readonly ShoppingCart =
    ShoppingCart;


  readonly TrendingUp =
    TrendingUp;

  readonly ArrowLeft = 
    ArrowLeft;


  /*
  |--------------------------------------------------------------------------
  | Inicio
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    this.cargarReportes(
      true
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar reportes
  |--------------------------------------------------------------------------
  */

  cargarReportes(
    cargarCatalogos:
      boolean = false
  ): void {

    if (
      this.cargando()
    ) {

      return;

    }


    this.errorMensaje.set(
      ''
    );


    if (
      !this.validarFechas()
    ) {

      return;

    }


    this.cargando.set(
      true
    );


    /*
     * El reporte de productos solo representa
     * ventas completadas.
     *
     * Cuando se filtra explícitamente BORRADOR
     * o ANULADA, no mostraremos productos vendidos.
     */

    const consultarProductos =

      !this.filtros.estado_venta

      ||

      this.filtros.estado_venta
      === 'COMPLETADA';


    const productos$ =

      consultarProductos

        ? this.reporteService
          .productos(
            this.filtros
          )

        : of(
          this.respuestaProductosVacia()
        );


    forkJoin({

      resumen:
        this.reporteService
          .resumen(
            this.filtros
          ),

      productos:
        productos$

    })
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

          /*
          |--------------------------------------------------------------------------
          | Resumen
          |--------------------------------------------------------------------------
          */

          this.resumen.set(
            response.resumen
              .resumen
          );


          /*
          |--------------------------------------------------------------------------
          | Ventas
          |--------------------------------------------------------------------------
          */

          const ventas =
            response.resumen
              .data
            ?? [];


          this.ventas.set(
            ventas
          );


          /*
          |--------------------------------------------------------------------------
          | Productos
          |--------------------------------------------------------------------------
          */

          this.resumenProductos.set(
            response.productos
              .resumen
          );


          this.productos.set(
            response.productos
              .data
            ?? []
          );


          /*
          |--------------------------------------------------------------------------
          | Gráfico
          |--------------------------------------------------------------------------
          */

          this.actualizarGrafico(
            ventas
          );


          /*
          |--------------------------------------------------------------------------
          | Catálogos
          |--------------------------------------------------------------------------
          |
          | Solo se generan en la primera carga SIN filtros.
          |
          */

          if (
            cargarCatalogos
          ) {

            this.construirCatalogos(
              ventas
            );

          }

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
  | Aplicar filtros
  |--------------------------------------------------------------------------
  */

  aplicarFiltros(): void {

    this.cargarReportes();

  }


  /*
  |--------------------------------------------------------------------------
  | Limpiar filtros
  |--------------------------------------------------------------------------
  */

  limpiarFiltros(): void {

    this.filtros = {

      id_sucursal:
        null,

      id_cliente:
        null,

      id_usuario_vendedor:
        null,

      id_producto_variante:
        null,

      estado_venta:
        null,

      fecha_desde:
        null,

      fecha_hasta:
        null,

      limite:
        10

    };


    this.cargarReportes();

  }


  /*
  |--------------------------------------------------------------------------
  | Validación fechas
  |--------------------------------------------------------------------------
  */

  private validarFechas(): boolean {

    const desde =
      this.filtros
        .fecha_desde;


    const hasta =
      this.filtros
        .fecha_hasta;


    if (
      desde
      &&
      hasta
      &&
      desde > hasta
    ) {

      this.errorMensaje.set(
        'La fecha final debe ser igual o posterior a la fecha inicial.'
      );

      return false;

    }


    return true;

  }


  /*
  |--------------------------------------------------------------------------
  | Construir catálogos
  |--------------------------------------------------------------------------
  */

  private construirCatalogos(
    ventas:
      Venta[]
  ): void {

    const sucursales =
      new Map<
        number,
        OpcionFiltro
      >();


    const clientes =
      new Map<
        number,
        OpcionFiltro
      >();


    const vendedores =
      new Map<
        number,
        OpcionFiltro
      >();


    const variantes =
      new Map<
        number,
        OpcionFiltro
      >();


    for (
      const venta
      of ventas
    ) {

      /*
      |--------------------------------------------------------------------------
      | Sucursal
      |--------------------------------------------------------------------------
      */

      if (
        venta.sucursal
      ) {

        sucursales.set(

          venta.sucursal
            .id_sucursal,

          {

            id:
              venta.sucursal
                .id_sucursal,

            nombre:
              venta.sucursal
                .nombre

          }

        );

      }


      /*
      |--------------------------------------------------------------------------
      | Cliente
      |--------------------------------------------------------------------------
      */

      if (
        venta.cliente
      ) {

        clientes.set(

          venta.cliente
            .id_cliente,

          {

            id:
              venta.cliente
                .id_cliente,

            nombre:
              venta.cliente
                .nombre_razon_social,

            detalle:
              venta.cliente
                .numero_documento
              ?? undefined

          }

        );

      }


      /*
      |--------------------------------------------------------------------------
      | Vendedor
      |--------------------------------------------------------------------------
      */

      if (
        venta.vendedor
      ) {

        vendedores.set(

          venta.vendedor
            .id_usuario,

          {

            id:
              venta.vendedor
                .id_usuario,

            nombre:
              this.nombreVendedor(
                venta
              )

          }

        );

      }


      /*
      |--------------------------------------------------------------------------
      | Variantes
      |--------------------------------------------------------------------------
      */

      for (
        const detalle
        of venta.detalles
        ?? []
      ) {

        const variante =
          detalle
            .producto_variante;


        if (
          !variante
        ) {

          continue;

        }


        const producto =
          variante
            .producto
            ?.nombre;


        variantes.set(

          variante
            .id_producto_variante,

          {

            id:
              variante
                .id_producto_variante,

            nombre:
              producto

                ? `${producto} — ${variante.nombre}`

                : variante.nombre,

            detalle:
              variante.sku

          }

        );

      }

    }


    this.sucursales.set(
      this.ordenarOpciones(
        Array.from(
          sucursales.values()
        )
      )
    );


    this.clientes.set(
      this.ordenarOpciones(
        Array.from(
          clientes.values()
        )
      )
    );


    this.vendedores.set(
      this.ordenarOpciones(
        Array.from(
          vendedores.values()
        )
      )
    );


    this.variantes.set(
      this.ordenarOpciones(
        Array.from(
          variantes.values()
        )
      )
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Ordenar opciones
  |--------------------------------------------------------------------------
  */

  private ordenarOpciones(
    opciones:
      OpcionFiltro[]
  ): OpcionFiltro[] {

    return opciones.sort(
      (
        a,
        b
      ) =>
        a.nombre
          .localeCompare(
            b.nombre
          )
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Gráfico de ventas
  |--------------------------------------------------------------------------
  */

  private actualizarGrafico(
    ventas:
      Venta[]
  ): void {

    const agrupado =
      new Map<
        string,
        number
      >();


    for (
      const venta
      of ventas
    ) {

      if (
        venta.estado_venta
        !== 'COMPLETADA'
      ) {

        continue;

      }


      if (
        !venta.fecha_venta
      ) {

        continue;

      }


      /*
       * YYYY-MM-DD permite ordenar
       * las fechas correctamente.
       */

      const fecha =
        String(
          venta.fecha_venta
        )
          .slice(
            0,
            10
          );


      const actual =
        agrupado.get(
          fecha
        )
        ?? 0;


      agrupado.set(

        fecha,

        actual
        +
        this.numero(
          venta.total
        )

      );

    }


    const fechas =
      Array.from(
        agrupado.keys()
      )
        .sort();


    const etiquetas =
      fechas.map(
        fecha =>
          this.formatearFechaCorta(
            fecha
          )
      );


    const valores =
      fechas.map(
        fecha =>
          Number(
            (
              agrupado.get(
                fecha
              )
              ?? 0
            )
              .toFixed(
                2
              )
          )
      );


    this.graficoVentas.set({

      tooltip: {
        trigger:
          'axis'
      },

      grid: {

        left:
          20,

        right:
          20,

        top:
          30,

        bottom:
          20,

        containLabel:
          true

      },

      xAxis: {

        type:
          'category',

        boundaryGap:
          false,

        data:
          etiquetas

      },

      yAxis: {

        type:
          'value',

        name:
          'Bs'

      },

      series: [

        {

          name:
            'Ventas',

          type:
            'line',

          smooth:
            true,

          symbolSize:
            8,

          areaStyle: {},

          data:
            valores

        }

      ]

    });

  }


  /*
  |--------------------------------------------------------------------------
  | Producto
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

      return (
        `Variante #${registro.id_producto_variante}`
      );

    }


    const producto =
      variante
        .producto
        ?.nombre;


    return producto

      ? `${producto} — ${variante.nombre}`

      : variante.nombre;

  }


  /*
  |--------------------------------------------------------------------------
  | Cliente
  |--------------------------------------------------------------------------
  */

  nombreCliente(
    venta:
      Venta
  ): string {

    return (
      venta.cliente
        ?.nombre_razon_social
      ?? 'Consumidor final'
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Vendedor
  |--------------------------------------------------------------------------
  */

  nombreVendedor(
    venta:
      Venta
  ): string {

    const vendedor =
      venta.vendedor;


    if (
      !vendedor
    ) {

      return '—';

    }


    return [

      vendedor.nombre,

      vendedor
        .apellido_paterno,

      vendedor
        .apellido_materno

    ]
      .filter(
        valor =>
          Boolean(
            valor
          )
      )
      .join(
        ' '
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Estado
  |--------------------------------------------------------------------------
  */

  nombreEstado(
    estado:
      string
  ): string {

    switch (
    estado
    ) {

      case 'BORRADOR':

        return 'Borrador';


      case 'COMPLETADA':

        return 'Completada';


      case 'ANULADA':

        return 'Anulada';


      default:

        return estado;

    }

  }


  claseEstado(
    estado:
      string
  ): string {

    switch (
    estado
    ) {

      case 'COMPLETADA':

        return (
          'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
        );


      case 'ANULADA':

        return (
          'bg-red-50 text-red-700 ring-red-600/20'
        );


      default:

        return (
          'bg-amber-50 text-amber-700 ring-amber-600/20'
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
      string | null
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


  private formatearFechaCorta(
    value:
      string
  ): string {

    const partes =
      value.split(
        '-'
      );


    if (
      partes.length !== 3
    ) {

      return value;

    }


    return (
      `${partes[2]}/${partes[1]}`
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Decimal
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
  | Valores vacíos
  |--------------------------------------------------------------------------
  */

  private resumenVacio():
  ReporteVentasResumen {

    return {

      ventas:
        0,

      borradores:
        0,

      completadas:
        0,

      anuladas:
        0,

      subtotal_completado:
        0,

      descuento_completado:
        0,

      total_vendido:
        0,

      ticket_promedio:
        0

    };

  }


  private resumenProductosVacio():
  ReporteProductoOperacionResumen {

    return {

      productos:
        0,

      cantidad_total:
        0,

      importe_total:
        0

    };

  }


  private respuestaProductosVacia():
    ReporteVentasProductosResponse {

    return {

      resumen:
        this.resumenProductosVacio(),

      data:
        []

    };

  }


  private crearGraficoVacio():
    EChartsCoreOption {

    return {

      xAxis: {

        type:
          'category',

        data:
          []

      },

      yAxis: {

        type:
          'value'

      },

      series: [

        {

          type:
            'line',

          data:
            []

        }

      ]

    };

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
        'No tiene permiso para consultar reportes de ventas.'
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
      'No fue posible cargar el reporte de ventas.'
    );

  }

}