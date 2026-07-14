import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList {

  @Output() edit = new EventEmitter<any>();

  usuarios = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan.perez@irriterra.com',
      rol: 'Vendedor',
      estado: 'Activo',
    },
    {
      id: 2,
      nombre: 'María González',
      email: 'maria.gonzalez@irriterra.com',
      rol: 'Vendedor',
      estado: 'Activo',
    },
    {
      id: 3,
      nombre: 'Carlos Mamani',
      email: 'carlos.mamani@irriterra.com',
      rol: 'Supervisor',
      estado: 'Activo',
    },
    {
      id: 4,
      nombre: 'Ana López',
      email: 'ana.lopez@irriterra.com',
      rol: 'Administrador',
      estado: 'Activo',
    },
    {
      id: 5,
      nombre: 'Pedro Quispe',
      email: 'pedro.quispe@irriterra.com',
      rol: 'Vendedor',
      estado: 'Inactivo',
    },
  ];

  deactivate(id: number) {
    const ok = confirm('¿Desactivar usuario?');
    if (!ok) return;

    this.usuarios = this.usuarios.map(u =>
      u.id === id ? { ...u, estado: 'Inactivo' } : u
    );
  }
}