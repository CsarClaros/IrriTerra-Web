import {
  Component,
  EventEmitter,
  Input,
  Output,
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
  Router
} from '@angular/router';

import {
  finalize
} from 'rxjs';

import {
  Ban,
  CheckCircle2,
  Edit3,
  PackageCheck,
  Trash2,
  X,
  LucideAngularModule
} from 'lucide-angular';

import {
  SessionService
} from '../../../../core/services/session.service';

import {
  CompraService
} from '../../../../core/services/compras/compra.service';

import {
  Compra
} from '../../../../shared/models/compra.model';


type AccionConfirmacionCompra =
  | 'CONFIRMAR'
  | 'RECIBIR'
  | 'ELIMINAR';


@Component({
  selector:
    'app-purchase-actions',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule
  ],

  templateUrl:
    './purchase-actions.html',

  styleUrl:
    './purchase-actions.css'
})
export class PurchaseActions {

  /*
  |--------------------------------------------------------------------------
  | Entrada
  |--------------------------------------------------------------------------
  */

  @Input({
    required:
      true
  })
  compra!:
    Compra;


  /*
  |--------------------------------------------------------------------------
  | Salidas
  |--------------------------------------------------------------------------
  */

  @Output()
  readonly actualizada =
    new EventEmitter<
      Compra
    >();


  @Output()
  readonly eliminada =
    new EventEmitter<
      number
    >();


  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly sessionService =
    inject(
      SessionService
    );


  private readonly compraService =
    inject(
      CompraService
    );


  private readonly router =
    inject(
      Router
    );


  /*
  |--------------------------------------------------------------------------
  | Estado
  |--------------------------------------------------------------------------
  */

  readonly procesando =
    signal(false);


  readonly errorMensaje =
    signal('');


  readonly accionConfirmacion =
    signal<
      AccionConfirmacionCompra | null
    >(null);


  readonly modalAnulacion =
    signal(false);


  motivoAnulacion =
    '';


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly Ban =
    Ban;


  readonly CheckCircle2 =
    CheckCircle2;


  readonly Edit3 =
    Edit3;


  readonly PackageCheck =
    PackageCheck;


  readonly Trash2 =
    Trash2;


  readonly X =
    X;


  /*
  |--------------------------------------------------------------------------
  | Permisos
  |--------------------------------------------------------------------------
  */

  puedeEditar(): boolean {

    return (
      this.compra.estado_compra
      === 'BORRADOR'
      &&
      this.sessionService
        .tienePermiso(
          'compra.editar'
        )
    );

  }


  puedeConfirmar(): boolean {

    return (
      this.compra.estado_compra
      === 'BORRADOR'
      &&
      this.sessionService
        .tienePermiso(
          'compra.confirmar'
        )
    );

  }


  puedeRecibir(): boolean {

    return (
      this.compra.estado_compra
      === 'CONFIRMADA'
      &&
      this.sessionService
        .tienePermiso(
          'compra.recibir'
        )
    );

  }


  puedeAnular(): boolean {

    return (
      (
        this.compra.estado_compra
        === 'BORRADOR'
        ||
        this.compra.estado_compra
        === 'CONFIRMADA'
      )
      &&
      this.sessionService
        .tienePermiso(
          'compra.anular'
        )
    );

  }


  puedeEliminar(): boolean {

    return (
      this.compra.estado_compra
      === 'BORRADOR'
      &&
      this.sessionService
        .tienePermiso(
          'compra.eliminar'
        )
    );

  }


  tieneAcciones(): boolean {

    return (
      this.puedeEditar()
      ||
      this.puedeConfirmar()
      ||
      this.puedeRecibir()
      ||
      this.puedeAnular()
      ||
      this.puedeEliminar()
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Editar
  |--------------------------------------------------------------------------
  */

  editar(): void {

    this.router.navigate(
      [
        '/dashboard/purchases',
        this.compra.id_compra,
        'edit'
      ]
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Confirmaciones
  |--------------------------------------------------------------------------
  */

  abrirConfirmacion(
    accion:
      AccionConfirmacionCompra
  ): void {

    if (
      this.procesando()
    ) {

      return;

    }


    this.errorMensaje.set(
      ''
    );


    this.accionConfirmacion.set(
      accion
    );

  }


  cerrarConfirmacion(): void {

    if (
      this.procesando()
    ) {

      return;

    }


    this.accionConfirmacion.set(
      null
    );

  }


  ejecutarConfirmacion(): void {

    const accion =
      this.accionConfirmacion();


    if (
      !accion
    ) {

      return;

    }


    switch (
    accion
    ) {

      case 'CONFIRMAR':

        this.confirmar();

        break;


      case 'RECIBIR':

        this.recibir();

        break;


      case 'ELIMINAR':

        this.eliminar();

        break;

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Confirmar compra
  |--------------------------------------------------------------------------
  */

  private confirmar(): void {

    const usuario =
      this.sessionService
        .usuario();


    if (
      !usuario
    ) {

      this.errorMensaje.set(
        'No fue posible identificar al usuario autenticado.'
      );

      return;

    }


    this.procesando.set(
      true
    );


    this.errorMensaje.set(
      ''
    );


    this.compraService
      .confirmar(
        this.compra.id_compra,
        {
          id_usuario_confirmacion:
            usuario.id_usuario
        }
      )
      .pipe(

        finalize(
          () => {

            this.procesando.set(
              false
            );

          }
        )

      )
      .subscribe({

        next: compra => {

          this.accionConfirmacion.set(
            null
          );


          this.actualizada.emit(
            compra
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
  | Recibir compra
  |--------------------------------------------------------------------------
  */

  private recibir(): void {

    const usuario =
      this.sessionService
        .usuario();


    if (
      !usuario
    ) {

      this.errorMensaje.set(
        'No fue posible identificar al usuario autenticado.'
      );

      return;

    }


    this.procesando.set(
      true
    );


    this.errorMensaje.set(
      ''
    );


    this.compraService
      .recibir(
        this.compra.id_compra,
        {
          id_usuario_recepcion:
            usuario.id_usuario
        }
      )
      .pipe(

        finalize(
          () => {

            this.procesando.set(
              false
            );

          }
        )

      )
      .subscribe({

        next: compra => {

          this.accionConfirmacion.set(
            null
          );


          this.actualizada.emit(
            compra
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
  | Anular
  |--------------------------------------------------------------------------
  */

  abrirAnulacion(): void {

    if (
      this.procesando()
    ) {

      return;

    }


    this.errorMensaje.set(
      ''
    );


    this.motivoAnulacion =
      '';


    this.modalAnulacion.set(
      true
    );

  }


  cerrarAnulacion(): void {

    if (
      this.procesando()
    ) {

      return;

    }


    this.modalAnulacion.set(
      false
    );


    this.motivoAnulacion =
      '';

  }


  confirmarAnulacion(): void {

    const motivo =
      this.motivoAnulacion
        .trim();


    if (
      !motivo
    ) {

      this.errorMensaje.set(
        'Ingrese el motivo de anulación.'
      );

      return;

    }


    if (
      motivo.length > 255
    ) {

      this.errorMensaje.set(
        'El motivo de anulación no puede superar 255 caracteres.'
      );

      return;

    }


    const usuario =
      this.sessionService
        .usuario();


    if (
      !usuario
    ) {

      this.errorMensaje.set(
        'No fue posible identificar al usuario autenticado.'
      );

      return;

    }


    this.procesando.set(
      true
    );


    this.errorMensaje.set(
      ''
    );


    this.compraService
      .anular(
        this.compra.id_compra,
        {
          id_usuario_anulacion:
            usuario.id_usuario,

          motivo_anulacion:
            motivo
        }
      )
      .pipe(

        finalize(
          () => {

            this.procesando.set(
              false
            );

          }
        )

      )
      .subscribe({

        next: compra => {

          this.modalAnulacion.set(
            false
          );


          this.motivoAnulacion =
            '';


          this.actualizada.emit(
            compra
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
  | Eliminar
  |--------------------------------------------------------------------------
  */

  private eliminar(): void {

    this.procesando.set(
      true
    );


    this.errorMensaje.set(
      ''
    );


    this.compraService
      .eliminar(
        this.compra.id_compra
      )
      .pipe(

        finalize(
          () => {

            this.procesando.set(
              false
            );

          }
        )

      )
      .subscribe({

        next: () => {

          const id =
            this.compra.id_compra;


          this.accionConfirmacion.set(
            null
          );


          this.eliminada.emit(
            id
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
  | Textos modal
  |--------------------------------------------------------------------------
  */

  tituloConfirmacion(): string {

    switch (
    this.accionConfirmacion()
    ) {

      case 'CONFIRMAR':

        return (
          'Confirmar compra'
        );


      case 'RECIBIR':

        return (
          'Recibir compra'
        );


      case 'ELIMINAR':

        return (
          'Eliminar compra'
        );


      default:

        return (
          'Confirmar operación'
        );

    }

  }


  mensajeConfirmacion(): string {

    switch (
    this.accionConfirmacion()
    ) {

      case 'CONFIRMAR':

        return (
          'La compra dejará de ser editable y quedará pendiente de recepción.'
        );


      case 'RECIBIR':

        return (
          'Se registrará la recepción, aumentará el inventario y se actualizarán los costos de compra.'
        );


      case 'ELIMINAR':

        return (
          'La compra será eliminada lógicamente. Esta acción solo está disponible mientras permanezca en borrador.'
        );


      default:

        return '';

    }

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
        const valor
        of valores
      ) {

        if (
          Array.isArray(
            valor
          )
          &&
          valor.length > 0
        ) {

          return String(
            valor[0]
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
      'No fue posible completar la operación.'
    );

  }

}