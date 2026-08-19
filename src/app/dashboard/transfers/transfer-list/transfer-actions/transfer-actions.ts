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
  CheckCircle2,
  Edit3,
  Send,
  Trash2,
  X,
  XCircle,
  LucideAngularModule
} from 'lucide-angular';

import {
  SessionService
} from '../../../../core/services/session.service';

import {
  TransferenciaInventarioService
} from '../../../../core/services/transferencias/transferencia-inventario.service';

import {
  TransferenciaInventario
} from '../../../../shared/models/transferencia-inventario.model';


type AccionConfirmacion =
  'ENVIAR'
  |
  'COMPLETAR'
  |
  'ELIMINAR'
  |
  null;


@Component({
  selector:
    'app-transfer-actions',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule
  ],

  templateUrl:
    './transfer-actions.html',

  styleUrl:
    './transfer-actions.css'
})
export class TransferActions {

  /*
  |--------------------------------------------------------------------------
  | Entradas / salidas
  |--------------------------------------------------------------------------
  */

  @Input({
    required:
      true
  })
  transferencia!:
    TransferenciaInventario;


  @Output()
  actualizada =
    new EventEmitter<
      TransferenciaInventario
    >();


  @Output()
  eliminada =
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


  private readonly transferenciaService =
    inject(
      TransferenciaInventarioService
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
      AccionConfirmacion
    >(null);


  readonly modalRechazo =
    signal(false);


  motivoRechazo =
    '';


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly CheckCircle2 =
    CheckCircle2;


  readonly Edit3 =
    Edit3;


  readonly Send =
    Send;


  readonly Trash2 =
    Trash2;


  readonly X =
    X;


  readonly XCircle =
    XCircle;


  /*
  |--------------------------------------------------------------------------
  | Permisos + estados
  |--------------------------------------------------------------------------
  */

  puedeEditar(): boolean {

    return (
      this.transferencia
        .estado_transferencia
      === 'PENDIENTE'
      &&
      this.sessionService
        .tienePermiso(
          'transferencia.editar'
        )
    );

  }


  puedeEnviar(): boolean {

    return (
      this.transferencia
        .estado_transferencia
      === 'PENDIENTE'
      &&
      this.sessionService
        .tienePermiso(
          'transferencia.enviar'
        )
    );

  }


  puedeCompletar(): boolean {

    return (
      this.transferencia
        .estado_transferencia
      === 'EN_TRANSITO'
      &&
      this.sessionService
        .tienePermiso(
          'transferencia.completar'
        )
    );

  }


  puedeRechazar(): boolean {

    const estado =
      this.transferencia
        .estado_transferencia;


    return (
      (
        estado
        === 'PENDIENTE'
        ||
        estado
        === 'EN_TRANSITO'
      )
      &&
      this.sessionService
        .tienePermiso(
          'transferencia.rechazar'
        )
    );

  }


  puedeEliminar(): boolean {

    const estado =
      this.transferencia
        .estado_transferencia;


    return (
      (
        estado
        === 'PENDIENTE'
        ||
        estado
        === 'RECHAZADA'
      )
      &&
      this.sessionService
        .tienePermiso(
          'transferencia.eliminar'
        )
    );

  }


  tieneAcciones(): boolean {

    return (
      this.puedeEditar()
      ||
      this.puedeEnviar()
      ||
      this.puedeCompletar()
      ||
      this.puedeRechazar()
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
        '/dashboard/transfers',
        this.transferencia
          .id_transferencia_inventario,
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
      Exclude<
        AccionConfirmacion,
        null
      >
  ): void {

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


  confirmarAccion(): void {

    const accion =
      this.accionConfirmacion();


    switch (
    accion
    ) {

      case 'ENVIAR':

        this.enviar();

        break;


      case 'COMPLETAR':

        this.completar();

        break;


      case 'ELIMINAR':

        this.eliminar();

        break;

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Enviar
  |--------------------------------------------------------------------------
  */

  private enviar(): void {

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


    this.transferenciaService
      .enviar(
        this.transferencia
          .id_transferencia_inventario,
        {
          id_usuario_envio:
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

        next: response => {

          this.accionConfirmacion.set(
            null
          );


          this.actualizada.emit(
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
  | Completar
  |--------------------------------------------------------------------------
  */

  private completar(): void {

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


    this.transferenciaService
      .completar(
        this.transferencia
          .id_transferencia_inventario,
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

        next: response => {

          this.accionConfirmacion.set(
            null
          );


          this.actualizada.emit(
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
  | Rechazar
  |--------------------------------------------------------------------------
  */

  abrirRechazo(): void {

    this.errorMensaje.set(
      ''
    );


    this.motivoRechazo =
      '';


    this.modalRechazo.set(
      true
    );

  }


  cerrarRechazo(): void {

    if (
      this.procesando()
    ) {

      return;

    }


    this.modalRechazo.set(
      false
    );


    this.motivoRechazo =
      '';

  }


  confirmarRechazo(): void {

    const motivo =
      this.motivoRechazo
        .trim();


    if (
      !motivo
    ) {

      this.errorMensaje.set(
        'Ingrese el motivo del rechazo.'
      );

      return;

    }


    if (
      motivo.length
      > 255
    ) {

      this.errorMensaje.set(
        'El motivo del rechazo no puede superar los 255 caracteres.'
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


    this.transferenciaService
      .rechazar(
        this.transferencia
          .id_transferencia_inventario,
        {
          id_usuario_rechazo:
            usuario.id_usuario,

          motivo_rechazo:
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

        next: response => {

          this.modalRechazo.set(
            false
          );


          this.motivoRechazo =
            '';


          this.actualizada.emit(
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


    const id =
      this.transferencia
        .id_transferencia_inventario;


    this.transferenciaService
      .eliminar(
        id
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
  | Textos confirmación
  |--------------------------------------------------------------------------
  */

  tituloConfirmacion(): string {

    switch (
    this.accionConfirmacion()
    ) {

      case 'ENVIAR':

        return (
          'Enviar transferencia'
        );


      case 'COMPLETAR':

        return (
          'Completar transferencia'
        );


      case 'ELIMINAR':

        return (
          'Eliminar transferencia'
        );


      default:

        return '';

    }

  }


  mensajeConfirmacion(): string {

    switch (
    this.accionConfirmacion()
    ) {

      case 'ENVIAR':

        return (
          'Al enviar la transferencia se descontará el inventario de la sucursal de origen.'
        );


      case 'COMPLETAR':

        return (
          'Al completar la transferencia se registrará la recepción del inventario en la sucursal destino.'
        );


      case 'ELIMINAR':

        return (
          'La transferencia será desactivada y dejará de aparecer en el listado.'
        );


      default:

        return '';

    }

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
      'No fue posible realizar la operación.'
    );

  }

}