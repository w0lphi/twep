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
  runningAction: boolean = false;
  bikeStation?: BikeStation;
  bikes: Bike[] = [];
  bikeModels: BikeModel[] = [];
  ratings: BikeStationRating[] = [];
  bikePanelExpanded: boolean = true;
  ratingsPanelExpanded: boolean = false;

  @Input("stationId")
  set stationId(stationId: string) {
    this.getBikeStation(stationId);
    this.loadBikes(stationId);
    this.getRatings(stationId);
  }

  constructor(
    private bikeStationService: BikeStationService,
    private bikeService: BikeService,
    private changeDetector: ChangeDetectorRef
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
    return avg;
  }

  get avgRatingFormatted(): string {
    return new Intl.NumberFormat("en-GB", {
      maximumSignificantDigits: 2
    }).format(this.averageRating)
  }
}
