import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../book';

@Component({
  selector: 'app-add-book',
  imports: [NgIf, FormsModule, RouterLink],
  templateUrl: './add-book.html',
})
export class AddBook {
  book = {
    title: '',
    author: '',
    publishDate: ''
  };

  constructor(private bookService: BookService, private router: Router) {}

  onSubmit() {
    const bookToSend = { ...this.book, publishDate: Number(this.book.publishDate) };
    this.bookService.addBook(bookToSend).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
