import {

    DOCUMENT

} from '@angular/common';

import {

    inject,
    Injectable

} from '@angular/core';

import {

    environment

} from '../../../environments/environment';


export type StructuredData =
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


    /*
    |--------------------------------------------------------------------------
    | Configuración
    |--------------------------------------------------------------------------
    */

    private readonly scriptId =
        'seo-structured-data';


    private readonly siteUrl =
        environment
            .siteUrl
            .replace(
                /\/+$/,
                ''
            );


    /*
    |--------------------------------------------------------------------------
    | Configurar JSON-LD
    |--------------------------------------------------------------------------
    */

    configurar(
        data:
            StructuredData
    ): void {

        this.limpiar();


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
            JSON.stringify(
                data
            )
                .replace(
                    /</g,
                    '\\u003c'
                );


        this.document
            .head
            .appendChild(
                script
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Limpiar
    |--------------------------------------------------------------------------
    */

    limpiar(): void {

        this.document
            .getElementById(
                this.scriptId
            )
            ?.remove();

    }


    /*
    |--------------------------------------------------------------------------
    | URL absoluta
    |--------------------------------------------------------------------------
    */

    url(
        path:
            string = '/'
    ): string {

        if (
            /^https?:\/\//i.test(
                path
            )
        ) {

            return path;

        }


        const normalizedPath =
            path.startsWith(
                '/'
            )
                ? path
                : `/${path}`;


        return (
            `${this.siteUrl}${normalizedPath}`
        );

    }

}