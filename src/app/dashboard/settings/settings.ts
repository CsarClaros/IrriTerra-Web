import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Save, Upload } from 'lucide-angular';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule
  ],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings {

  constructor(private lang: LanguageService) {}

  Save = Save;
  Upload = Upload;

  config = {
    nombreEmpresa: 'Irriterra',
    direccion: 'Av. Principal 123, La Paz, Bolivia',
    correo: 'info@irriterra.com',
    telefono: '+591 2 234 5678',
    idioma: 'es'
  };

  t(es: string, en: string) {
    return this.lang.t(es, en);
  }

  handleSubmit() {
    alert(this.t('Configuración guardada', 'Settings saved'));
  }
}