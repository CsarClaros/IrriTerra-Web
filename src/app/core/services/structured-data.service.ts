import {
    DOCUMENT
} from '@angular/common';

import {
    Injectable,
    inject
} from '@angular/core';

import {
    NavigationStart,
    Router
} from '@angular/router';

import {
    filter
} from 'rxjs';


export type JsonLdNode =
    Record<
        string,
        unknown
    >;


@Injectable({
    providedIn:
        'root'
})
export class StructuredDataService {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly document =
        inject(
            DOCUMENT
        );

    private readonly router =
        inject(
            Router
        );


    /*
    |--------------------------------------------------------------------------
    | Configuración
    |--------------------------------------------------------------------------
    */

    private readonly scriptId =
        'irriterra-structured-data';


    /*
    |--------------------------------------------------------------------------
    | Constructor
    |--------------------------------------------------------------------------
    */

    constructor() {

        /*
         * Muy importante para SPA:
         *
         * al cambiar de ruta eliminamos
         * los datos estructurados de la
         * página anterior.
         */

        this.router
            .events
            .pipe(
                filter(
                    event =>
                        event
                        instanceof
                        NavigationStart
                )
            )
            .subscribe(
                () => {

                    this.eliminar();

                }
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Configurar
    |--------------------------------------------------------------------------
    */

    configurar(
        data:
            JsonLdNode
            |
            JsonLdNode[]
    ): void {

        this.eliminar();


        const script =
            this.document
                .createElement(
                    'script'
                );


        script.id =
            this.scriptId;

        script.type =
            'application/ld+json';

        script.textContent =
            this.serializar(
                data
            );


        this.document
            .head
            .appendChild(
                script
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Graph
    |--------------------------------------------------------------------------
    */

    configurarGraph(
        nodes:
            JsonLdNode[]
    ): void {

        this.configurar({
            '@context':
                'https://schema.org',

            '@graph':
                nodes
        });

    }


    /*
    |--------------------------------------------------------------------------
    | Eliminar
    |--------------------------------------------------------------------------
    */

    eliminar(): void {

        this.document
            .getElementById(
                this.scriptId
            )
            ?.remove();

    }


    /*
    |--------------------------------------------------------------------------
    | Serializar seguro
    |--------------------------------------------------------------------------
    */

    private serializar(
        data:
            unknown
    ): string {

        return JSON
            .stringify(
                data
            )
            .replace(
                /</g,
                '\\u003c'
            )
            .replace(
                /\u2028/g,
                '\\u2028'
            )
            .replace(
                /\u2029/g,
                '\\u2029'
            );

    }

}