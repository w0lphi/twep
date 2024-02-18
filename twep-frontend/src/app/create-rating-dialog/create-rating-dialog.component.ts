import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Ticket } from '../model/ticket';
import { AuthService } from '../service/auth.service';
import { BikeStationService, CreateRating } from '../service/bikeStation.service';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-create-rating-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './create-rating-dialog.component.html',
  styleUrl: './create-rating-dialog.component.scss'
})
export class CreateRatingDialogComponent {
  ratingForm: FormGroup;
  ratingTickets: RatingTicket[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateRatingDialogData,
    private dialog: MatDialogRef<CreateRatingDialogComponent, boolean>,
    private authService: AuthService,
    private bikeStationService: BikeStationService
  ){
    this.ratingForm = new FormGroup({
      ticketId: new FormControl(null,  Validators.required),
      bikeModelRating: new FormControl(1, Validators.required),
      stationRating: new FormControl(1, Validators.required),
      comment: new FormControl(null, Validators.required),
    });

    this.ratingTickets = data.tickets.reduce((tickets: RatingTicket[], ticket) => {
      const modelId: string | undefined = ticket.bike.modelId;
      const modelName: string | undefined = ticket.bike.model;
      const ticketId: string | undefined = ticket.ticketId;
      if(ticketId !== undefined && modelId !== undefined && modelName !== undefined){
        const existing: boolean = tickets.some(t => t.modelId === modelId);
        if(!existing){
          tickets.push({
            modelId,
            ticketId,
            modelName
          })
        }
      }
      return tickets;
    }, [])

  }

  createRating(){
    const userId: string | null = this.authService.getLoggedInUserId();
    if(userId === null || this.ratingForm.invalid) return;
    const ticketId: string = this.ticketId?.value; 
    const bikeModelRating: number = Number(this.bikeModelRating?.value);
    const stationRating: number = Number(this.stationRating?.value);
    const comment : string = DOMPurify.sanitize(this.comment?.value, { ALLOWED_TAGS: ['#text'] });
    const rating: CreateRating = {
      ticketId,
      bikeModelRating,
      stationRating,
      comment
    };

    this.bikeStationService.createRating(userId, rating).subscribe({
      next: (): void => {
        this.closeDialog(true)
      },
    })
  }

  closeDialog(reload: boolean = false){
    this.dialog.close(reload);
  }

  get ratings(): number[]{
    return [1, 2, 3, 4, 5]
  }

  get ticketId(): AbstractControl<any, any> | null{
    return this.ratingForm.get("ticketId");
  }

  get comment(): AbstractControl<any, any> | null{
    return this.ratingForm.get("comment");
  }

  get bikeModelRating(): AbstractControl<any, any> | null{
    return this.ratingForm.get("bikeModelRating");
  }

  get stationRating(): AbstractControl<any, any> | null{
    return this.ratingForm.get("stationRating");
  }
}


export type CreateRatingDialogData = {
  tickets: Ticket[],
  stationName: string,
}

export type RatingTicket = {
  modelId: string,
  ticketId: string,
  modelName: string,
}
