import { Injectable, signal } from '@angular/core';

export type Language = 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  language = signal<Language>('es');

  toggleLanguage(): void {
    this.language.update(lang => lang === 'es' ? 'en' : 'es');
  }

  t(es: string, en: string): string {
    return this.language() === 'es' ? es : en;
  }
}