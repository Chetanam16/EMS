import { Component } from '@angular/core';
import {  User } from '../../Interfaces/user';
import { EmployeeService } from '../../Services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-userdashboard',
  imports: [CommonModule,MatCardModule,MatFormFieldModule,MatInputModule,MatTableModule,ReactiveFormsModule,FormsModule],
  templateUrl: './userdashboard.component.html',
  styleUrl: './userdashboard.component.css'
})
export class UserdashboardComponent {
  currentEmployee!: User;
  employeeForm!: FormGroup; 
  displayedColumns: string[] = ['id', 'name', 'position', 'department', 'contact', 'email']; 
  dataSource: User[] = []; 
  constructor(
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private authService:AuthService,
    private fb: FormBuilder 
  ) {}

  ngOnInit(): void {
    const employeeId = this.getLoggedInEmployeeId();
    if (employeeId) {
      this.loadEmployeeProfile(employeeId);
    } else {
      this.toastr.error('No employee found.');
    }
    this.employeeForm = this.fb.group({
      id: [null],
      name: [''],
      position: [''],
      department: [''],
      contact: [''],
      email: ['']
    });
  }

  getLoggedInEmployeeId() {
    const loggedInUser = this.authService.getCurrentUser();
    return loggedInUser ? loggedInUser.id : null;
  }

  loadEmployeeProfile(employeeId: number): void {
    this.employeeService.getEmployeeById(employeeId).subscribe(
      (employee: User) => {
        console.log(employee)
        this.currentEmployee = employee;
        this.dataSource = [employee]; 
        this.initializeEmployeeForm(employee); 
      },
      (error) => {
        this.toastr.error('Failed to load employee profile');
        console.error(error);
      }
    );
  }

  initializeEmployeeForm(employee: User): void {
    this.employeeForm .setValue({
      id: employee.id || null,
      name: employee.name || '',
      position: employee.position || '',
      department: employee.department  || '',
      contact: employee.contact || '',
      email: employee.email|| ''

    });
  }
}
