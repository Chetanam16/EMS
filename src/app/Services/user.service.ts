import { Injectable } from '@angular/core';
import { User } from '../Interfaces/user';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // [x: string]: any;
  // private apiUrl = 'http://localhost:3000/users';

  // constructor(private http: HttpClient,private authService: AuthService) {}

  // getAllBlogs(): Observable<User[]> {
  //   return this.http.get<any[]>(this.apiUrl).pipe(
  //     map((users) => {
  //       let allBlogs: User[] = [];
  //       users.forEach(user => {
  //         if (user.blogs) {
  //           allBlogs = allBlogs.concat(user.blogs); 
  //         }
  //       });
  //       return allBlogs;
  //     })
  //   );
  // }
}
