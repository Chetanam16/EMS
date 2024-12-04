import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { UserdashboardComponent } from './userdashboard.component';
import { EmployeeService } from '../../Services/employee.service';
import { AuthService } from '../../Services/auth.service';
import { User } from '../../Interfaces/user';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

describe('UserdashboardComponent', () => {
  let component: UserdashboardComponent;
  let fixture: ComponentFixture<UserdashboardComponent>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let employeeServiceSpy: jasmine.SpyObj<EmployeeService>;
  beforeEach(async () => {
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);

    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getEmployeeById']);

    await TestBed.configureTestingModule({
      imports: [UserdashboardComponent],
      providers:[{ provide: AuthService, useValue: authServiceSpy },
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: ToastrService, useValue: toastrSpy }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should call getLoggedInEmployeeId and loadEmployeeProfile on initialization', () => {
    const employeeIdSpy = spyOn(component, 'getLoggedInEmployeeId').and.returnValue(1);
    const loadEmployeeProfileSpy = spyOn(component, 'loadEmployeeProfile');
    
    component.ngOnInit();
    tick();
    expect(employeeIdSpy).toHaveBeenCalled();
    expect(loadEmployeeProfileSpy).toHaveBeenCalledWith(1);
  });
  it('should initialize the reactive form with default values', () => {
    component.ngOnInit();
    const formValue = component.employeeForm.value;
    expect(formValue).toEqual({
      id: null,
      name: '',
      position: '',
      department: '',
      contact: '',
      email: ''
    });
  });
  it('should load employee profile and update dataSource and form', fakeAsync(() => {
    const mockEmployee: User = {
      id: 1,
      name: 'John Doe',
      position: 'Software Engineer',
      department: 'IT',
      contact: '1234567890',
      email: 'john.doe@example.com',
      username: '',
      password: '',
      role: 'admin'
    };
  
    spyOn(employeeServiceSpy, 'getEmployeeById').and.returnValue(of(mockEmployee));
    const initializeFormSpy = spyOn(component, 'initializeEmployeeForm');
    component.loadEmployeeProfile(1);
    tick();
    expect(component.currentEmployee).toEqual(mockEmployee);
    expect(component.dataSource).toEqual([mockEmployee]);
    expect(initializeFormSpy).toHaveBeenCalledWith(mockEmployee);
  }));
  it('should show an error toast if loading employee profile fails', fakeAsync(() => {
    spyOn(employeeServiceSpy, 'getEmployeeById').and.returnValue(throwError('Error'));
    component.loadEmployeeProfile(1);
    tick();
    expect(toastrSpy.error).toHaveBeenCalledWith('Failed to load employee profile');
  }));
  it('should initialize the form with employee data', () => {
    const mockEmployee: User = {
      id: 1,
      name: 'John Doe',
      position: 'Software Engineer',
      department: 'IT',
      contact: '1234567890',
      email: 'john.doe@example.com',
      username: '',
      password: '',
      role: 'admin'
    };
  
    component.initializeEmployeeForm(mockEmployee);
  
    expect(component.employeeForm.value).toEqual({
      id: 1,
      name: 'John Doe',
      position: 'Software Engineer',
      department: 'IT',
      contact: '1234567890',
      email: 'john.doe@example.com'
    });
  });
  it('should update the dataSource with employee data', () => {
    const mockEmployee: User = {
      id: 1,
      name: 'John Doe',
      position: 'Software Engineer',
      department: 'IT',
      contact: '1234567890',
      email: 'john.doe@example.com',
      username: '',
      password: '',
      role: 'admin'
    };
  
    component.dataSource = [mockEmployee];
  
    expect(component.dataSource.length).toBe(1);
    expect(component.dataSource[0]).toEqual(mockEmployee);
  });
  it('should update the dataSource with employee data', () => {
  const mockEmployee: User = {
    id: 1,
    name: 'John Doe',
    position: 'Software Engineer',
    department: 'IT',
    contact: '1234567890',
    email: 'john.doe@example.com',
    username: '',
    password: '',
    role: 'admin'
  };

  component.dataSource = [mockEmployee];

  expect(component.dataSource.length).toBe(1);
  expect(component.dataSource[0]).toEqual(mockEmployee);
});
it('should define displayed columns for the table', () => {
  expect(component.displayedColumns).toEqual(['id', 'name', 'position', 'department', 'contact', 'email']);
});

  it('should return the logged-in employee ID', () => {
    spyOn(authServiceSpy, 'getCurrentUser').and.returnValue({ id: 123, name: 'John Doe' ,username: 'johndoe',
      password: 'password123',
      role: 'employee'});
  
    const employeeId = component.getLoggedInEmployeeId();
  
    expect(employeeId).toEqual(123);
  });
  it('should load employee profile and update dataSource and form', () => {
    const mockEmployee: User = {
      id: 1,
      name: 'John Doe',
      position: 'Software Engineer',
      department: 'IT',
      contact: '1234567890',
      email: 'john.doe@example.com',
      username: '',
      password: '',
      role: 'admin'
    };
  
    spyOn(employeeServiceSpy, 'getEmployeeById').and.returnValue(of(mockEmployee));
    const initializeFormSpy = spyOn(component, 'initializeEmployeeForm');
  
    component.loadEmployeeProfile(1);
  
    expect(component.currentEmployee).toEqual(mockEmployee);
    expect(component.dataSource).toEqual([mockEmployee]);
    expect(initializeFormSpy).toHaveBeenCalledWith(mockEmployee);
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
