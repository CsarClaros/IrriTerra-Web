import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Send, Phone, Mail, MapPin, LucideAngularModule } from 'lucide-angular';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  constructor(private lang: LanguageService) { }

  t(es: string, en: string): string {
    return this.lang.t(es, en);
  }

  formData = {
    nombre: '',
    correo: '',
    telefono: '',
    mensaje: '',
  };

  handleChange(field: string, value: string) {
    this.formData = {
      ...this.formData,
      [field]: value,
    };
  }

  handleSubmit() {
    alert(this.t('Mensaje enviado exitosamente', 'Message sent successfully'));
  }

  // si estás usando tu sistema con readonly icons:
  readonly Send = Send;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly MapPin = MapPin;
}
