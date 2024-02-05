import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule} from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletUtil } from '../util/leaflet-util'
import * as Leaflet from 'leaflet';
import { BikeStationService } from '../service/bikeStation.service';
import { BikeStation } from '../model/bikeStation';
import { Location } from '../model/location';

import { StationCardComponent } from '../station-card/station-card.component';

@Component({
  selector: 'app-user-map',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    LeafletModule,
    StationCardComponent
  ],
  templateUrl: './user-map.component.html',
  styleUrl: './user-map.component.scss'
})
export class UserMapComponent {
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
    const location: Location = bikeStation.location;
    this.map?.flyTo(new Leaflet.LatLng(location.latitude, location.longitude), 17);
    this.displayedBikeStation = bikeStation;
    //This is needed, since the change of the displayedBikeStation would not be recognized in the HTML
    this.changeDetector.detectChanges();
  }

  closeDetail() {
    this.displayedBikeStation = null;
    this.changeDetector.detectChanges();
  }

}
