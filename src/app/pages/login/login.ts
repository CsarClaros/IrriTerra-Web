import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Mail, Lock, User, LucideAngularModule } from 'lucide-angular';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(
    private router: Router,
    private languageService: LanguageService
  ){}


  t(es: string, en: string): string {
    return this.languageService.t(es, en);
  }

  formData = {
    correo: '',
    contrasena: ''
  }

  handleSubmit() {
    if(this.formData.correo && this.formData.contrasena) {
      this.router.navigate(['/dashboard']);
    }
  }

  // Iconos

  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly User = User;
}
