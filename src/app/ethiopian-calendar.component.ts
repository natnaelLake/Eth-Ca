import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { toEC, toGC } from 'kenat';

interface EthiopianDate {
  year: number;
  month: number;
  date: number;
}

@Component({
  selector: 'app-ethiopian-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="ethiopian-calendar">
      <!-- Year Navigation -->
      <div class="calendar-header">
        <button mat-icon-button (click)="previousYear()">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <div class="year-selection">
          <input 
            type="number" 
            [(ngModel)]="currentEthiopianYear" 
            (change)="onYearChange()"
            class="year-input"
            min="1900" 
            max="2100"
            placeholder="Year">
          <button mat-icon-button (click)="goToToday()" class="today-button" matTooltip="Go to Today">
            <mat-icon>today</mat-icon>
          </button>
        </div>
        <button mat-icon-button (click)="nextYear()">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>

      <!-- Month Selection -->
      <div class="month-selection" *ngIf="!selectedMonth">
        <div class="month-header">
          <h3>Select Month</h3>
          <button mat-raised-button color="accent" (click)="goToToday()" class="today-month-button">
            <mat-icon>today</mat-icon>
            Go to Today
          </button>
        </div>
        <div class="month-grid">
          <button 
            *ngFor="let month of ethiopianMonths; let i = index"
            mat-raised-button
            class="month-button"
            (click)="selectMonth(i + 1)">
            {{ month }}
          </button>
        </div>
      </div>

      <!-- Month View -->
      <div class="month-view" *ngIf="selectedMonth">
        <!-- Month Header -->
        <div class="month-header">
          <button mat-icon-button (click)="goBackToMonths()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <span class="month-year">{{ getMonthName(selectedMonth) }} {{ currentEthiopianYear }}</span>
          <button mat-icon-button (click)="nextMonth()" [disabled]="selectedMonth >= 13">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>

        <!-- Day Headers -->
        <div class="day-headers">
          <div *ngFor="let day of dayNames" class="day-header">{{ day }}</div>
        </div>

        <!-- Calendar Grid -->
        <div class="calendar-grid">
          <button 
            *ngFor="let day of calendarDays; let i = index"
            mat-button
            class="day-button"
            [class.selected]="isSelected(day)"
            [class.today]="isToday(day)"
            [disabled]="!day"
            (click)="selectDate(day)">
            {{ day }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ethiopian-calendar {
      max-width: 400px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: #1976d2;
      color: white;
    }

    .year-selection {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .year-input {
      width: 80px;
      padding: 8px 12px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 1.1em;
      font-weight: bold;
      text-align: center;
    }

    .year-input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .year-input:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.6);
      background: rgba(255, 255, 255, 0.2);
    }

    .today-button {
      color: white;
    }

    .today-button:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .month-selection {
      padding: 20px;
    }

    .month-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .month-header h3 {
      margin: 0;
      color: #333;
    }

    .today-month-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .month-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .month-button {
      min-height: 40px;
      font-size: 0.9em;
    }

    .month-view {
      padding: 16px;
    }

    .month-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .month-year {
      font-size: 1.1em;
      font-weight: bold;
      color: #333;
    }

    .day-headers {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
      margin-bottom: 8px;
    }

    .day-header {
      text-align: center;
      font-weight: bold;
      color: #666;
      padding: 8px 4px;
      font-size: 0.9em;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
    }

    .day-button {
      min-height: 40px;
      min-width: 40px;
      border-radius: 50%;
      font-size: 0.9em;
    }

    .day-button.selected {
      background: #1976d2;
      color: white;
    }

    .day-button.today {
      background: #ff9800;
      color: white;
    }

    .day-button:disabled {
      opacity: 0.3;
    }
  `]
})
export class EthiopianCalendarComponent implements OnInit {
  @Input() selectedDate: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();

  currentEthiopianYear = 2017; // Current Ethiopian year
  selectedMonth: number | null = null;
  
  ethiopianMonths = [
    'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
    'መጋቢት', 'ሚያዚያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
  ];

  dayNames = ['እሁድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'አርብ', 'ቅዳሜ'];
  
  calendarDays: (number | null)[] = [];

  ngOnInit() {
    // Initialize with current Ethiopian year
    const today = new Date();
    try {
      const ethToday = toEC(today.getFullYear(), today.getMonth() + 1, today.getDate());
      this.currentEthiopianYear = ethToday.year;
    } catch (error) {
      console.error('Error getting current Ethiopian year:', error);
      // Fallback to a known working year
      this.currentEthiopianYear = 2017; // Ethiopian year 2017
    }
  }

  selectMonth(month: number) {
    this.selectedMonth = month;
    this.generateCalendarDays();
    this.debugYearStructure();
  }

  debugYearStructure() {
    console.log(`\n=== Ethiopian Year ${this.currentEthiopianYear} Structure ===`);
    let currentDayOfWeek = this.getFirstDayOfEthiopianMonth(this.currentEthiopianYear, 1);
    
    for (let month = 1; month <= 13; month++) {
      const monthName = this.getMonthName(month);
      const daysInMonth = this.getDaysInEthiopianMonth(this.currentEthiopianYear, month);
      const lastDayOfWeek = (currentDayOfWeek + daysInMonth - 1) % 7;
      
      console.log(`${monthName}: ${this.dayNames[currentDayOfWeek]} (${currentDayOfWeek}) to ${this.dayNames[lastDayOfWeek]} (${lastDayOfWeek}) - ${daysInMonth} days`);
      
      // Calculate first day of next month
      currentDayOfWeek = (currentDayOfWeek + daysInMonth) % 7;
    }
    console.log('=====================================\n');
  }

  goBackToMonths() {
    this.selectedMonth = null;
  }

  previousYear() {
    this.currentEthiopianYear--;
    if (this.selectedMonth) {
      this.generateCalendarDays();
    }
  }

  nextYear() {
    this.currentEthiopianYear++;
    if (this.selectedMonth) {
      this.generateCalendarDays();
    }
  }

  onYearChange() {
    // Validate year range
    if (this.currentEthiopianYear < 1900) {
      this.currentEthiopianYear = 1900;
    } else if (this.currentEthiopianYear > 2100) {
      this.currentEthiopianYear = 2100;
    }
    
    if (this.selectedMonth) {
      this.generateCalendarDays();
    }
  }

  goToToday() {
    try {
      const today = new Date();
      const ethToday = toEC(today.getFullYear(), today.getMonth() + 1, today.getDate());
      
      console.log('Today Gregorian:', today);
      console.log('Today Ethiopian:', ethToday);
      
      // Validate Ethiopian date
      if (!ethToday || typeof ethToday.year !== 'number' || typeof ethToday.month !== 'number' || typeof ethToday.day !== 'number') {
        console.error('Invalid Ethiopian date conversion:', ethToday);
        return;
      }
      
      this.currentEthiopianYear = ethToday.year;
      this.selectedMonth = ethToday.month;
      
      this.generateCalendarDays();
      
      // Automatically select today's date
      setTimeout(() => {
        this.selectDate(ethToday.day);
      }, 100);
      
      console.log(`Navigated to today: Ethiopian ${ethToday.day} ${this.getMonthName(ethToday.month)} ${ethToday.year}`);
    } catch (error) {
      console.error('Error navigating to today:', error);
    }
  }

  nextMonth() {
    if (this.selectedMonth && this.selectedMonth < 13) {
      this.selectedMonth++;
      this.generateCalendarDays();
    }
  }

  generateCalendarDays() {
    if (!this.selectedMonth) return;

    const daysInMonth = this.getDaysInEthiopianMonth(this.currentEthiopianYear, this.selectedMonth);
    const firstDayOfMonth = this.getFirstDayOfEthiopianMonth(this.currentEthiopianYear, this.selectedMonth);
    
    // Debug information
    console.log(`\n=== Generating Calendar for ${this.getMonthName(this.selectedMonth)} ${this.currentEthiopianYear} ===`);
    console.log(`Days in month: ${daysInMonth}`);
    console.log(`First day of month: ${this.dayNames[firstDayOfMonth]} (${firstDayOfMonth})`);
    console.log(`Calendar grid will start with ${firstDayOfMonth} empty cells`);
    
    this.calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      this.calendarDays.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      this.calendarDays.push(day);
    }
    
    console.log(`Calendar days array:`, this.calendarDays);
    console.log(`First day (1) will appear at position ${firstDayOfMonth} in the grid`);
    console.log(`This means day 1 falls on ${this.dayNames[firstDayOfMonth]}`);
    console.log('==========================================\n');
  }

  getDaysInEthiopianMonth(year: number, month: number): number {
    if (month === 13) {
      // Pagume: 5 days in normal years, 6 days in leap years
      return this.isEthiopianLeapYear(year) ? 6 : 5;
    }
    return 30; // All other months have 30 days
  }

  isEthiopianLeapYear(year: number): boolean {
    // Ethiopian leap year: every 4 years
    // 2016 Ethiopian year was a leap year
    return year % 4 === 0;
  }

  getFirstDayOfEthiopianMonth(year: number, month: number): number {
    try {
      // Calculate the first day of the month based on where the previous month ended
      // Each month should start where the previous month ended
      
      // Get the day of week for Ethiopian New Year of the given year
      const newYearDayOfWeek = this.getEthiopianNewYearDayOfWeek(year);
      let currentDayOfWeek = newYearDayOfWeek;
      
      console.log(`Ethiopian New Year ${year} starts on:`, currentDayOfWeek, `(${this.dayNames[currentDayOfWeek]})`);
      
      // For each month from Meskerem (1) to the month before our target month
      for (let m = 1; m < month; m++) {
        const daysInMonth = this.getDaysInEthiopianMonth(year, m);
        console.log(`Month ${m} (${this.getMonthName(m)}): ${daysInMonth} days, starts on: ${currentDayOfWeek} (${this.dayNames[currentDayOfWeek]})`);
        
        // Calculate the last day of this month
        const lastDayOfMonth = (currentDayOfWeek + daysInMonth - 1) % 7;
        console.log(`Month ${m} (${this.getMonthName(m)}): ends on: ${lastDayOfMonth} (${this.dayNames[lastDayOfMonth]})`);
        
        // The next month starts on the day after the last day of this month
        currentDayOfWeek = (lastDayOfMonth + 1) % 7;
        console.log(`Next month will start on: ${currentDayOfWeek} (${this.dayNames[currentDayOfWeek]})`);
      }
      
      // For month 1 (Meskerem), the first day is the same as New Year's day
      // For other months, currentDayOfWeek is already calculated as the first day
      let firstDayOfMonth;
      if (month === 1) {
        firstDayOfMonth = currentDayOfWeek; // Meskerem 1 is the same as New Year's day
      } else {
        firstDayOfMonth = currentDayOfWeek; // Already calculated as the first day
      }
      
      console.log(`First day of month ${month} (${this.getMonthName(month)}): ${firstDayOfMonth} (${this.dayNames[firstDayOfMonth]})`);
      
      return firstDayOfMonth;
    } catch (error) {
      console.error(`Error calculating first day for year ${year}, month ${month}:`, error);
      return 0; // Default to Sunday if calculation fails
    }
  }

  getEthiopianNewYearDayOfWeek(year: number): number {
    // Known reference point: Ethiopian year 2018 starts on Thursday (4) - ሐሙስ
    const referenceYear = 2018;
    const referenceDayOfWeek = 4; // Thursday
    
    if (year === referenceYear) {
      return referenceDayOfWeek; // Thursday
    }
    
    // Calculate the difference from the reference year 2018
    const yearDifference = year - referenceYear;
    
    // Calculate total days between the years
    let totalDays = 0;
    
    if (yearDifference > 0) {
      // Going forward from 2018
      for (let y = referenceYear; y < year; y++) {
        totalDays += this.isEthiopianLeapYear(y) ? 366 : 365;
      }
    } else {
      // Going backward from 2018
      for (let y = year; y < referenceYear; y++) {
        totalDays += this.isEthiopianLeapYear(y) ? 366 : 365;
      }
      totalDays = -totalDays; // Make it negative for backward calculation
    }
    
    // Calculate the day of week for the target year
    let newYearDayOfWeek = (referenceDayOfWeek + totalDays) % 7;
    
    // Ensure positive result
    if (newYearDayOfWeek < 0) {
      newYearDayOfWeek += 7;
    }
    
    console.log(`Year ${year}: ${totalDays} days from reference, day of week: ${newYearDayOfWeek} (${this.dayNames[newYearDayOfWeek]})`);
    
    return newYearDayOfWeek;
  }

  getMonthName(month: number): string {
    return this.ethiopianMonths[month - 1];
  }

  selectDate(day: number | null) {
    if (!day || !this.selectedMonth) return;

    try {
      // Convert Ethiopian date to Gregorian
      const gregorianDate = toGC(this.currentEthiopianYear, this.selectedMonth, day);
      
      const selectedDate = new Date(gregorianDate.year, gregorianDate.month - 1, gregorianDate.day);
      
      // Validate the created date
      if (this.isValidDate(selectedDate)) {
        this.dateSelected.emit(selectedDate);
      }
    } catch (error) {
      console.error('Error selecting date:', error);
    }
  }

  isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  isSelected(day: number | null): boolean {
    if (!day || !this.selectedDate || !this.selectedMonth || !this.isValidDate(this.selectedDate)) return false;
    
    try {
      const ethDate = toEC(
        this.selectedDate.getFullYear(), 
        this.selectedDate.getMonth() + 1, 
        this.selectedDate.getDate()
      );
      
      return ethDate.year === this.currentEthiopianYear && 
             ethDate.month === this.selectedMonth && 
             ethDate.day === day;
    } catch (error) {
      return false;
    }
  }

  isToday(day: number | null): boolean {
    if (!day || !this.selectedMonth) return false;
    
    try {
      const today = new Date();
      const ethToday = toEC(today.getFullYear(), today.getMonth() + 1, today.getDate());
      
      const isTodayDate = ethToday.year === this.currentEthiopianYear && 
                         ethToday.month === this.selectedMonth && 
                         ethToday.day === day;
      
      if (isTodayDate) {
        console.log(`Today highlighted: Ethiopian ${day} ${this.getMonthName(this.selectedMonth)} ${this.currentEthiopianYear}`);
      }
      
      return isTodayDate;
    } catch (error) {
      console.error('Error checking if today:', error);
      return false;
    }
  }
}
