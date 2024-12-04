import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../Interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3000/user';
  private currentUser: User | null = null;
  authenticate(username: string, password: string): Observable<User | null> {
    
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users) => {
        const user = users.find(
          (user) => user.username === username && user.password === password
        );
        if (user) {
          this.currentUser = user;
          return user;
        } else {
          return null;
        }
      }),
      catchError(() => {
        return of(null);
      })
    );
  }
  getCurrentUser(): User | null {
    return this.currentUser;
  }

}
