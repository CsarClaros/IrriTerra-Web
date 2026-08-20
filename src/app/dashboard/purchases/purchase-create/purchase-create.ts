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
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  finalize,
  forkJoin,
  Observable
} from 'rxjs';

import {
  ArrowLeft,
  Plus,
  Save,
  ShoppingCart,
  Trash2,
  LucideAngularModule
} from 'lucide-angular';

import {
  SessionService
} from '../../../core/services/session.service';

import {
  SucursalService
} from '../../../core/services/organizacion/sucursal.service';

import {
  ProductoVarianteService
} from '../../../core/services/inventario/producto-variante.service';

import {
  ProveedorService
} from '../../../core/services/compras/proveedor.service';

import {
  CompraService
} from '../../../core/services/compras/compra.service';

import {
  Compra,
  CompraActualizarRequest,
  CompraCrearRequest
} from '../../../shared/models/compra.model';

import {
  ProductoVariante
} from '../../../shared/models/producto-variante.model';

import {
  Proveedor
} from '../../../shared/models/proveedor.model';

import {
  Sucursal
} from '../../../shared/models/sucursal.model';

import { PrecioProductoVarianteService } from '../../../core/services/catalogos/precio-producto-variante.service';

import { PrecioProductoVariante } from '../../../shared/models/precio-producto-variante.model';

interface LineaCompra {

  id_producto_variante:
  number;

  producto:
  string;

  variante:
  string;

  sku:
  string;

  unidad_medida:
  string;

  cantidad:
  number;

  costo_unitario:
  number;

  descuento:
  number;

  observaciones:
  string;

}


@Component({
  selector:
    'app-purchase-create',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LucideAngularModule
  ],

  templateUrl:
    './purchase-create.html',

  styleUrl:
    './purchase-create.css'
})
export class PurchaseCreate
  implements OnInit {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly sessionService =
    inject(
      SessionService
    );


  private readonly sucursalService =
    inject(
      SucursalService
    );


  private readonly varianteService =
    inject(
      ProductoVarianteService
    );


  private readonly precioProductoVarianteService =
    inject(
      PrecioProductoVarianteService
    );


  private readonly proveedorService =
    inject(
      ProveedorService
    );


  private readonly compraService =
    inject(
      CompraService
    );


  private readonly router =
    inject(
      Router
    );


  private readonly route =
    inject(
      ActivatedRoute
    );


  /*
  |--------------------------------------------------------------------------
  | Usuario
  |--------------------------------------------------------------------------
  */

  readonly usuario =
    this.sessionService.usuario;


  /*
  |--------------------------------------------------------------------------
  | Catálogos
  |--------------------------------------------------------------------------
  */

  readonly precios =
    signal<
      PrecioProductoVariante[]
    >([]);

  readonly proveedores =
    signal<
      Proveedor[]
    >([]);


  readonly sucursales =
    signal<
      Sucursal[]
    >([]);


  readonly variantes =
    signal<
      ProductoVariante[]
    >([]);


  /*
  |--------------------------------------------------------------------------
  | Formulario
  |--------------------------------------------------------------------------
  */

  readonly idProveedor =
    signal<
      number | null
    >(null);


  readonly idSucursal =
    signal<
      number | null
    >(null);


  readonly idVarianteSeleccionada =
    signal<
      number | null
    >(null);


  readonly lineas =
    signal<
      LineaCompra[]
    >([]);


  numeroFactura =
    '';


  fechaCompra =
    '';


  observacionesCompra =
    '';


  /*
  |--------------------------------------------------------------------------
  | Edición
  |--------------------------------------------------------------------------
  */

  readonly modoEdicion =
    signal(false);


  readonly idCompra =
    signal<
      number | null
    >(null);


  readonly codigoCompra =
    signal('');


  /*
  |--------------------------------------------------------------------------
  | Estado
  |--------------------------------------------------------------------------
  */

  readonly cargando =
    signal(false);


  readonly guardando =
    signal(false);


  readonly errorMensaje =
    signal('');


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly ArrowLeft =
    ArrowLeft;


  readonly Plus =
    Plus;


  readonly Save =
    Save;


  readonly ShoppingCart =
    ShoppingCart;


  readonly Trash2 =
    Trash2;


  /*
  |--------------------------------------------------------------------------
  | Catálogos derivados
  |--------------------------------------------------------------------------
  */

  readonly variantesDisponibles =
    computed(
      () => {

        const agregadas =
          new Set(
            this.lineas()
              .map(
                linea =>
                  linea.id_producto_variante
              )
          );


        return this.variantes()
          .filter(
            variante =>
              variante.estado_registro
              === 'A'
              &&
              !agregadas.has(
                variante.id_producto_variante
              )
          );

      }
    );


  readonly varianteSeleccionada =
    computed(
      () => {

        const id =
          this.idVarianteSeleccionada();


        if (
          id === null
        ) {

          return null;

        }


        return this.variantes()
          .find(
            variante =>
              variante.id_producto_variante
              === id
          )
          ?? null;

      }
    );


  /*
  |--------------------------------------------------------------------------
  | Totales visuales
  |--------------------------------------------------------------------------
  */

  readonly subtotalVisual =
    computed(
      () =>
        this.redondear(
          this.lineas()
            .reduce(
              (
                total,
                linea
              ) =>
                total
                +
                (
                  this.numero(
                    linea.cantidad
                  )
                  *
                  this.numero(
                    linea.costo_unitario
                  )
                ),
              0
            )
        )
    );


  readonly descuentoVisual =
    computed(
      () =>
        this.redondear(
          this.lineas()
            .reduce(
              (
                total,
                linea
              ) =>
                total
                +
                this.numero(
                  linea.descuento
                ),
              0
            )
        )
    );


  readonly totalVisual =
    computed(
      () =>
        this.redondear(
          this.subtotalVisual()
          -
          this.descuentoVisual()
        )
    );


  /*
  |--------------------------------------------------------------------------
  | Inicialización
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    const parametroId =
      this.route
        .snapshot
        .paramMap
        .get(
          'id'
        );


    if (
      parametroId
    ) {

      const id =
        Number(
          parametroId
        );


      if (
        Number.isInteger(
          id
        )
        &&
        id > 0
      ) {

        this.modoEdicion.set(
          true
        );


        this.idCompra.set(
          id
        );

      }

    }


    this.cargarDatos();

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar catálogos
  |--------------------------------------------------------------------------
  */

  private cargarDatos(): void {

    this.cargando.set(
      true
    );


    this.errorMensaje.set(
      ''
    );


    forkJoin({

      proveedores:
        this.proveedorService
          .listar(),

      sucursales:
        this.sucursalService
          .listar(),

      variantes:
        this.varianteService
          .listar(),

      precios:
        this.precioProductoVarianteService
          .listar()

    })
      .subscribe({

        next: response => {

          this.proveedores.set(

            (
              response
                .proveedores
                .data
              ?? []
            )
              .filter(
                proveedor =>
                  proveedor.estado_registro
                  === 'A'
              )

          );


          this.sucursales.set(

            (
              response
                .sucursales
                .data
              ?? []
            )
              .filter(
                sucursal =>
                  sucursal.estado_registro
                  === 'A'
              )

          );


          this.variantes.set(

            (
              response
                .variantes
                .data
              ?? []
            )
              .filter(
                variante =>
                  variante.estado_registro
                  === 'A'
              )

          );

          this.precios.set(

            (
              response
                .precios
                .data
              ?? []
            )
              .filter(
                precio =>
                  precio.estado_registro
                  === 'A'
              )

          );


          const id =
            this.idCompra();


          if (
            this.modoEdicion()
            &&
            id !== null
          ) {

            this.cargarCompra(
              id
            );

            return;

          }


          this.prepararNuevaCompra();


          this.cargando.set(
            false
          );

        },


        error: (
          error:
            HttpErrorResponse
        ) => {

          this.cargando.set(
            false
          );


          this.errorMensaje.set(
            this.mensajeError(
              error
            )
          );

        }

      });

  }

  costoCompraVariante(
    idProductoVariante:
      number
  ): number | null {

    const precio =
      this.precios()
        .find(
          item =>
            item.id_producto_variante
            === idProductoVariante
        );


    if (
      !precio
      ||
      precio.costo_compra === undefined
      ||
      precio.costo_compra === null
    ) {

      return null;

    }


    const costo =
      Number(
        precio.costo_compra
      );


    if (
      !Number.isFinite(
        costo
      )
    ) {

      return null;

    }


    return costo;

  }


  /*
  |--------------------------------------------------------------------------
  | Nueva compra
  |--------------------------------------------------------------------------
  */

  private prepararNuevaCompra(): void {

    const usuario =
      this.usuario();


    const idSucursalUsuario =
      usuario
        ?.sucursal
        ?.id_sucursal
      ?? null;


    if (
      idSucursalUsuario
      !== null
    ) {

      const existe =
        this.sucursales()
          .some(
            sucursal =>
              sucursal.id_sucursal
              === idSucursalUsuario
          );


      if (
        existe
      ) {

        this.idSucursal.set(
          idSucursalUsuario
        );

      }

    }


    this.fechaCompra =
      this.fechaLocalActual();

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar compra
  |--------------------------------------------------------------------------
  */

  private cargarCompra(
    id:
      number
  ): void {

    this.compraService
      .obtener(
        id
      )
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

          const compra =
            response.data;


          if (
            compra.estado_compra
            !== 'BORRADOR'
          ) {

            this.errorMensaje.set(
              'Solo pueden editarse compras en borrador.'
            );

            return;

          }


          this.codigoCompra.set(
            compra.codigo_compra
          );


          this.idProveedor.set(
            compra.id_proveedor
          );


          this.idSucursal.set(
            compra.id_sucursal
          );


          this.numeroFactura =
            compra.numero_factura
            ?? '';


          this.fechaCompra =
            this.fechaParaInput(
              compra.fecha_compra
            );


          this.observacionesCompra =
            compra.observaciones
            ?? '';


          const lineas:
            LineaCompra[] =

            (
              compra.detalles
              ?? []
            )
              .map(
                detalle => {

                  const variante =
                    detalle
                      .producto_variante
                    ??
                    this.variantes()
                      .find(
                        item =>
                          item.id_producto_variante
                          === detalle.id_producto_variante
                      )
                    ??
                    null;


                  return {

                    id_producto_variante:
                      detalle.id_producto_variante,

                    producto:
                      variante
                        ?.producto
                        ?.nombre
                      ?? 'Producto',

                    variante:
                      variante
                        ?.nombre
                      ?? `Variante #${detalle.id_producto_variante}`,

                    sku:
                      variante
                        ?.sku
                      ?? '—',

                    unidad_medida:
                      variante
                        ?.unidad_medida
                      ?? '',

                    cantidad:
                      this.numero(
                        detalle.cantidad
                      ),

                    costo_unitario:
                      this.numero(
                        detalle.costo_unitario
                      ),

                    descuento:
                      this.numero(
                        detalle.descuento
                      ),

                    observaciones:
                      detalle.observaciones
                      ?? ''

                  };

                }
              );


          this.lineas.set(
            lineas
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
  | Selecciones
  |--------------------------------------------------------------------------
  */

  actualizarProveedor(
    valor:
      string
  ): void {

    this.idProveedor.set(
      this.idDesdeSelect(
        valor
      )
    );

  }


  actualizarSucursal(
    valor:
      string
  ): void {

    this.idSucursal.set(
      this.idDesdeSelect(
        valor
      )
    );

  }


  actualizarVariante(
    valor:
      string
  ): void {

    this.idVarianteSeleccionada.set(
      this.idDesdeSelect(
        valor
      )
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Agregar producto
  |--------------------------------------------------------------------------
  */

  agregarVariante(): void {

    const variante =
      this.varianteSeleccionada();


    if (
      !variante
    ) {

      this.errorMensaje.set(
        'Seleccione una variante de producto.'
      );

      return;

    }


    const existe =
      this.lineas()
        .some(
          linea =>
            linea.id_producto_variante
            === variante.id_producto_variante
        );


    if (
      existe
    ) {

      this.errorMensaje.set(
        'La variante ya fue agregada a la compra.'
      );

      return;

    }


    const costoRegistrado =
    this.costoCompraVariante(
        variante.id_producto_variante
    );

    const linea:
      LineaCompra = {

      id_producto_variante:
        variante.id_producto_variante,

      producto:
        variante.producto
          ?.nombre
        ?? 'Producto',

      variante:
        variante.nombre,

      sku:
        variante.sku,

      unidad_medida:
        variante.unidad_medida,

      cantidad:
        1,

      costo_unitario:
        costoRegistrado
        ?? 0,

      descuento:
        0,

      observaciones:
        ''

    };


    this.lineas.update(
      lineas => [
        ...lineas,
        linea
      ]
    );


    this.idVarianteSeleccionada.set(
      null
    );


    this.errorMensaje.set(
      ''
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Eliminar producto
  |--------------------------------------------------------------------------
  */

  eliminarLinea(
    idProductoVariante:
      number
  ): void {

    this.lineas.update(
      lineas =>
        lineas.filter(
          linea =>
            linea.id_producto_variante
            !== idProductoVariante
        )
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Actualizar campos detalle
  |--------------------------------------------------------------------------
  */

  actualizarCantidad(
    idProductoVariante:
      number,

    valor:
      number
  ): void {

    this.actualizarLinea(
      idProductoVariante,
      {
        cantidad:
          valor
      }
    );

  }


  actualizarCosto(
    idProductoVariante:
      number,

    valor:
      number
  ): void {

    this.actualizarLinea(
      idProductoVariante,
      {
        costo_unitario:
          valor
      }
    );

  }


  actualizarDescuento(
    idProductoVariante:
      number,

    valor:
      number
  ): void {

    this.actualizarLinea(
      idProductoVariante,
      {
        descuento:
          valor
      }
    );

  }


  actualizarObservacion(
    idProductoVariante:
      number,

    valor:
      string
  ): void {

    this.actualizarLinea(
      idProductoVariante,
      {
        observaciones:
          valor
      }
    );

  }


  private actualizarLinea(
    idProductoVariante:
      number,

    cambios:
      Partial<
        LineaCompra
      >
  ): void {

    this.lineas.update(
      lineas =>
        lineas.map(
          linea =>
            linea.id_producto_variante
              === idProductoVariante

              ? {
                ...linea,
                ...cambios
              }

              : linea
        )
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Subtotal detalle
  |--------------------------------------------------------------------------
  */

  subtotalLinea(
    linea:
      LineaCompra
  ): number {

    const bruto =
      this.numero(
        linea.cantidad
      )
      *
      this.numero(
        linea.costo_unitario
      );


    return this.redondear(
      bruto
      -
      this.numero(
        linea.descuento
      )
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Validación detalle
  |--------------------------------------------------------------------------
  */

  errorLinea(
    linea:
      LineaCompra
  ): string {

    const cantidad =
      this.numero(
        linea.cantidad
      );


    const costo =
      this.numero(
        linea.costo_unitario
      );


    const descuento =
      this.numero(
        linea.descuento
      );


    if (
      cantidad <= 0
    ) {

      return (
        'La cantidad debe ser mayor que cero.'
      );

    }


    if (
      !this.decimalesValidos(
        cantidad,
        3
      )
    ) {

      return (
        'La cantidad admite máximo 3 decimales.'
      );

    }


    if (
      costo <= 0
    ) {

      return (
        'El costo unitario debe ser mayor que cero.'
      );

    }


    if (
      !this.decimalesValidos(
        costo,
        2
      )
    ) {

      return (
        'El costo admite máximo 2 decimales.'
      );

    }


    if (
      descuento < 0
    ) {

      return (
        'El descuento no puede ser negativo.'
      );

    }


    if (
      !this.decimalesValidos(
        descuento,
        2
      )
    ) {

      return (
        'El descuento admite máximo 2 decimales.'
      );

    }


    const importeBruto =
      cantidad
      *
      costo;


    if (
      descuento
      > importeBruto
    ) {

      return (
        'El descuento no puede superar el importe bruto.'
      );

    }


    return '';

  }


  /*
  |--------------------------------------------------------------------------
  | Guardar
  |--------------------------------------------------------------------------
  */

  guardar(): void {

    if (
      this.guardando()
    ) {

      return;

    }


    this.errorMensaje.set(
      ''
    );


    const usuario =
      this.usuario();


    if (
      !usuario
    ) {

      this.errorMensaje.set(
        'No fue posible identificar al usuario autenticado.'
      );

      return;

    }


    const idProveedor =
      this.idProveedor();


    if (
      idProveedor === null
    ) {

      this.errorMensaje.set(
        'Seleccione un proveedor.'
      );

      return;

    }


    const idSucursal =
      this.idSucursal();


    if (
      idSucursal === null
    ) {

      this.errorMensaje.set(
        'Seleccione una sucursal.'
      );

      return;

    }


    const lineas =
      this.lineas();


    if (
      lineas.length === 0
    ) {

      this.errorMensaje.set(
        'Agregue al menos un producto a la compra.'
      );

      return;

    }


    const lineaInvalida =
      lineas.find(
        linea =>
          Boolean(
            this.errorLinea(
              linea
            )
          )
      );


    if (
      lineaInvalida
    ) {

      this.errorMensaje.set(
        this.errorLinea(
          lineaInvalida
        )
      );

      return;

    }


    const detalles =
      lineas.map(
        linea => ({

          id_producto_variante:
            linea.id_producto_variante,

          cantidad:
            this.numero(
              linea.cantidad
            ),

          costo_unitario:
            this.numero(
              linea.costo_unitario
            ),

          descuento:
            this.numero(
              linea.descuento
            ),

          observaciones:
            linea.observaciones
              .trim()
            || null

        })
      );


    let request$:
      Observable<
        Compra
      >;


    /*
    |--------------------------------------------------------------------------
    | Editar
    |--------------------------------------------------------------------------
    */

    if (
      this.modoEdicion()
    ) {

      const id =
        this.idCompra();


      if (
        id === null
      ) {

        this.errorMensaje.set(
          'No fue posible identificar la compra.'
        );

        return;

      }


      const data:
        CompraActualizarRequest = {

        id_sucursal:
          idSucursal,

        id_proveedor:
          idProveedor,

        numero_factura:
          this.numeroFactura
            .trim()
          || null,

        observaciones:
          this.observacionesCompra
            .trim()
          || null,

        usuario_modificacion:
          usuario.id_usuario,

        detalles

      };


      if (
        this.fechaCompra
      ) {

        data.fecha_compra =
          this.fechaCompra;

      }


      request$ =
        this.compraService
          .actualizar(
            id,
            data
          );

    }


    /*
    |--------------------------------------------------------------------------
    | Crear
    |--------------------------------------------------------------------------
    */

    else {

      const data:
        CompraCrearRequest = {

        id_sucursal:
          idSucursal,

        id_proveedor:
          idProveedor,

        id_usuario_comprador:
          usuario.id_usuario,

        numero_factura:
          this.numeroFactura
            .trim()
          || null,

        observaciones:
          this.observacionesCompra
            .trim()
          || null,

        usuario_creacion:
          usuario.id_usuario,

        detalles

      };


      if (
        this.fechaCompra
      ) {

        data.fecha_compra =
          this.fechaCompra;

      }


      request$ =
        this.compraService
          .crear(
            data
          );

    }


    this.guardando.set(
      true
    );


    request$
      .pipe(

        finalize(
          () => {

            this.guardando.set(
              false
            );

          }
        )

      )
      .subscribe({

        next: () => {

          this.router.navigate(
            [
              '/dashboard/purchases'
            ]
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
  | Helpers
  |--------------------------------------------------------------------------
  */

  moneda(
    valor:
      number | string | null | undefined
  ): string {

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
        this.numero(
          valor
        )
      );

  }


  private numero(
    valor:
      number | string | null | undefined
  ): number {

    const resultado =
      Number(
        valor
        ?? 0
      );


    return Number.isFinite(
      resultado
    )
      ? resultado
      : 0;

  }


  private redondear(
    valor:
      number
  ): number {

    return Math.round(
      (
        valor
        +
        Number.EPSILON
      )
      *
      100
    )
      /
      100;

  }


  private decimalesValidos(
    valor:
      number,

    maximo:
      number
  ): boolean {

    const texto =
      String(
        valor
      );


    if (
      !texto.includes(
        '.'
      )
    ) {

      return true;

    }


    return (
      texto.split(
        '.'
      )[1]
        ?.length
      ?? 0
    )
      <= maximo;

  }


  private idDesdeSelect(
    valor:
      string
  ): number | null {

    if (
      !valor
    ) {

      return null;

    }


    const id =
      Number(
        valor
      );


    return Number.isInteger(
      id
    )
      &&
      id > 0

      ? id

      : null;

  }


  private fechaLocalActual(): string {

    return this.fechaParaInput(
      new Date()
        .toISOString()
    );

  }


  private fechaParaInput(
    fecha:
      string | null
  ): string {

    if (
      !fecha
    ) {

      return '';

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

      return '';

    }


    const pad =
      (
        valor:
          number
      ) =>
        String(
          valor
        )
          .padStart(
            2,
            '0'
          );


    return (
      `${date.getFullYear()}-`
      +
      `${pad(date.getMonth() + 1)}-`
      +
      `${pad(date.getDate())}T`
      +
      `${pad(date.getHours())}:`
      +
      `${pad(date.getMinutes())}`
    );

  }


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
        'No tiene permiso para realizar esta operación.'
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
      'No fue posible guardar la compra.'
    );

  }

}