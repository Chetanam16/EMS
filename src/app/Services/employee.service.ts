import { Injectable } from '@angular/core';
import { User } from '../Interfaces/user';
import { map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/user'; 
  constructor(private http: HttpClient) {}

  getEmployees(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users) =>
        users
          .filter((user) => user.role === 'employee')
          .map((user) => ({
            ...user,
            id: user.id ?? null,          }))
      )    );
  }
  getEmployeeById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  // Add a new employee
  addEmployee(employee: User): Observable<User> {
    const newEmployee = { ...employee, role: 'employee' };
    delete newEmployee.id
  return this.http.post<User>(this.apiUrl, newEmployee).pipe(
    tap({
      next: (response) => console.log('Employee added:', response),
      error: (err) => console.error('Error adding employee:', err)
    })
  );
  }

 
  updateEmployee(employee: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${employee.id}`, employee).pipe(
      tap({
        next: () => console.log('Employee updated successfully'),
        error: (err) => console.error('Error updating employee:', err)
      })
    );
  }
  
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => console.log('Employee deleted successfully'),
        error: (err) => console.error('Error deleting employee:', err)
      })
    );
  }
}
