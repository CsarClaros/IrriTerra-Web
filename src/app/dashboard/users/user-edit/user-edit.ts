import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.css'
})
export class UserEdit {

  @Input() user: any = null;
  @Output() close = new EventEmitter<void>();

  form = {
    id: 0,
    nombre: '',
    email: '',
    rol: '',
    estado: 'Activo'
  };

  ngOnInit() {
    if (this.user) {
      this.form = { ...this.user };
    }
  }

  save() {
    console.log('Usuario actualizado:', this.form);
    this.close.emit();
  }

  cancel() {
    this.close.emit();
  }
}