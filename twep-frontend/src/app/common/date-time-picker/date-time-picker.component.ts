import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { formatISO, format } from "date-fns"; 

@Component({
  selector: 'app-date-time-picker',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './date-time-picker.component.html',
  styleUrl: './date-time-picker.component.scss'
})
export class DateTimePickerComponent {
  @Input() datetime: Date | null = new Date(Date.now());
  @Output() datetimeChange = new EventEmitter<Date | null>();

  date: string;
  time: string;
  timezoneOffset: number;

  constructor(){
    const datetime: Date = this.datetime !== null ? this.datetime : new Date(Date.now());
    this.date = formatISO(datetime, { representation: 'date' });
    this.time = format(datetime, 'HH:mm');
    this.timezoneOffset = datetime.getTimezoneOffset();
  }

  updateDate(): void {
    if (!this.time || !this.date) {
      this.datetimeChange.emit(null);
      return;
    };
    const date: Date = new Date(this.date);
    const timeParts: string[] = this.time.split(":");
    const hours: number = Number(timeParts[0]);
    const minutes: number = Number(timeParts[1]);
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setTime(date.getTime() + (this.timezoneOffset * 60 * 1000))
    this.datetimeChange.emit(date);
  }



}
