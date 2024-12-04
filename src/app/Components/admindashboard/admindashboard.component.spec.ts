import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmindashboardComponent } from './admindashboard.component';
import { EmployeeService } from '../../Services/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { User } from '../../Interfaces/user';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

describe('AdmindashboardComponent', () => {
  let component: AdmindashboardComponent;
  let fixture: ComponentFixture<AdmindashboardComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockToastr: jasmine.SpyObj<ToastrService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockEmployees: User[] = [
    { id: 1, name: 'John Doe', position: 'Developer', department: 'IT', contact: '1234567890', email: 'johndoe@example.com', username: 'johndoe', password: 'password123', image: '/images/johndoe.jpg', role: 'employee' }
  ];

  beforeEach(() => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', ['getEmployees', 'deleteEmployee', 'addEmployee', 'updateEmployee']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['error', 'success']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      imports: [AdmindashboardComponent,CommonModule, MatInputModule, MatFormFieldModule, MatTableModule, MatButtonModule],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: MatDialog, useValue: mockDialog },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdmindashboardComponent);
    component = fixture.componentInstance;
  });

  it('should call loadEmployees on ngOnInit', () => {
    const mockEmployees: User[] = [
      {
        id: 1, name: 'John Doe', role: 'employee', position: 'Developer', department: 'IT', contact: '1234567890', email: 'john.doe@example.com', image: '',
        username: '',
        password: ''
      },
      {
        id: 2, name: 'Jane Smith', role: 'employee', position: 'Manager', department: 'HR', contact: '0987654321', email: 'jane.smith@example.com', image: '',
        username: '',
        password: ''
      }
    ];
    mockEmployeeService.getEmployees.and.returnValue(of(mockEmployees)); // Simulate getting employees

    component.ngOnInit(); // Trigger ngOnInit

    // expect(mockEmployeeService.getEmployees).toHaveBeenCalled();
    expect(component.employees).toEqual(mockEmployees);
  });

  it('should display an error if employees cannot be loaded', () => {
    mockEmployeeService.getEmployees.and.returnValue(throwError('Failed to load employees')); // Simulate error in loading employees

    component.loadEmployees(); // Call the method directly

    expect(mockToastr.error).toHaveBeenCalledWith('Failed to load employees.');
  });

  it('should delete an employee', () => {
    const employeeId = 1;
    spyOn(window, 'confirm').and.returnValue(true);
    mockEmployeeService.deleteEmployee.and.returnValue(of(void 0)); // Simulate successful deletion


    component.deleteEmployee(employeeId);

    expect(mockEmployeeService.deleteEmployee).toHaveBeenCalledWith(employeeId);
    expect(mockToastr.success).toHaveBeenCalledWith('Employee deleted successfully');

  });

  it('should handle error if deleting employee fails', () => {
    const employeeId = 1;
    mockEmployeeService.deleteEmployee.and.returnValue(throwError('Failed to delete employee')); // Simulate error in deletion

    spyOn(window, 'confirm').and.returnValue(true); // Mock confirm dialog to return true

    component.deleteEmployee(employeeId);

    expect(mockToastr.error).toHaveBeenCalledWith('Failed to delete employee');
  });

  it('should open the add employee dialog and add employee successfully', () => {
    const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialog.open.and.returnValue(dialogRef);
    dialogRef.afterClosed.and.returnValue(of(mockEmployees[0])); // Simulate dialog returning employee data

    mockEmployeeService.addEmployee.and.returnValue(of(mockEmployees[0])); // Simulate successful employee addition

    component.openAddEmployeeDialog();

    expect(mockDialog.open).toHaveBeenCalledWith(AddEmployeeComponent, { width: '400px', disableClose: true });
    expect(mockEmployeeService.addEmployee).toHaveBeenCalledWith(mockEmployees[0]);
    expect(mockToastr.success).toHaveBeenCalledWith('Employee added successfully');
  });

  it('should handle error when adding an employee', () => {
    const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialog.open.and.returnValue(dialogRef);
    dialogRef.afterClosed.and.returnValue(of(mockEmployees[0])); // Simulate dialog closing with employee data

    mockEmployeeService.addEmployee.and.returnValue(throwError('Failed to add employee')); // Simulate error in adding employee

    component.openAddEmployeeDialog();

    expect(mockToastr.error).toHaveBeenCalledWith('Failed to add employee');
  });

  it('should open the edit employee dialog and update employee successfully', () => {
    const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialog.open.and.returnValue(dialogRef);
    dialogRef.afterClosed.and.returnValue(of(mockEmployees[0])); // Simulate dialog returning updated employee data

    mockEmployeeService.updateEmployee.and.returnValue(of(mockEmployees[0])); // Simulate successful update

    component.openEditEmployeeDialog(mockEmployees[0]);

    expect(mockDialog.open).toHaveBeenCalledWith(AddEmployeeComponent, { width: '400px', disableClose: true, data: mockEmployees[0] });
    expect(mockEmployeeService.updateEmployee).toHaveBeenCalledWith(mockEmployees[0]);
    expect(mockToastr.success).toHaveBeenCalledWith('Employee updated successfully');
  });

  it('should handle error when updating an employee', () => {
    const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialog.open.and.returnValue(dialogRef);
    dialogRef.afterClosed.and.returnValue(of(mockEmployees[0])); // Simulate dialog closing with employee data

    mockEmployeeService.updateEmployee.and.returnValue(throwError('Failed to update employee')); // Simulate error in updating employee

    component.openEditEmployeeDialog(mockEmployees[0]);

    expect(mockToastr.error).toHaveBeenCalledWith('Failed to update employee');
  });
});
