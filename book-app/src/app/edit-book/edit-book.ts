import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { BookService } from '../book';

@Component({
  selector: 'app-edit-book',
  imports: [FormsModule, RouterLink, NgIf],
  templateUrl: './edit-book.html',
})
export class EditBook implements OnInit {
  book = { title: '', author: '', publishDate: null as number | null };
  id!: number;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBooks().subscribe(books => {
      const found = books.find(b => b.id === this.id);
      if (found) {
        this.book = { title: found.title, author: found.author, publishDate: found.publishDate };
      }
    });
  }

  onSubmit() {
    this.bookService.updateBook(this.id, this.book).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
