import { Routes } from '@angular/router';
import { AddBook } from './add-book/add-book';
import { EditBook } from './edit-book/edit-book';
import { Home } from './home/home';
import { Citat } from './citat/citat';
import { AddCitat } from './add-citat/add-citat';
import { EditCitat } from './edit-citat/edit-citat';
import { Login } from './login/login';
import { Register } from './register/register';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: Home, canActivate: [authGuard] },
  { path: 'add-book', component: AddBook, canActivate: [authGuard] },
  { path: 'edit-book/:id', component: EditBook, canActivate: [authGuard] },
  { path: 'citat', component: Citat, canActivate: [authGuard] },
  { path: 'add-citat', component: AddCitat, canActivate: [authGuard] },
  { path: 'edit-citat/:id', component: EditCitat, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];


