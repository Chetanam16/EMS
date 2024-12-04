import { Component, Inject } from '@angular/core';
import {  User } from '../../Interfaces/user';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-employee',
  imports: [CommonModule,MatFormFieldModule,MatInputModule,ReactiveFormsModule,FormsModule,MatButtonModule,MatDialogModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent {
  employeeForm!: FormGroup; 
  image: string = '';

  constructor(
    private toastr: ToastrService,

    public dialogRef: MatDialogRef<AddEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private fb: FormBuilder 
  ) { }
user:User| undefined;
selectedImage: File | null = null;
triggerFileInput(): void {
  const fileInput = document.getElementById('file-input') as HTMLElement;
  fileInput.click();
}

onImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input?.files?.length) {
    this.selectedImage = input.files[0];
    this.image = `/images/${this.selectedImage.name}`;
    this.employeeForm.patchValue({
      image: this.image 
    });
    this.toastr.info('Image selected: ' + this.selectedImage.name);
  }
}

  ngOnInit(): void {
  
    this.employeeForm = this.fb.group({
      id: [this.data ? this.data.id : null], 
      name: [this.data ? this.data.name : '', Validators.required],
      position: [this.data ? this.data.position : '', Validators.required],
      department: [this.data ? this.data.department : '', Validators.required],
      contact: [this.data ? this.data.contact : '', Validators.required],
      email: [this.data ? this.data.email : '', [Validators.required, Validators.email]],
      username: [this.data ? this.data.username : '', Validators.required],
      password: [this.data ? this.data.password : '', Validators.required],
      image: [this.data ? this.data.image : '', Validators.required] 
    });
  }

  onSave(): void {
 const role='employee';

    if (this.employeeForm.valid) {
      let formValue = { ...this.employeeForm.value,role };
      if (!formValue.image) {
        formValue.image = '/images/default-image.jpg';  
      }
      if (!formValue.id) {
        formValue = { ...formValue, id: undefined }; 
      }
    this.dialogRef.close(formValue); 
  } else {
    alert('Please fill out all required fields.');
  }
  }

  onCancel(): void {
    this.dialogRef.close(); 
  }
}
