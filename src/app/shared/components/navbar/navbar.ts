import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import {
  LucideAngularModule,
  Menu,
  X,
  ChevronDown
} from 'lucide-angular';

import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  readonly MenuIcon = Menu;
  readonly XIcon = X;
  readonly ChevronDownIcon = ChevronDown;

  private router = inject(Router);

  languageService = inject(LanguageService);

  isMenuOpen = false;
  isProductsOpen = false;

  products = [
    { es: 'Riego por goteo', en: 'Drip Irrigation' },
    { es: 'Aspersores', en: 'Sprinklers' },
    { es: 'Filtros', en: 'Filters' },
    { es: 'Controladores', en: 'Controllers' },
    { es: 'Válvulas', en: 'Valves' },
    { es: 'Sensores', en: 'Sensors' },
    { es: 'Accesorios', en: 'Accessories' }
  ];

  get language() {
    return this.languageService.language();
  }

  t(es: string, en: string): string {
    return this.languageService.t(es, en);
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  closeMobileMenu(): void {
    this.isMenuOpen = false;
  }
}