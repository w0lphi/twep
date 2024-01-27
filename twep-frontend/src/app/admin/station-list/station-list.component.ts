import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { AdminTableComponent } from '../admin-table/admin-table.component';
import { BikeStationService } from '../../service/bikeStation.service';
import { BikeStation } from '../../model/bikeStation';
import { Location } from '../../model/location';


@Component({
  selector: 'app-station-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    AdminTableComponent,
    CommonModule
  ],
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
      error: () => {
        this.runningAction = false;
      }
    })
  }

  createStation(){
    this.router.navigateByUrl("/admin/stations/new");
  }

  openStationDetail(bikeStation: BikeStation) {
    this.router.navigateByUrl(`/admin/stations/${bikeStation.id}`);
  }

  getLocationAsString(bikeStation: BikeStation): string {
    const location: Location = bikeStation.location;
    return `${location.latitude}, ${location.longitude}`;
  }

  get columns(): string[] {
    return [
      'name',
      'location',
      'operational'
    ]
  }
}
