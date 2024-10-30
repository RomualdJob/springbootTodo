import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  todoApi = 'http://localhost:8080/todos';

  constructor(private httpClient: HttpClient) {}

  createTodo(todo: Todo): Observable<Todo | null> { // Modifié ici
    console.log("salut");

    return this.httpClient.post<Todo>(this.todoApi, todo).pipe(
      catchError((error) => {
        console.error('Erreur lors de la création du todo', error);
        return of(null); // Retourne null en cas d'erreur
      })
    );
  }

  getTodo(page: number, size: number): Observable<any> {
    return this.httpClient.get<any>(`${this.todoApi}?page=${page}&size=${size}`);
  }

  deleteTodo(id: number): Observable<void> {
    const deleteUrl = `${this.todoApi}/${id}`;
      console.log("URL de suppression");
    return this.httpClient.delete<void>(deleteUrl).pipe(
      catchError((error) => {
        console.error('Erreur lors de la suppression du todo', error);
        return of(undefined); // Retourne undefined en cas d'erreur
      })
    );
  }

  updateTodo(todo: Todo): Observable<Todo | null> { // Modifié ici
    const updateUrl = `${this.todoApi}/${todo.id}`;
    return this.httpClient.put<Todo>(updateUrl, todo).pipe(
      catchError((error) => {
        console.error('Erreur lors de la mise à jour du todo', error);
        return of(null); // Retourne null en cas d'erreur
      })
    );
  }
}

interface GetTodoResponse {
  _embedded: {
    todos: Todo[];
  };
}
