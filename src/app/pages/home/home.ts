import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  LucideAngularModule,
  ArrowRight,
  Droplets,
  Settings,
  Award
} from 'lucide-angular';

import { LanguageService } from '../../core/services/language.service';
import { ImageWithFallback } from '../../shared/components/image-with-fallback/image-with-fallback';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    ImageWithFallback
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  readonly ArrowRightIcon = ArrowRight;
  readonly DropletsIcon = Droplets;
  readonly SettingsIcon = Settings;
  readonly AwardIcon = Award;

  languageService = inject(LanguageService);

  t(es: string, en: string): string {
    return this.languageService.t(es, en);
  }

  products = [
    {
      name: { es: 'Riego por goteo', en: 'Drip Irrigation' },
      description: {
        es: 'Sistemas eficientes para optimizar el uso del agua',
        en: 'Efficient systems to optimize water usage'
      },
      image: 'https://images.unsplash.com/photo-1738598665698-7fd7af4b5e0c?w=600'
    },
    {
      name: { es: 'Aspersores', en: 'Sprinklers' },
      description: {
        es: 'Cobertura uniforme para todo tipo de cultivos',
        en: 'Uniform coverage for all types of crops'
      },
      image: 'https://images.unsplash.com/photo-1771684512143-88bdb34782fa?w=600'
    },
    {
      name: { es: 'Controladores', en: 'Controllers' },
      description: {
        es: 'Automatización inteligente de sistemas de riego',
        en: 'Smart automation for irrigation systems'
      },
      image: 'https://images.unsplash.com/photo-1698848065415-ad8e2f269fa8?w=600'
    }
  ];

  events = [
    {
      title: { es: 'Expo AgroTech 2026', en: 'AgroTech Expo 2026' },
      date: '15-17 Abril, 2026',
      location: 'Santa Cruz, Bolivia',
      image: 'https://images.unsplash.com/photo-1585539055852-7acf76950530?w=600'
    },
    {
      title: {
        es: 'Capacitación en Riego Tecnificado',
        en: 'Technical Irrigation Training'
      },
      date: '25 Abril, 2026',
      location: 'La Paz, Bolivia',
      image: 'https://images.unsplash.com/photo-1708794666324-85ad91989d20?w=600'
    }
  ];

  partnerBrands = [
    'Lorem1',
    'Lorem2',
    'Lorem3',
    'Lorem4',
    'Lorem5',
    'Lorem6'
  ];

  monthlyNews = [
    {
      title: {
        es: 'Instalación Sistema de Riego',
        en: 'Irrigation System Installation'
      },
      description: {
        es: 'Proyecto completado en Cochabamba',
        en: 'Project completed in Cochabamba'
      },
      image: 'https://images.unsplash.com/photo-1738598665698-7fd7af4b5e0c?w=600'
    },
    {
      title: {
        es: 'Entrega de Maquinaria',
        en: 'Machinery Delivery'
      },
      description: {
        es: 'Nuevos moto cultivadores en Santa Cruz',
        en: 'New motor cultivators in Santa Cruz'
      },
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600'
    },
    {
      title: {
        es: 'Capacitación Técnica',
        en: 'Technical Training'
      },
      description: {
        es: 'Taller de mantenimiento para clientes',
        en: 'Maintenance workshop for clients'
      },
      image: 'https://images.unsplash.com/photo-1708794666324-85ad91989d20?w=600'
    }
  ];
}