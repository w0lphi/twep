import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';

import { BikeCardComponent } from '../bike-card/bike-card.component';
import { BikeService } from '../service/bike.service';
import { Bike } from '../model/bike';
import { BikeModel } from '../model/bikeModel';
import { BikeCategory } from '../model/bikeCategory';
import { BikeModelService } from '../service/bikeModel.service';
import { BikeCategoryService } from '../service/bikeCategory.service';
import { LoadingOverlayComponent } from '../common/loading-overlay/loading-overlay.component';
import { BikeStationService } from '../service/bikeStation.service';
import { BikeStation } from '../model/bikeStation';

@Component({
  selector: 'app-bike-filter-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BikeCardComponent,
    LoadingOverlayComponent,
    MatExpansionModule,
    MatIconModule,
    MatDividerModule,
    MatSliderModule,
    MatSelectModule,
    MatFormFieldModule,
    MatToolbarModule
  ],
  templateUrl: './bike-filter-list.component.html',
  styleUrl: './bike-filter-list.component.scss'
})
export class BikeFilterListComponent {
  bikes: Bike[] = [];
  bikeModels: BikeModel[] = [];
  bikeCategories: BikeCategory[] = [];
  bikeStations: BikeStation[] = [];
  runningAction: boolean = false;

  bikeModelFilter: string[] = [];
  bikeCategoryFilter: string[] = [];
  bikeStationFilter: string[] = [];
  bikeWheelSizeFilter: BikeWheelSizeFilter = {
    from: 1,
    to: 35,
  }

  bikeWheelSizeMin: number = 1;
  bikeWheelSizeMax: number = 35;

  constructor(
    private bikeService: BikeService,
    private bikeModelService: BikeModelService,
    private bikeCategoryService: BikeCategoryService,
    private bikeStationService: BikeStationService,
  ){
    this.getBikes();
    this.getBikeModels();
    this.getBikeCategories();
    this.getBikeStations();
  }

  getBikes(): void{
    this.runningAction = true;
    this.bikeService.getAllUserBikes().subscribe({
      next: (bikes: Bike[]): void => {
        this.bikes = bikes;
        this.runningAction = false;
      },
      error: () => {
        this.runningAction = false;
      }
    })
  }

  getBikeModels(): void{
    this.bikeModelService.getAllUserBikeModels().subscribe({
      next: (bikeModels: BikeModel[]): void => {
        this.bikeModels = bikeModels;
      }
    })
  }

  getBikeCategories(): void{
    this.bikeCategoryService.getAllUserBikeCategories().subscribe({
      next: (bikeCategories: BikeCategory[]): void => {
        this.bikeCategories = bikeCategories;
      }
    })
  }

  getBikeStations(): void {
    this.bikeStationService.getBikeStationsForUser().subscribe({
      next: (bikeStations: BikeStation[]): void => {
        this.bikeStations = bikeStations;
      }
    })
  }

  get filteredBikes(): Bike[] {
    return this.bikes.filter(bike => {
      const isInBikeStation = this.bikeStationFilter.length === 0 || (bike.station?.id !== undefined && this.bikeStationFilter.includes(bike.station.id));
      const hasBikeCategory = this.bikeCategoryFilter.length === 0 || (bike.categoryId !== undefined && this.bikeCategoryFilter.includes(bike.categoryId));
      const hasBikeModel = this.bikeModelFilter.length === 0 || (bike.modelId !== undefined && this.bikeModelFilter.includes(bike.modelId));
      const hasWheelSize = bike.wheelSize === undefined || (bike.wheelSize >= this.bikeWheelSizeFilter.from && bike.wheelSize <= this.bikeWheelSizeFilter.to);
      return isInBikeStation && hasBikeCategory && hasBikeModel && hasWheelSize;
    });
    /*
    .reduce((stations: BikeGroup[], bike: Bike) => {
      console.log(stations, bike)
      const stationId: string | undefined = bike.station?.id;
      if(stationId === undefined) return stations;
      let station: BikeGroup | undefined = stations.find(({id}) => id === stationId); 
      if(station !== undefined){
        if(!Array.isArray(station.bikes)) station.bikes = [];
        station.bikes.push(bike);
      }else{
        station = {
          id: stationId,
          name: bike.station?.name ?? stationId,
          bikes: [bike]
        };
        stations.push(station);
      }
      return stations;
    }, []);

    return bikeGroups;
    */
  }
}

export interface BikeGroup{
  id: string;
  name: string;
  bikes: Bike[];
}

export interface BikeWheelSizeFilter{
  from: number;
  to: number;
}
