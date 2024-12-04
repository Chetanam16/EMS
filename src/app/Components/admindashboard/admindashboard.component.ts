import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../../Services/employee.service';
import {  User } from '../../Interfaces/user';
import { ToastrService } from 'ngx-toastr';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admindashboard',
  imports: [CommonModule,MatInputModule,MatFormFieldModule,MatTableModule,MatButtonModule],
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.css'
})
export class AdmindashboardComponent {
  employees!: User[];
  
  displayedColumns: string[] = ['image', 'id', 'name', 'position', 'department', 'contact', 'email', 'actions'];

  constructor(
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (data) => {
     console.log(data);
        this.employees = data.filter((user) => user.role === 'employee');
      },
      (error) => {
        this.toastr.error('Failed to load employees.');
        console.error(error);
      }
    );
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(
        () => {
          this.loadEmployees(); 
          this.toastr.success('Employee deleted successfully');
        },
        (error) => {
          this.toastr.error('Failed to delete employee');
          console.error(error);
        }
      );
    }
  }
  openAddEmployeeDialog(): void {
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '400px',
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.addEmployee(result).subscribe(
          () => {
            this.loadEmployees(); 
            this.toastr.success('Employee added successfully');
          },
          (error) => {
            this.toastr.error('Failed to add employee');
            console.error(error);
          }
        );
      }
    });
  }
  
  
  openEditEmployeeDialog(employee: User): void {
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '400px',
      disableClose: true,
      data: employee
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.updateEmployee(result).subscribe(
          () => {
            this.loadEmployees(); 
            this.toastr.success('Employee updated successfully');
          },
          (error) => {
            this.toastr.error('Failed to update employee');
            console.error(error);
          }
        );
      }
    });
  }
}
