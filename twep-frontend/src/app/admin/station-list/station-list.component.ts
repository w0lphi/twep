import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { BikeStationService } from '../../service/bikeStation.service';
import { BikeStation } from '../../model/bikeStation';


@Component({
  selector: 'app-station-list',
  standalone: true,
  imports: [MatTableModule, MatToolbarModule, MatButtonModule],
  templateUrl: './station-list.component.html',
  styleUrl: './station-list.component.scss'
})
export class StationListComponent {
  bikeStations: BikeStation[] = [];


  constructor(private bikeStationService: BikeStationService) {
    this.getBikeStations();
  }

  getBikeStations() {
    this.bikeStationService.getBikeStations().subscribe({
      next: (bikeStations: BikeStation[]): void => {
        this.bikeStations = bikeStations;
      },
      error: (error: any) => {
        //TODO: Handle error
      }
    })
  }

  get columns(): string[] {
    return [
      'id',
      'name',
      'location',
    ]
  }
}
