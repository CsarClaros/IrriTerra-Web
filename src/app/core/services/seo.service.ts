import {
    DOCUMENT
} from '@angular/common';

import {
    inject,
    Injectable
} from '@angular/core';

import {
    Meta,
    Title
} from '@angular/platform-browser';

import {
    environment
} from '../../../environments/environment';

import {

    StructuredDataService

} from './structured-data.service';


export interface SeoConfig {

    title: string;

    description: string;

    path?: string;

    image?: string;

    type?: string;

    robots?: string;

}


@Injectable({
    providedIn: 'root'
})
export class SeoService {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly titleService =
        inject(
            Title
        );

    private readonly metaService =
        inject(
            Meta
        );

    private readonly document =
        inject(
            DOCUMENT
        );


    private readonly structuredDataService =
        inject(
            StructuredDataService
        );


    /*
    |--------------------------------------------------------------------------
    | Configuración
    |--------------------------------------------------------------------------
    */

    private readonly siteName =
        'Irriterra S.R.L.';

    private readonly siteUrl =
        environment.siteUrl
            .replace(
                /\/+$/,
                ''
            );

    private readonly defaultImage =
        '/images/brand/irriterra-logo.png';


    /*
    |--------------------------------------------------------------------------
    | Configurar SEO de página
    |--------------------------------------------------------------------------
    */

    configurar(
        config: SeoConfig
    ): void {

        /*
    |--------------------------------------------------------------------------
    | Limpiar datos estructurados de la página anterior
    |--------------------------------------------------------------------------
    */

        this.structuredDataService.eliminar();


        const url =
            this.construirUrl(
                config.path
                ?? '/'
            );


        const imagen =
            this.construirUrl(
                config.image
                ?? this.defaultImage
            );


        /*
        |--------------------------------------------------------------------------
        | Title
        |--------------------------------------------------------------------------
        */

        this.titleService
            .setTitle(
                config.title
            );


        /*
        |--------------------------------------------------------------------------
        | SEO básico
        |--------------------------------------------------------------------------
        */

        this.metaService.updateTag(
            {
                name:
                    'description',

                content:
                    config.description
            }
        );


        this.metaService.updateTag(
            {
                name:
                    'robots',

                content:
                    config.robots
                    ?? 'index, follow'
            }
        );


        /*
        |--------------------------------------------------------------------------
        | Open Graph
        |--------------------------------------------------------------------------
        */

        this.actualizarMetaProperty(
            'og:type',
            config.type
            ?? 'website'
        );


        this.actualizarMetaProperty(
            'og:site_name',
            this.siteName
        );


        this.actualizarMetaProperty(
            'og:title',
            config.title
        );


        this.actualizarMetaProperty(
            'og:description',
            config.description
        );


        this.actualizarMetaProperty(
            'og:url',
            url
        );


        this.actualizarMetaProperty(
            'og:image',
            imagen
        );


        /*
        |--------------------------------------------------------------------------
        | X / Twitter
        |--------------------------------------------------------------------------
        */

        this.actualizarMetaName(
            'twitter:card',
            'summary_large_image'
        );


        this.actualizarMetaName(
            'twitter:title',
            config.title
        );


        this.actualizarMetaName(
            'twitter:description',
            config.description
        );


        this.actualizarMetaName(
            'twitter:image',
            imagen
        );


        /*
        |--------------------------------------------------------------------------
        | Canonical
        |--------------------------------------------------------------------------
        */

        this.actualizarCanonical(
            url
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Página no indexable
    |--------------------------------------------------------------------------
    */

    // noIndex(
    //     title:
    //         string = 'Irriterra S.R.L.'
    // ): void {

    //     this.titleService
    //         .setTitle(
    //             title
    //         );


    //     this.metaService.updateTag(
    //         {
    //             name:
    //                 'robots',

    //             content:
    //                 'noindex, nofollow'
    //         }
    //     );

    // }


    /*
    |--------------------------------------------------------------------------
    | Meta property
    |--------------------------------------------------------------------------
    */

    private actualizarMetaProperty(
        property: string,
        content: string
    ): void {

        this.metaService.updateTag(

            {
                property,
                content
            },

            `property='${property}'`

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Meta name
    |--------------------------------------------------------------------------
    */

    private actualizarMetaName(
        name: string,
        content: string
    ): void {

        this.metaService.updateTag(

            {
                name,
                content
            },

            `name='${name}'`

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Canonical
    |--------------------------------------------------------------------------
    */

    private actualizarCanonical(
        url: string
    ): void {

        let canonical =
            this.document
                .head
                .querySelector(
                    'link[rel="canonical"]'
                );


        if (
            !canonical
        ) {

            canonical =
                this.document
                    .createElement(
                        'link'
                    );


            canonical.setAttribute(
                'rel',
                'canonical'
            );


            this.document
                .head
                .appendChild(
                    canonical
                );

        }


        canonical.setAttribute(
            'href',
            url
        );

    }


    /*
    |--------------------------------------------------------------------------
    | URL absoluta
    |--------------------------------------------------------------------------
    */

    private construirUrl(
        ruta: string
    ): string {

        if (
            /^https?:\/\//i.test(
                ruta
            )
        ) {

            return ruta;

        }


        const rutaNormalizada =
            ruta.startsWith(
                '/'
            )
                ? ruta
                : `/${ruta}`;


        return (
            `${this.siteUrl}${rutaNormalizada}`
        );

    }

}