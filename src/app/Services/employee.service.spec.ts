import { TestBed } from '@angular/core/testing';

import { EmployeeService } from './employee.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from '../Interfaces/user';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  const mockEmployees: User[] = [
    { id: 1, username: 'employee1', password: 'pass1', role: 'employee', name: 'John Doe' },
    { id: 2, username: 'employee2', password: 'pass2', role: 'employee', name: 'Jane Smith' },
    { id: 3, username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule],
      providers: [EmployeeService],});
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all employees (filtering by role)', (done) => {
    service.getEmployees().subscribe((employees) => {
      expect(employees.length).toBe(2); // Only employees with role 'employee'
      expect(employees[0].role).toBe('employee');
      expect(employees[1].role).toBe('employee');
      done();
    });

    const req = httpMock.expectOne('http://localhost:3000/user');
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees); // Simulate server response
  });

  it('should fetch a single employee by ID', (done) => {
    const employeeId = 1;

    service.getEmployeeById(employeeId).subscribe((employee) => {
      expect(employee).toEqual(mockEmployees[0]); // Verify the correct employee is returned
      done();
    });

    const req = httpMock.expectOne(`http://localhost:3000/user/${employeeId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees[0]); // Simulate server response
  });

  it('should add a new employee', (done) => {
    const newEmployee: User = {
      id: 4,
      username: 'employee3',
      password: 'pass3',
      role: 'employee',
      name: 'New Employee',
    };

    service.addEmployee(newEmployee).subscribe((response) => {
      expect(response).toEqual(newEmployee); // Verify the response matches the new employee
      done();
    });

    const req = httpMock.expectOne('http://localhost:3000/user');
    expect(req.request.method).toBe('POST');
    req.flush(newEmployee); // Simulate server response
  });

  it('should update an existing employee', (done) => {
    const updatedEmployee: User = {
      id: 1,
      username: 'employee1',
      password: 'updatedPass',
      role: 'employee',
      name: 'Updated John Doe',
    };

    service.updateEmployee(updatedEmployee).subscribe((response) => {
      expect(response).toEqual(updatedEmployee); // Verify the response matches the updated employee
      done();
    });

    const req = httpMock.expectOne(`http://localhost:3000/user/${updatedEmployee.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedEmployee); // Simulate server response
  });

  it('should delete an employee by ID', (done) => {
    const employeeId = 1;

    service.deleteEmployee(employeeId).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne(`http://localhost:3000/user/${employeeId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Simulate successful deletion
  });
});
