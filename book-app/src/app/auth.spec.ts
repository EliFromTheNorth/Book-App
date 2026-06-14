import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isLoggedIn() returns false when no token in storage', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('isLoggedIn() returns true when token exists', () => {
    localStorage.setItem('token', 'test-token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('getToken() returns null when no token', () => {
    expect(service.getToken()).toBeNull();
  });

  it('getToken() returns the stored token', () => {
    localStorage.setItem('token', 'abc123');
    expect(service.getToken()).toBe('abc123');
  });

  it('logout() removes the token from storage', () => {
    localStorage.setItem('token', 'test-token');
    service.logout();
    expect(service.getToken()).toBeNull();
  });

  it('login() stores received token in localStorage', () => {
    service.login('testuser', 'password').subscribe();

    const req = httpMock.expectOne('http://localhost:5088/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'testuser', password: 'password' });
    req.flush({ token: 'received-token' });

    expect(service.getToken()).toBe('received-token');
  });
});
