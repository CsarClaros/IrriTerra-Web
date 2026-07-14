import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-create.html',
  styleUrl: './user-create.css'
})
export class UserCreate {

  @Input() user: any = null;
  @Input() editMode = false;
  @Output() close = new EventEmitter<void>();

  form = {
    nombre: '',
    email: '',
    rol: 'Vendedor',
    password: ''
  };

  ngOnInit() {
    if (this.user) {
      this.form.nombre = this.user.nombre;
      this.form.email = this.user.email;
      this.form.rol = this.user.rol;
    }
  }

  save() {
    console.log('Guardando usuario', this.form);
    this.close.emit();
  }
}