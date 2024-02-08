import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DateTimePickerComponent } from '../common/date-time-picker/date-time-picker.component';
import { Bike } from '../model/bike';
import { BikeModel } from '../model/bikeModel';

export interface BikeRentDialogData{
  bike: Bike;
}

@Component({
  selector: 'app-bike-rent-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    DateTimePickerComponent
  ],
  templateUrl: './bike-rent-dialog.component.html',
  styleUrl: './bike-rent-dialog.component.scss'
})
export class BikeRentDialogComponent {

  bike: Bike;
  bookingStart: Date | null;
  bookingEnd: Date | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BikeRentDialogData,
  ) {
    this.bike = this.data.bike;
    this.bookingStart = new Date(Date.now());
    this.bookingEnd = new Date(Date.now());
  }

  get title(): string{
    return `Rent bike ${this.bike?.model}`
  }

}