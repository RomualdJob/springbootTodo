import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component'; 
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: 'todolist', component: TodoListComponent }, // Route vers la To-Do List
  { path: '', redirectTo: '/register', pathMatch: 'full' }, // Redirection par défaut vers le composant 'Register'
  { path: 'login', component: LoginComponent }, // Route vers le Login
  { path: 'register', component: RegisterComponent } // Route vers l'inscription
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
