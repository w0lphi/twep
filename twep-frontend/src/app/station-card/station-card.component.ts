import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BikeStation } from '../model/bikeStation';

import { LoadingOverlayComponent } from '../common/loading-overlay/loading-overlay.component';
import { BikeStationService } from '../service/bikeStation.service';
import { Bike } from '../model/bike';
import { BikeService } from '../service/bike.service';
import { BikeModelService } from '../service/bikeModel.service';
import { BikeModel } from '../model/bikeModel';

import { BikeCardComponent } from '../bike-card/bike-card.component';

@Component({
  selector: 'app-station-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    LoadingOverlayComponent,
    BikeCardComponent,
  ],
  templateUrl: './station-card.component.html',
  styleUrl: './station-card.component.scss'
})
export class StationCardComponent {
  runningAction: boolean = false;
  bikeStation?: BikeStation;
  bikes?: Bike[];
  bikeModels?: BikeModel[];

  @Input("stationId")
  set stationId(stationId: string) {
    this.getBikeStation(stationId);
    this.loadBikeModels();
    this.loadBikes();
  }

  constructor(
    private bikeStationService: BikeStationService,
    private bikeService: BikeService,
    private bikeModelService: BikeModelService,
    private changeDetector: ChangeDetectorRef
  ) { 
  }
  
  getBikeStation(stationId: string): void {
    this.runningAction = true;
    this.bikeStationService.getBikeStation(stationId).subscribe({
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

  loadBikes(): void {
    //TODO: Load bikes of station
    this.runningAction = true;
    this.bikeService.getBikes().subscribe({
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

  loadBikeModels(): void{
    this.runningAction = true;
    this.bikeModelService.getBikeModels().subscribe({
      next: (bikeModels: BikeModel[]): void => {
        this.bikeModels = bikeModels;
        this.runningAction = false;
        this.changeDetector.detectChanges();
      },
      error: (): void => {
        this.runningAction = false;
        this.changeDetector.detectChanges();
      }
    })
  }

  get displayedBikes(): Bike[]{
    if (!Array.isArray(this.bikes)) return [];
    return this.bikes?.map(bike => {
      const bikeModel: BikeModel | undefined = this.bikeModels?.find(model => model.id === bike.bikeModelId);
      bike.bikeModel = bikeModel;
      console.log(bikeModel);
      return bike;
    })
  }
}
