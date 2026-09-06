import {

  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  isSignal,
  signal

} from '@angular/core';

import {

  CommonModule,
  isPlatformBrowser

} from '@angular/common';

import {

  RouterLink

} from '@angular/router';

import {

  ArrowRight,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Droplets,
  LucideAngularModule,
  MessageCircle,
  Search,
  Settings,
  Tractor,
  Wrench,
  Zap

} from 'lucide-angular';

import {

  LanguageService

} from '../../core/services/language.service';

import {

  SeoService

} from '../../core/services/seo.service';

import {

  ImageWithFallback

} from '../../shared/components/image-with-fallback/image-with-fallback';

import {

  RevealOnScrollDirective

} from '../../shared/directives/reveal-on-scroll.directive';

import {
  StructuredDataService
} from '../../core/services/structured-data.service';

import {
  environment
} from '../../../environments/environment';


@Component({

  selector:
    'app-home',

  standalone:
    true,

  imports: [

    CommonModule,
    RouterLink,
    LucideAngularModule,
    ImageWithFallback,
    RevealOnScrollDirective

  ],

  templateUrl:
    './home.html',

  styleUrl:
    './home.css'

})
export class Home
  implements OnInit, OnDestroy {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly languageService =
    inject(
      LanguageService
    );

  private readonly seoService =
    inject(
      SeoService
    );

  private readonly platformId =
    inject(
      PLATFORM_ID
    );

  private readonly structuredDataService =
    inject(
      StructuredDataService
    );

  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly ArrowRightIcon =
    ArrowRight;

  readonly AwardIcon =
    Award;

  readonly CheckCircleIcon =
    CheckCircle2;

  readonly ChevronLeftIcon =
    ChevronLeft;

  readonly ChevronRightIcon =
    ChevronRight;

  readonly DropletsIcon =
    Droplets;

  readonly MessageCircleIcon =
    MessageCircle;

  readonly SearchIcon =
    Search;

  readonly SettingsIcon =
    Settings;

  readonly TractorIcon =
    Tractor;

  readonly WrenchIcon =
    Wrench;

  readonly ZapIcon =
    Zap;

  /**
   * 
   * 
   * 
   */


  private readonly siteUrl =
    environment
      .siteUrl
      .replace(
        /\/+$/,
        ''
      );

  /*
  |--------------------------------------------------------------------------
  | Hero
  |--------------------------------------------------------------------------
  */

  readonly heroSlides = [

    {
      image:
        'https://images.unsplash.com/photo-1738598665698-7fd7af4b5e0c?w=1600',

      alt: {
        es:
          'Riego y agricultura',

        en:
          'Irrigation and agriculture'
      }
    },

    {
      image:
        'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600',

      alt: {
        es:
          'Maquinaria para trabajo agrícola',

        en:
          'Agricultural machinery'
      }
    },

    {
      image:
        'https://images.unsplash.com/photo-1771684512143-88bdb34782fa?w=1600',

      alt: {
        es:
          'Soluciones para el campo',

        en:
          'Solutions for the field'
      }
    }

  ];


  readonly heroIndex =
    signal(
      0
    );


  private heroInterval:
    ReturnType<
      typeof setInterval
    >
    | null =
    null;


  /*
  |--------------------------------------------------------------------------
  | Empresa
  |--------------------------------------------------------------------------
  */

  readonly companyImage =
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200';


  /*
  |--------------------------------------------------------------------------
  | Productos destacados
  |--------------------------------------------------------------------------
  */

  readonly featuredProducts = [

    {
      name: {
        es:
          'Motobombas',

        en:
          'Water Pumps'
      },

      description: {
        es:
          'Equipos para bombeo, transferencia de agua y aplicaciones de riego agrícola.',

        en:
          'Equipment for water pumping, transfer and agricultural irrigation applications.'
      },

      image:
        'https://images.unsplash.com/photo-1738598665698-7fd7af4b5e0c?w=600'
    },

    {
      name: {
        es:
          'Motocultivadores',

        en:
          'Cultivators'
      },

      description: {
        es:
          'Maquinaria compacta para facilitar la preparación y el trabajo del suelo.',

        en:
          'Compact machinery designed to simplify soil preparation and field work.'
      },

      image:
        'https://images.unsplash.com/photo-1771684512143-88bdb34782fa?w=600'
    },

    {
      name: {
        es:
          'Motores y generadores',

        en:
          'Engines and Generators'
      },

      description: {
        es:
          'Soluciones de potencia y energía para distintas necesidades de trabajo agrícola.',

        en:
          'Power and energy solutions for different agricultural work requirements.'
      },

      image:
        'https://images.unsplash.com/photo-1698848065415-ad8e2f269fa8?w=600'
    }

  ];


  /*
  |--------------------------------------------------------------------------
  | Aplicaciones
  |--------------------------------------------------------------------------
  */

  readonly applications = [

    {
      icon:
        Droplets,

      title: {
        es:
          'Bombeo de agua',

        en:
          'Water pumping'
      },

      description: {
        es:
          'Soluciones para transferencia de agua, reservorios, abastecimiento y otras aplicaciones de bombeo.',

        en:
          'Solutions for water transfer, reservoirs, supply and other pumping applications.'
      }
    },

    {
      icon:
        Wrench,

      title: {
        es:
          'Riego agrícola',

        en:
          'Agricultural irrigation'
      },

      description: {
        es:
          'Equipos orientados a apoyar sistemas de riego y el aprovechamiento eficiente del agua.',

        en:
          'Equipment designed to support irrigation systems and efficient water use.'
      }
    },

    {
      icon:
        Tractor,

      title: {
        es:
          'Trabajo del suelo',

        en:
          'Soil preparation'
      },

      description: {
        es:
          'Maquinaria para facilitar labores de preparación, cultivo y mantenimiento del terreno.',

        en:
          'Machinery for soil preparation, cultivation and field maintenance.'
      }
    },

    {
      icon:
        Zap,

      title: {
        es:
          'Energía y potencia',

        en:
          'Power and energy'
      },

      description: {
        es:
          'Motores y generadores para diferentes necesidades de operación y trabajo en campo.',

        en:
          'Engines and generators for different operational and field work requirements.'
      }
    }

  ];


  /*
  |--------------------------------------------------------------------------
  | Proceso
  |--------------------------------------------------------------------------
  */

  readonly assistanceSteps = [

    {
      number:
        '01',

      icon:
        MessageCircle,

      title: {
        es:
          'Cuéntanos qué necesitas',

        en:
          'Tell us what you need'
      },

      description: {
        es:
          'Explícanos el trabajo, proyecto o aplicación para la que buscas un equipo.',

        en:
          'Tell us about the work, project or application for which you need equipment.'
      }
    },

    {
      number:
        '02',

      icon:
        Search,

      title: {
        es:
          'Revisamos alternativas',

        en:
          'We review alternatives'
      },

      description: {
        es:
          'Identificamos las opciones disponibles que mejor se ajusten a tu necesidad.',

        en:
          'We identify the available options that best fit your needs.'
      }
    },

    {
      number:
        '03',

      icon:
        CheckCircle2,

      title: {
        es:
          'Elige una solución adecuada',

        en:
          'Choose the right solution'
      },

      description: {
        es:
          'Recibe información para comparar las alternativas y tomar una decisión.',

        en:
          'Get the information you need to compare alternatives and make a decision.'
      }
    }

  ];


  /*
  |--------------------------------------------------------------------------
  | Inicio
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    this.seoService
      .configurar({
        title:
          'Irriterra S.R.L. | Soluciones para riego y agricultura',

        description:
          'Soluciones en motobombas, motocultivadores, motores, generadores y equipos para riego y trabajo agrícola en Bolivia.',

        path:
          '/'
      });


    this.iniciarHero();

    this.configurarDatosEstructurados();

  }

  private configurarDatosEstructurados(): void {

    const homeUrl =
      `${this.siteUrl}/`;

    const logoUrl =
      `${this.siteUrl}/images/brand/irriterra-logo.webp`;


    this.structuredDataService
      .configurarGraph(
        [

          /*
          |--------------------------------------------------------------------------
          | Sitio web
          |--------------------------------------------------------------------------
          */

          {
            '@type':
              'WebSite',

            '@id':
              `${this.siteUrl}/#website`,

            url:
              homeUrl,

            name:
              'Irriterra',

            alternateName: [
              'Irriterra S.R.L.',
              'irriterrasrl.com'
            ],

            publisher: {
              '@id':
                `${this.siteUrl}/#organization`
            }
          },


          /*
          |--------------------------------------------------------------------------
          | Organización
          |--------------------------------------------------------------------------
          */

          {
            '@type':
              'Organization',

            '@id':
              `${this.siteUrl}/#organization`,

            name:
              'Irriterra S.R.L.',

            alternateName:
              'Irriterra',

            url:
              homeUrl,

            logo:
              logoUrl,

            email:
              'info@irriterrasrl.com',

            description:
              'Empresa boliviana dedicada a soluciones para riego, bombeo, maquinaria y trabajo agrícola.'
          }

        ]
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Hero automático
  |--------------------------------------------------------------------------
  */

  private iniciarHero(): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {

      return;

    }


    const reduceMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      )
        .matches;


    if (
      reduceMotion
    ) {

      return;

    }


    this.detenerHero();


    this.heroInterval =
      setInterval(
        () => {

          this.siguienteHero();

        },
        7000
      );

  }


  detenerHero(): void {

    if (
      this.heroInterval
      === null
    ) {

      return;

    }


    clearInterval(
      this.heroInterval
    );


    this.heroInterval =
      null;

  }


  reanudarHero(): void {

    this.iniciarHero();

  }


  siguienteHero(): void {

    this.heroIndex.update(
      current =>
        (
          current
          + 1
        )
        %
        this.heroSlides.length
    );

  }


  anteriorHero(): void {

    this.heroIndex.update(
      current =>
        (
          current
          - 1
          + this.heroSlides.length
        )
        %
        this.heroSlides.length
    );

  }


  seleccionarHero(
    index:
      number
  ): void {

    this.heroIndex.set(
      index
    );


    this.iniciarHero();

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
  | Destruir
  |--------------------------------------------------------------------------
  */

  ngOnDestroy(): void {

    this.detenerHero();

  }

}