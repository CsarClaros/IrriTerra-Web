import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserList } from './user-list/user-list';
import { UserCreate } from './user-create/user-create';
import { UserEdit } from './user-edit/user-edit';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UserList, UserCreate, UserEdit],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {

  showModal = false;
  editMode = false;
  selectedUser: any = null;

  openCreate() {
    this.editMode = false;
    this.selectedUser = null;
    this.showModal = true;
  }

  openEdit(user: any) {
    this.editMode = true;
    this.selectedUser = user;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
  }
}