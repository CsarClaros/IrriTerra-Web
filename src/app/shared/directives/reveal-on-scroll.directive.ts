import {

    Directive,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    inject

} from '@angular/core';

import {

    isPlatformBrowser

} from '@angular/common';


@Directive({

    selector:
        '[appRevealOnScroll]',

    standalone:
        true

})
export class RevealOnScrollDirective
    implements OnInit, OnDestroy {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly element =
        inject(
            ElementRef<HTMLElement>
        );

    private readonly platformId =
        inject(
            PLATFORM_ID
        );


    /*
    |--------------------------------------------------------------------------
    | Configuración
    |--------------------------------------------------------------------------
    */

    @Input()
    revealDelay =
        0;

    @Input()
    revealOnce =
        false;

    /*
    |--------------------------------------------------------------------------
    | Observer
    |--------------------------------------------------------------------------
    */

    private observer:
        IntersectionObserver
        | null =
        null;


    /*
    |--------------------------------------------------------------------------
    | Inicio
    |--------------------------------------------------------------------------
    */

    ngOnInit(): void {

        const element =
            this.element.nativeElement;


        /*
         * SSR / prerender.
         */

        if (
            !isPlatformBrowser(
                this.platformId
            )
        ) {

            return;

        }


        /*
         * Accesibilidad:
         * respetar reducción de movimiento.
         */

        const reduceMotion =
            window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            )
                .matches;


        if (
            reduceMotion
        ) {

            element.style.opacity =
                '1';

            element.style.transform =
                'none';

            return;

        }


        /*
         * Estado inicial.
         */

        element.style.opacity =
            '0';

        element.style.transform =
            'translateY(24px)';

        element.style.transition =
            'opacity 600ms ease, transform 600ms ease';

        element.style.transitionDelay =
            `${this.revealDelay}ms`;


        /*
         * Aparición.
         */

        this.observer =
            new IntersectionObserver(
                entries => {

                    for (
                        const entry
                        of entries
                    ) {

                        /*
                         * Elemento entrando
                         * en pantalla.
                         */

                        if (
                            entry.isIntersecting
                        ) {

                            element.style.opacity =
                                '1';

                            element.style.transform =
                                'translateY(0)';


                            if (
                                this.revealOnce
                            ) {

                                this.observer
                                    ?.unobserve(
                                        element
                                    );

                            }

                            continue;

                        }


                        /*
                         * Elemento saliendo
                         * de pantalla.
                         *
                         * Se restablece para
                         * poder animarlo nuevamente.
                         */

                        if (
                            !this.revealOnce
                        ) {

                            element.style.opacity =
                                '0';

                            element.style.transform =
                                'translateY(24px)';

                        }
                    }

                },
                {
                    threshold:
                        0.12
                }
            );


        this.observer.observe(
            element
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Destruir
    |--------------------------------------------------------------------------
    */

    ngOnDestroy(): void {

        this.observer
            ?.disconnect();

    }

}