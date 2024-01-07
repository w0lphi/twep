import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { LoadingOverlayComponent } from '../../common/loading-overlay/loading-overlay.component';
import { BikeStationService } from '../../service/bikeStation.service';
import { BikeStation } from '../../model/bikeStation';


@Component({
  selector: 'app-station-list',
  standalone: true,
  imports: [MatTableModule, MatToolbarModule, MatButtonModule, LoadingOverlayComponent, CommonModule],
  templateUrl: './station-list.component.html',
  styleUrl: './station-list.component.scss'
})
export class StationListComponent {
  runningAction: boolean = true;
  bikeStations: BikeStation[] = [];

  constructor(
    private bikeStationService: BikeStationService,
    private router: Router
  ) {
    this.getBikeStations();
  }

  getBikeStations() {
    this.bikeStationService.getBikeStations().subscribe({
      next: (bikeStations: BikeStation[]): void => {
        this.bikeStations = bikeStations;
        this.runningAction = false;
      },
      error: (error: any) => {
        this.runningAction = false;
        //TODO: Handle error
      }
    })
  }

  createStation(){
    this.router.navigateByUrl("/admin/stations/new");
  }

  get columns(): string[] {
    return [
      'id',
      'name',
      'location',
    ]
  }
}
