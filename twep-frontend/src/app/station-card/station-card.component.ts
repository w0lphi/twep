import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

import { BikeStation } from '../model/bikeStation';
import { LoadingOverlayComponent } from '../common/loading-overlay/loading-overlay.component';
import { BikeStationRating, BikeStationService } from '../service/bikeStation.service';
import { Bike } from '../model/bike';
import { BikeService } from '../service/bike.service';
import { BikeModel } from '../model/bikeModel';

import { BikeCardComponent } from '../bike-card/bike-card.component';
import { RatingCardComponent } from '../rating-card/rating-card.component';
import { Ticket, TicketStatus } from '../model/ticket';
import { AuthService } from '../service/auth.service';
import { TicketService } from '../service/tickets.service';
import { DialogService } from '../service/dialog.service';

@Component({
  selector: 'app-station-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    LoadingOverlayComponent,
    BikeCardComponent,
    RatingCardComponent
  ],
  templateUrl: './station-card.component.html',
  styleUrl: './station-card.component.scss'
})
export class StationCardComponent {
  @Input() stationName!: string;
  runningAction: boolean = false;
  bikeStation?: BikeStation;
  bikes: Bike[] = [];
  bikeModels: BikeModel[] = [];
  ratings: BikeStationRating[] = [];
  rentedUserTickets: Ticket[] = [];
  bikePanelExpanded: boolean = true;
  ratingsPanelExpanded: boolean = false;
  _stationId!: string;

  @Input("stationId")
  set stationId(stationId: string) {
    this.getBikeStation(stationId);
    this.loadBikes(stationId);
    this.getRatings(stationId);
    this.getUserTickets(stationId);
    this._stationId = stationId;
  }

  constructor(
    private bikeStationService: BikeStationService,
    private bikeService: BikeService,
    private changeDetector: ChangeDetectorRef,
    private authService: AuthService,
    private ticketService: TicketService,
    private dialogService: DialogService,
  ) { 
  }
  
  getBikeStation(stationId: string): void {
    this.runningAction = true;
    this.bikeStationService.getBikeStationForUser(stationId).subscribe({
      next: (bikeStation: BikeStation): void => {
        this.bikeStation = bikeStation;
        this.runningAction = false;
        this.changeDetector.detectChanges();
      },
      error: (): void => {
        this.runningAction = false;
        this.changeDetector.detectChanges();
      }
    })
  }

  loadBikes(stationId: string): void {
    this.runningAction = true;
    this.bikeService.getBikesForStation(stationId).subscribe({
      next: (bikes: Bike[]): void => {
        this.bikes = bikes;
        this.runningAction = false;
        this.changeDetector.detectChanges();
      },
      error: (): void => {
        this.runningAction = false;
        this.changeDetector.detectChanges();
      }
    })
  }

  getRatings(stationId: string): void {
    this.runningAction = true;
    this.bikeStationService.getBikeStationRatings(stationId).subscribe({
      next: (ratings: BikeStationRating[]) => {
        this.ratings = ratings;
        this.runningAction = false;
      },
      error: () => {
        this.runningAction = false;
      }
    })
  }

  getUserTickets(stationId: string): void{
    const userId: string | null = this.authService.getLoggedInUserId();
    if(userId !== null){
      this.ticketService.getUserTickets(userId).subscribe({
        next: (tickets: Ticket[]) => {
          this.rentedUserTickets = tickets.filter(ticket => {
            const bike: Bike = ticket.bike;
            return bike.station?.id === stationId && ticket.status === TicketStatus.RETURNED;
          });
        }
      });
    }
  }

  createRating(){
    this.dialogService.openCreateRatingDialog({
      tickets: this.rentedUserTickets,
      stationName: this.stationName,
    }).subscribe({
      next: (reload: boolean | undefined) => {
        if(reload) this.getRatings(this._stationId);
      }
    });
  }

  handleExpansionPanel() {
    this.changeDetector.detectChanges();
  }

  get displayedBikes(): Bike[]{
    if (this.bikes === undefined || !Array.isArray(this.bikes)) {
      return [];
    }
    return this.bikes;
  }

  get ratingStars(): string[] {
    return  Array.from('*'.repeat(Math.round(this.averageRating)))
  }

  get averageRating(): number {
    const sum: number = this.ratings.reduce((sum, {stationRating}) => sum + stationRating, 0);
    const avg = sum / this.ratings.length;
    return Math.round(avg * 100) / 100;
  }

  get avgRatingFormatted(): string {
    return new Intl.NumberFormat("en-GB", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(this.averageRating)
  }
}
