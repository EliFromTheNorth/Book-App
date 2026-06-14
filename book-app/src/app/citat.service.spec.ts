import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CitatService, Citat } from './citat.service';

describe('CitatService', () => {
  let service: CitatService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5088/citater';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CitatService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CitatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCitater() makes GET request and returns quotes', () => {
    const mockCitater: Citat[] = [{ id: 1, text: 'Test quote', author: 'Author' }];

    service.getCitater().subscribe(citater => expect(citater).toEqual(mockCitater));

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCitater);
  });

  it('addCitat() makes POST request with quote data', () => {
    const citat: Citat = { text: 'New quote', author: 'Author' };

    service.addCitat(citat).subscribe();

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(citat);
    req.flush({ ...citat, id: 1 });
  });

  it('updateCitat() makes PUT request to correct URL', () => {
    const citat: Citat = { text: 'Updated quote', author: 'Author' };

    service.updateCitat(1, citat).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(citat);
  });

  it('deleteCitat() makes DELETE request to correct URL', () => {
    service.deleteCitat(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
