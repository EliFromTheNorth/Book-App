import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { BookService, Book } from '../book';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  books: Book[] = [];
  showDeleteModal = false;
  pendingDeleteId: number | null = null;
  pendingDeleteTitle = '';

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
    });
  }

  deleteBook(id: number, title: string) {
    this.pendingDeleteId = id;
    this.pendingDeleteTitle = title;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.pendingDeleteId == null) return;
    this.bookService.deleteBook(this.pendingDeleteId).subscribe(() => {
      this.books = this.books.filter(b => b.id !== this.pendingDeleteId);
      this.cancelDelete();
    });
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.pendingDeleteId = null;
    this.pendingDeleteTitle = '';
  }
}
