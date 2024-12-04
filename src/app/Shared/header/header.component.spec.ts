import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Services/auth.service';
import { of } from 'rxjs';
import { LoginComponent } from '../../Components/login/login.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['info', 'success', 'error']);
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should open the login modal if not logged in when toggleLogin is called', () => {
    component.isLoggedIn.set(false); // Simulate not logged in

    const dialogRefMock = {
      afterClosed: () => of({ role: 'admin' }),
    };
    dialogSpy.open.and.returnValue(dialogRefMock as any);

    component.toggleLogin();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(dialogSpy.open).toHaveBeenCalledWith(LoginComponent, {
      width: '400px',
      disableClose: true,
    });
  });

  it('should log out and navigate to the home page if already logged in when toggleLogin is called', () => {
    component.isLoggedIn.set(true); // Simulate logged in

    component.toggleLogin();

    expect(component.isLoggedIn()).toBe(false);
    expect(toastrSpy.info).toHaveBeenCalledWith('Logged out successfully');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set isLoggedIn to true and navigate to admin dashboard on successful admin login', () => {
    const dialogRefMock = {
      afterClosed: () => of({ role: 'admin' }),
    };
    dialogSpy.open.and.returnValue(dialogRefMock as any);

    component.openLoginModal();

    expect(component.isLoggedIn()).toBe(true);
    expect(component.role()).toBe('admin');
    expect(toastrSpy.success).toHaveBeenCalledWith('You are logged in!');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admindashboard']);
  });

  it('should set isLoggedIn to true and navigate to user dashboard on successful employee login', () => {
    const dialogRefMock = {
      afterClosed: () => of({ role: 'employee' }),
    };
    dialogSpy.open.and.returnValue(dialogRefMock as any);

    component.openLoginModal();

    expect(component.isLoggedIn()).toBe(true);
    expect(component.role()).toBe('employee');
    expect(toastrSpy.success).toHaveBeenCalledWith('You are logged in!');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/userdashboard']);
  });

  it('should show an error message if login fails', () => {
    const dialogRefMock = {
      afterClosed: () => of(null), // Simulate login failure
    };
    dialogSpy.open.and.returnValue(dialogRefMock as any);

    component.openLoginModal();

    expect(component.isLoggedIn()).toBe(false);
    expect(toastrSpy.error).toHaveBeenCalledWith('Login failed. Please try again.');
  });
});
