import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from '../Interfaces/user';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const mockUsers: User[] = [
    {
      id: 1, username: 'admin', password: 'admin123', role: 'admin',
      name: ''
    },
    {
      id: 2, username: 'employee', password: 'employee123', role: 'employee',
      name: ''
    },
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],

    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authenticate a valid user', (done) => {
    const username = 'admin';
    const password = 'admin123';

    service.authenticate(username, password).subscribe((user) => {
      expect(user).toEqual(mockUsers[0]); // Verify the correct user is returned
      expect(service.getCurrentUser()).toEqual(mockUsers[0]); // Verify currentUser is set
      done();
    });

    const req = httpMock.expectOne('http://localhost:3000/user');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers); // Simulate server response
  });

  it('should return null for an invalid user', (done) => {
    const username = 'invalidUser';
    const password = 'wrongPassword';

    service.authenticate(username, password).subscribe((user) => {
      expect(user).toBeNull(); // Verify null is returned for invalid credentials
      expect(service.getCurrentUser()).toBeNull(); // Verify currentUser remains null
      done();
    });

    const req = httpMock.expectOne('http://localhost:3000/user');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers); // Simulate server response
  });

  it('should handle HTTP errors gracefully and return null', (done) => {
    const username = 'admin';
    const password = 'admin123';

    service.authenticate(username, password).subscribe((user) => {
      expect(user).toBeNull(); // Verify null is returned on HTTP error
      expect(service.getCurrentUser()).toBeNull(); // Verify currentUser remains null
      done();
    });

    const req = httpMock.expectOne('http://localhost:3000/user');
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error')); // Simulate HTTP error
  });

  it('should return the current user if already authenticated', () => {
    const mockUser: User = {
      id: 1, username: 'admin', password: 'admin123', role: 'admin',
      name: ''
    };

    // Simulate the user being set as authenticated
    (service as any).currentUser = mockUser;

    const currentUser = service.getCurrentUser();

    expect(currentUser).toEqual(mockUser); // Verify the current user is returned
  });

  it('should return null if no user is authenticated', () => {
    const currentUser = service.getCurrentUser();

    expect(currentUser).toBeNull(); // Verify null is returned if no user is authenticated
  });
});
