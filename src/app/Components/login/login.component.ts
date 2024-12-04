import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { User } from '../../Interfaces/user';
@Component({
  selector: 'app-login',
  imports: [ CommonModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatDialogModule,
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<LoginComponent>
  ) {}

  closeDialog(): void {
    this.authenticateUser();
  }
  authenticateUser(): void {
    this.authService.authenticate(this.username, this.password).subscribe(
      (user: User |null) => {
        if (user) {
          this.dialogRef.close(user);
        } else {
          this.toastr.error('Invalid username or password');
        }},
      (error: any) => {
        this.toastr.error('Error connecting to the server');
        console.error(error);
      }
    );
  }
}
