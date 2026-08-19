import {
    Component,
    computed,
    inject,
    input,
    output,
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
    RouterLink
} from '@angular/router';

import {
    finalize
} from 'rxjs';

import {
    Ban,
    CheckCircle2,
    CreditCard,
    Pencil,
    X,
    LucideAngularModule
} from 'lucide-angular';

import {
    VentaService
} from '../../../../core/services/ventas/venta.service';

import {
    SessionService
} from '../../../../core/services/session.service';

import {
    AnularVentaRequest,
    CompletarVentaRequest,
    MetodoPagoVenta,
    Venta
} from '../../../../shared/models/venta.model';


@Component({
    selector:
        'app-sale-actions',

    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        LucideAngularModule
    ],

    templateUrl:
        './sale-actions.html',

    styleUrl:
        './sale-actions.css'
})
export class SaleActions {

    /*
    |--------------------------------------------------------------------------
    | Entrada / salida
    |--------------------------------------------------------------------------
    */

    readonly venta =
        input.required<
            Venta
        >();


    readonly actualizada =
        output<
            Venta
        >();


    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly ventaService =
        inject(
            VentaService
        );


    private readonly sessionService =
        inject(
            SessionService
        );


    /*
    |--------------------------------------------------------------------------
    | Estado
    |--------------------------------------------------------------------------
    */

    readonly mostrarCompletar =
        signal(false);


    readonly mostrarAnular =
        signal(false);


    readonly procesando =
        signal(false);


    readonly errorMensaje =
        signal('');


    /*
    |--------------------------------------------------------------------------
    | Formularios
    |--------------------------------------------------------------------------
    */

    metodoPago:
        MetodoPagoVenta =
        'EFECTIVO';


    motivoAnulacion =
        '';


    /*
    |--------------------------------------------------------------------------
    | Permisos
    |--------------------------------------------------------------------------
    |
    | No existe un permiso confirmado venta.completar.
    |
    | Completar forma parte del flujo de creación/gestión de la venta,
    | por lo que utilizamos venta.crear.
    |
    */

    readonly puedeGestionarBorrador =
        computed(
            () =>
                this.venta()
                    .estado_venta
                === 'BORRADOR'
                &&
                this.sessionService
                    .tienePermiso(
                        'venta.crear'
                    )
        );


    readonly puedeAnular =
        computed(
            () =>
                this.venta()
                    .estado_venta
                === 'COMPLETADA'
                &&
                this.sessionService
                    .tienePermiso(
                        'venta.anular'
                    )
        );


    /*
    |--------------------------------------------------------------------------
    | Iconos
    |--------------------------------------------------------------------------
    */

    readonly Ban =
        Ban;

    readonly CheckCircle2 =
        CheckCircle2;

    readonly CreditCard =
        CreditCard;

    readonly Pencil =
        Pencil;

    readonly X =
        X;


    /*
    |--------------------------------------------------------------------------
    | Abrir completar
    |--------------------------------------------------------------------------
    */

    abrirCompletar(): void {

        this.errorMensaje.set(
            ''
        );


        this.metodoPago =
            'EFECTIVO';


        this.mostrarCompletar.set(
            true
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Cerrar completar
    |--------------------------------------------------------------------------
    */

    cerrarCompletar(): void {

        if (
            this.procesando()
        ) {

            return;

        }


        this.mostrarCompletar.set(
            false
        );


        this.errorMensaje.set(
            ''
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Completar
    |--------------------------------------------------------------------------
    */

    completar(): void {

        if (
            this.procesando()
        ) {

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


        const venta =
            this.venta();


        const total =
            this.numero(
                venta.total
            );


        if (
            total <= 0
        ) {

            this.errorMensaje.set(
                'El total de la venta debe ser mayor que cero.'
            );

            return;

        }


        const data:
            CompletarVentaRequest = {

            monto_pagado:
                total,

            metodo_pago:
                this.metodoPago,

            usuario_modificacion:
                usuario.id_usuario

        };


        this.errorMensaje.set(
            ''
        );


        this.procesando.set(
            true
        );


        this.ventaService
            .completar(
                venta.id_venta,
                data
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

                    this.mostrarCompletar.set(
                        false
                    );


                    this.actualizada.emit(
                        response.data
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
    | Abrir anular
    |--------------------------------------------------------------------------
    */

    abrirAnular(): void {

        this.motivoAnulacion =
            '';


        this.errorMensaje.set(
            ''
        );


        this.mostrarAnular.set(
            true
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Cerrar anular
    |--------------------------------------------------------------------------
    */

    cerrarAnular(): void {

        if (
            this.procesando()
        ) {

            return;

        }


        this.mostrarAnular.set(
            false
        );


        this.errorMensaje.set(
            ''
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Anular
    |--------------------------------------------------------------------------
    */

    anular(): void {

        if (
            this.procesando()
        ) {

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
                'El motivo no puede superar los 255 caracteres.'
            );

            return;

        }


        const data:
            AnularVentaRequest = {

            id_usuario_anulacion:
                usuario.id_usuario,

            motivo_anulacion:
                motivo

        };


        this.errorMensaje.set(
            ''
        );


        this.procesando.set(
            true
        );


        this.ventaService
            .anular(
                this.venta()
                    .id_venta,

                data
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

                    this.mostrarAnular.set(
                        false
                    );


                    this.actualizada.emit(
                        response.data
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


        return (
            'No fue posible procesar la venta.'
        );

    }

}