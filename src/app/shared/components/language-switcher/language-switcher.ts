import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css'
})
export class LanguageSwitcher {

  languageService = inject(LanguageService);

  language = this.languageService.language;

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}