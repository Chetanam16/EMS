import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  imports: [MatCardModule,MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  announcements = [
    {
      title: 'Office Closed on Christmas',
      content: 'Our office will remain closed on December 25th for Christmas.'
    },
    {
      title: 'Annual Performance Reviews',
      content: 'The annual performance review process starts on January 1st.'
    },
    {
      title: 'New Employee Portal Launched',
      content: 'We have launched a new employee self-service portal for better accessibility.'
    }
  ];
}
