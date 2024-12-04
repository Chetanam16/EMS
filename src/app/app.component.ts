import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./Components/login/login.component";
import { MatDialogModule } from '@angular/material/dialog';
import { HeaderComponent } from "./Shared/header/header.component";
import { HomeComponent } from './Components/home/home.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatDialogModule, LoginComponent, HeaderComponent,HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Employee';
}
