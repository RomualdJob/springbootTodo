import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Todo } from '../models/todo';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  todoForm!: FormGroup;
  todos: Todo[] = [];
  isEditMode: boolean = false;
  filteredList: Todo[] = [];
  httpServicex: HttpService | undefined;

  // Variables de pagination
  page: number = 0;  // Page actuelle
  size: number = 10; // Nombre d'éléments par page
  totalPages: number = 0; // Nombre total de pages
  currentPage:number = 0;

  constructor(
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService
      
  ) {}


 

   // Méthode pour vérifier si l'utilisateur est sur la page de connexion ou d'enregistrement
   isLoginOrRegister(): boolean {
    const currentRoute = this.router.url;
    return currentRoute === '/login' || currentRoute === '/register';
  }



  ngOnInit(): void {
    this.todoForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      completed: [false],
    });
    this.getTodo();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000,
    });
  }

  getTodo(page: number = 0, size: number = 5) {
    this.httpService.getTodo(page, size).subscribe({
      next: (data) => {
        // Confirme les données reçues dans la console
        this.todos = data.content;  
  // Confirme les données reçues dans la console

        const names = this.todos.map(todo => todo.name);
        this.totalPages = data.totalPages;  // Nombre total de pages pour la pagination
        this.currentPage = data.number; 
      
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des todos:", error);
      }
    });
  }
  

  deleteTodo(id: number | undefined) {
    console.log('ID du Todo à supprimer:', id);
    const confirmation = confirm("VOULEZ VOUS SUPPRIMER ?");
    if (id === undefined) {
      console.warn('Aucun ID fourni pour la suppression.');
      return;
    }
    if (confirmation) {
      this.httpService.deleteTodo(id).subscribe(() => {
        this.getTodo();
        this.openSnackBar("Todo supprimé avec succès !");
      });
    }
  }

  updateTodoStatus(todo: Todo, completed: boolean) {
    todo.completed = completed;
    this.httpService.updateTodo(todo).subscribe(() => {
      this.openSnackBar("Statut mis à jour avec succès !");
    });
  }

  handleEdit(todo: Todo) {
    this.isEditMode = true;
    this.todoForm.setValue({
      id: todo.id,
      name: todo.name,
      description: todo.description,
      completed: todo.completed || false,
    });
  }

  onSubmit() {
    if (this.todoForm.invalid) return;
    const formValue: Todo = this.todoForm.value;
    if (this.isEditMode) {
      if (formValue.id) {
        this.httpService.updateTodo(formValue).subscribe({
          next: () => {
            this.getTodo();
            this.todoForm.reset();
            this.isEditMode = false;
            this.openSnackBar("Todo mis à jour avec succès !");
          },
          error: (err) => {
            console.error("Erreur lors de la mise à jour:", err);
            this.openSnackBar("Erreur lors de la mise à jour du Todo !");
          }
        });
      } else {
        console.error("L'ID du todo est manquant lors de la mise à jour");
      }
    } else {
      const todoRequest: Todo = {
        name: formValue.name,
        description: formValue.description,
        completed: false,
      };
      this.httpService.createTodo(todoRequest).subscribe(() => {
        this.getTodo();
        this.todoForm.reset();
        this.openSnackBar("Todo enregistré avec succès !");
      });
    }
  }

  // Méthodes de pagination
  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.getTodo();
    }
  }

  previousPage() {
    if (this.page > 0) {
      this.page--;
      this.getTodo();
    }
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.getTodo();
    }
  }
}
