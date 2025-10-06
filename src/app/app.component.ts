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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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

