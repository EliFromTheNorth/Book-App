import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { BookService, Book } from './book';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5088/books';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getBooks() makes GET request and returns books', () => {
    const mockBooks: Book[] = [{ id: 1, title: 'Test Book', author: 'Author', publishDate: 2020 }];

    service.getBooks().subscribe(books => expect(books).toEqual(mockBooks));

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockBooks);
  });

  it('addBook() makes POST request with book data', () => {
    const book: Book = { title: 'New Book', author: 'Author', publishDate: 2024 };

    service.addBook(book).subscribe();

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(book);
    req.flush({ ...book, id: 1 });
  });

  it('updateBook() makes PUT request to correct URL', () => {
    const book: Book = { title: 'Updated', author: 'Author', publishDate: 2024 };

    service.updateBook(1, book).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(book);
  });

  it('deleteBook() makes DELETE request to correct URL', () => {
    service.deleteBook(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
