import { Component, signal } from '@angular/core';
import { LoginComponent } from '../../Components/login/login.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../Services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn = signal(false);
  role = signal<string | null>(null);

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}
  toggleLogin(): void {
    if (!this.isLoggedIn()) {
      this.openLoginModal();
    } else {
      this.isLoggedIn.set(false);
      this.toastr.info('Logged out successfully');
      this.router
        .navigate(['/'])
        .then(() => {
          console.log('Navigation successful');
        })
        .catch((err) => {
          console.error('Navigation failed', err);
        });
    }
  }
  openLoginModal(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((user) => {
      if (user?.role) {
        this.isLoggedIn.set(true);
        this.role.set(user.role);
        this.toastr.success('You are logged in!');

        if (user.role === 'admin') {
          this.router.navigate(['/admindashboard']);
        } else if (user.role === 'employee') {
          this.router.navigate(['/userdashboard']);
        }
      } else {
        this.toastr.error('Login failed. Please try again.');
      }
    });
  }
}
