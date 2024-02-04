import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletUtil } from '../util/leaflet-util'
import * as Leaflet from 'leaflet';
import { BikeStationService } from '../service/bikeStation.service';
import { BikeStation } from '../model/bikeStation';
import { Location } from '../model/location';

@Component({
  selector: 'app-userhome',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    LeafletModule,
  ],
  templateUrl: './userhome.component.html',
  styleUrl: './userhome.component.scss'
})
export class UserhomeComponent {
  layers: Leaflet.Layer[] = [];
  bikeStations: BikeStation[] = [];
  displayedBikeStation: BikeStation | null;
  showDetail: boolean = false;
  map?: Leaflet.Map;
  mapOptions: Leaflet.MapOptions = LeafletUtil.mapOptions;

  constructor(
    private bikeStationService: BikeStationService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.displayedBikeStation = null;
    this.loadStations();
  }

  onMapReady(map: Leaflet.Map): void {
    this.map = map;
  }

  loadStations(): void {
    this.bikeStationService.getBikeStations().subscribe({
      next: ({ stations }): void => {
        this.bikeStations = stations;
        this.layers = stations.map((station) => {
          const latitude: number = station.location.latitude;
          const longitude: number = station.location.longitude;
          const marker: Leaflet.Marker<any> = LeafletUtil.getStationMarker(latitude, longitude)
          marker.addEventListener('click', () => this.openDetail(station));
          return marker;
        })
      }
    })
  }

  openDetail(bikeStation: BikeStation): void{
    this.displayedBikeStation = bikeStation;
    //This is needed, since the change of the displayedBikeStation would not be recognized in the HTML
    this.changeDetector.detectChanges();
    const location: Location = bikeStation.location;
    this.map?.flyTo(new Leaflet.LatLng(location.latitude, location.longitude), 17);
  }

  closeDetail() {
    this.displayedBikeStation = null;
    this.changeDetector.detectChanges();
  }
}
