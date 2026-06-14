import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface Book {
  id?: number;
  title: string;
  author: string;
  publishDate: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

  getBooks() {
    return this.http.get<Book[]>(this.apiUrl);
  }

  addBook(book: Book) {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: number, book: Book) {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
