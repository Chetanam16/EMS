import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../Services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../Interfaces/user';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<LoginComponent>>;
  let mockToastr: jasmine.SpyObj<ToastrService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['authenticate']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['error']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [FormsModule,LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call authenticateUser when closeDialog is called', () => {
    spyOn(component, 'authenticateUser');
    component.closeDialog();
    expect(component.authenticateUser).toHaveBeenCalled();
  });

  it('should close the dialog with the user data when authentication is successful', () => {
    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      password: 'password123',
      position: 'Developer',
      department: 'IT',
      contact: '1234567890',
      email: 'john@example.com',
      image: '/images/johndoe.jpg',
      role: 'admin'
    };

    mockAuthService.authenticate.and.returnValue(of(mockUser));
    component.username = 'johndoe';
    component.password = 'password123';

    component.authenticateUser();

    expect(mockAuthService.authenticate).toHaveBeenCalledWith('johndoe', 'password123');
    expect(mockDialogRef.close).toHaveBeenCalledWith(mockUser);
  });

  it('should show an error toast when authentication fails', () => {
    mockAuthService.authenticate.and.returnValue(of(null));
    component.username = 'invaliduser';
    component.password = 'wrongpassword';

    component.authenticateUser();

    expect(mockAuthService.authenticate).toHaveBeenCalledWith('invaliduser', 'wrongpassword');
    expect(mockToastr.error).toHaveBeenCalledWith('Invalid username or password');
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should show an error toast when there is a server error', () => {
    const mockError = { status: 500, message: 'Internal Server Error' };
    mockAuthService.authenticate.and.returnValue(throwError(() => mockError));
    component.username = 'johndoe';
    component.password = 'password123';

    component.authenticateUser();

    expect(mockAuthService.authenticate).toHaveBeenCalledWith('johndoe', 'password123');
    expect(mockToastr.error).toHaveBeenCalledWith('Error connecting to the server');
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should not call authService.authenticate if username or password is empty', () => {
    component.username = '';
    component.password = '';

    spyOn(component, 'authenticateUser');
    component.authenticateUser();

    expect(mockAuthService.authenticate).not.toHaveBeenCalled();
  });
});
