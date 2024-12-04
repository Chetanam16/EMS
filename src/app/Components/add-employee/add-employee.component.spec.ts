import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEmployeeComponent } from './add-employee.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('AddEmployeeComponent', () => {
  let component: AddEmployeeComponent;
  let fixture: ComponentFixture<AddEmployeeComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<AddEmployeeComponent>>;
  let mockToastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['info']);

    await TestBed.configureTestingModule({
      imports: [AddEmployeeComponent,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: ToastrService, useValue: mockToastr },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values if no data is provided', () => {
    expect(component.employeeForm.value).toEqual({
      id: null,
      name: '',
      position: '',
      department: '',
      contact: '',
      email: '',
      username: '',
      password: '',
      image: '',
    });
  });

  it('should initialize the form with provided data', () => {
    const mockData = {
      id: 1,
      name: 'John Doe',
      position: 'Developer',
      department: 'IT',
      contact: '1234567890',
      email: 'john@example.com',
      username: 'johndoe',
      password: 'password123',
      image: '/images/profile.jpg',
    };

    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: mockData });
    fixture = TestBed.createComponent(AddEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.employeeForm.value).toEqual(mockData);
  });

  it('should mark the form invalid if required fields are missing', () => {
    component.employeeForm.patchValue({
      name: '',
      email: '',
    });
    expect(component.employeeForm.valid).toBeFalse();
  });
  it('should call alert when the form is invalid', () => {
    spyOn(window, 'alert'); // Mock the alert function
    component.employeeForm.patchValue({ name: '' }); // Invalid form
    component.onSave();
    expect(window.alert).toHaveBeenCalledWith('Please fill out all required fields.');
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });
  it('should close the dialog with the form value when onSave is called and the form is valid', () => {
    component.employeeForm.patchValue({
      id: null,
      name: 'John Doe',
      position: 'Developer',
      department: 'IT',
      contact: '1234567890',
      email: 'john@example.com',
      username: 'johndoe',
      password: 'password123',
      image: '/images/profile.jpg',
    });

    component.onSave();
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      id: undefined,
      name: 'John Doe',
      position: 'Developer',
      department: 'IT',
      contact: '1234567890',
      email: 'john@example.com',
      username: 'johndoe',
      password: 'password123',
      image: '/images/profile.jpg',
      role: 'employee',
    });
  });

  it('should not close the dialog if the form is invalid', () => {
    component.employeeForm.patchValue({
      name: '',
    });
    component.onSave();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should close the dialog without data when onCancel is called', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });

  it('should update the image path and patch the form when an image is selected', () => {
    const mockEvent = {
      target: {
        files: [{ name: 'profile.jpg' }],
      },
    } as unknown as Event;

    component.onImageSelected(mockEvent);
    expect(component.selectedImage?.name).toBe('profile.jpg');
    expect(component.image).toBe('/images/profile.jpg');
    expect(component.employeeForm.get('image')?.value).toBe('/images/profile.jpg');
    expect(mockToastr.info).toHaveBeenCalledWith('Image selected: profile.jpg');
  });
  it('should not update image if no file is selected', () => {
    const mockEvent = {
      target: {
        files: [],
      },
    } as unknown as Event;
  
    component.onImageSelected(mockEvent);
    expect(component.selectedImage).toBeNull();
    expect(component.image).toBe('');
    expect(mockToastr.info).not.toHaveBeenCalled();
  });
  it('should use default image path if no image is provided on save', () => {
    component.employeeForm.patchValue({
      id: null,
      name: 'John Doe',
      position: 'Developer',
      department: 'IT',
      contact: '1234567890',
      email: 'john@example.com',
      username: 'johndoe',
      password: 'password123',
      image: '', // Explicitly set image to empty
    });
  
    component.onSave();
  
    // Verify that dialogRef.close is called with expected values
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      id: undefined,
      name: 'John Doe',
      position: 'Developer',
      department: 'IT',
      contact: '1234567890',
      email: 'john@example.com',
      username: 'johndoe',
      password: 'password123',
      image: '/images/default-image.jpg',
      role: 'employee',
    });
  });
  
});
