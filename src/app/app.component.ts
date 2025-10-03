import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toEC, toGC } from 'kenat';
import { EthiopianCalendarComponent } from './ethiopian-calendar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    ReactiveFormsModule,
    EthiopianCalendarComponent
  ],
  template: `
    <div class="container">
      <mat-card class="main-card">
        <mat-card-header>
          <mat-card-title>Ethiopian Calendar App</mat-card-title>
          <mat-card-subtitle>ኢትዮጵያዊ የቀን መቁጠሪያ</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="date-picker-section">
            <h3>ቀን ይምረጡ / Select Date</h3>
            <app-ethiopian-calendar 
              [selectedDate]="selectedDate.value"
              (dateSelected)="onDateSelected($event)">
            </app-ethiopian-calendar>
            <div class="selection-feedback" *ngIf="selectedDate.value && isValidDate(selectedDate.value)">
              <p class="selected-date-info">
                <strong>Selected Date:</strong> {{ getEthiopianDate() }} 
                <span class="gregorian-info">({{ getGregorianDate() }})</span>
              </p>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="conversion-section" *ngIf="selectedDate.value">
            <h3>Date Conversion</h3>
            
            <div class="conversion-grid">
              <div class="conversion-item">
                <h4>Ethiopian Date</h4>
                <p class="ethiopian-date">{{ getEthiopianDate() }}</p>
              </div>
              
              <div class="conversion-item">
                <h4>Gregorian Date</h4>
                <p class="gregorian-date">{{ getGregorianDate() }}</p>
              </div>
            </div>

            <div class="additional-info">
              <h4>Additional Information</h4>
              <p><strong>Ethiopian Year:</strong> {{ getEthiopianYear() }}</p>
              <p><strong>Ethiopian Month:</strong> {{ getEthiopianMonth() }}</p>
              <p><strong>Ethiopian Day:</strong> {{ getEthiopianDay() }}</p>
              <p><strong>Days in Month:</strong> {{ getDaysInEthiopianMonth() }}</p>
              <p><strong>Is Leap Year:</strong> {{ isEthiopianLeapYear() ? 'Yes' : 'No' }}</p>
            </div>
          </div>

        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .main-card {
      margin: 20px 0;
    }

    .full-width {
      width: 100%;
    }

    .date-picker-section {
      margin: 20px 0;
    }

    .selection-feedback {
      margin-top: 15px;
      padding: 10px;
      background-color: #e8f5e8;
      border-radius: 4px;
      border-left: 4px solid #4caf50;
    }

    .selected-date-info {
      margin: 0;
      color: #2e7d32;
    }

    .gregorian-info {
      color: #666;
      font-size: 0.9em;
    }

    .conversion-section {
      margin: 30px 0;
    }

    .conversion-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 20px 0;
    }

    .conversion-item {
      text-align: center;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background-color: #fafafa;
    }

    .ethiopian-date {
      font-size: 1.5em;
      font-weight: bold;
      color: #1976d2;
      margin: 10px 0;
    }

    .gregorian-date {
      font-size: 1.5em;
      font-weight: bold;
      color: #388e3c;
      margin: 10px 0;
    }

    .additional-info {
      margin: 20px 0;
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }

    .additional-info p {
      margin: 8px 0;
    }


    h3 {
      color: #333;
      margin-bottom: 15px;
    }

    h4 {
      color: #555;
      margin-bottom: 10px;
    }

    @media (max-width: 600px) {
      .conversion-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppComponent {
  selectedDate = new FormControl(new Date());

  getEthiopianDate(): string {
    if (!this.selectedDate.value || !this.isValidDate(this.selectedDate.value)) return '';
    const date = this.selectedDate.value;
    try {
      const ethDate = toEC(date.getFullYear(), date.getMonth() + 1, date.getDate());
      const amMonths = [
        'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
        'መጋቢት', 'ሚያዚያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
      ];
      return `${ethDate.day} ${amMonths[ethDate.month - 1]} ${ethDate.year}`;
    } catch (error) {
      return '';
    }
  }

  getGregorianDate(): string {
    if (!this.selectedDate.value || !this.isValidDate(this.selectedDate.value)) return '';
    return this.selectedDate.value.toLocaleDateString('en-GB');
  }

  getEthiopianYear(): number {
    if (!this.selectedDate.value || !this.isValidDate(this.selectedDate.value)) return 0;
    const date = this.selectedDate.value;
    try {
      return toEC(date.getFullYear(), date.getMonth() + 1, date.getDate()).year;
    } catch (error) {
      return 0;
    }
  }

  getEthiopianMonth(): string {
    if (!this.selectedDate.value || !this.isValidDate(this.selectedDate.value)) return '';
    const date = this.selectedDate.value;
    try {
      const ethDate = toEC(date.getFullYear(), date.getMonth() + 1, date.getDate());
      const amMonths = [
        'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
        'መጋቢት', 'ሚያዚያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
      ];
      return amMonths[ethDate.month - 1];
    } catch (error) {
      return '';
    }
  }

  getEthiopianDay(): number {
    if (!this.selectedDate.value || !this.isValidDate(this.selectedDate.value)) return 0;
    const date = this.selectedDate.value;
    try {
      return toEC(date.getFullYear(), date.getMonth() + 1, date.getDate()).day;
    } catch (error) {
      return 0;
    }
  }


  onDateSelected(date: Date): void {
    this.selectedDate.setValue(date);
  }

  getDaysInEthiopianMonth(): number {
    if (!this.selectedDate.value || !this.isValidDate(this.selectedDate.value)) return 30;
    const date = this.selectedDate.value;
    try {
      const ethDate = toEC(date.getFullYear(), date.getMonth() + 1, date.getDate());
      if (ethDate.month === 13) {
        // Pagume (13th month) has 5 or 6 days depending on leap year
        return (ethDate.year % 4 === 0) ? 6 : 5;
      }
      return 30; // All other months have 30 days
    } catch (error) {
      return 30;
    }
  }

  isEthiopianLeapYear(): boolean {
    if (!this.selectedDate.value || !this.isValidDate(this.selectedDate.value)) return false;
    const date = this.selectedDate.value;
    try {
      const ethDate = toEC(date.getFullYear(), date.getMonth() + 1, date.getDate());
      return ethDate.year % 4 === 0;
    } catch (error) {
      return false;
    }
  }

  isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
}

