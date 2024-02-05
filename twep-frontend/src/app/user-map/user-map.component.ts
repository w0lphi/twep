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
import { NotificationService } from '../service/notification.service';

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
    private changeDetector: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {
    this.displayedBikeStation = null;
    this.loadStations();
    this.getUserPosition();
  }

  onMapReady(map: Leaflet.Map): void {
    this.map = map;
  }

  getUserPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude: number = position.coords.latitude;
      const longitude: number = position.coords.longitude;
      const userMarker: Leaflet.Marker<any> = LeafletUtil.getUserMarker(latitude, longitude);
      userMarker.bindPopup("You are here");
      this.layers.push(userMarker);
      this.map?.setView(new Leaflet.LatLng(latitude, longitude), 14);
    }, () => {
      this.notificationService.showClientError("Could not get user position");
    });
  }

  loadStations(): void {
    this.bikeStationService.getBikeStations().subscribe({
      next: ({ stations }): void => {
        this.bikeStations = stations.filter(({operational}) => operational);
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
    setTimeout(() => this.map?.invalidateSize(true), 100);
    const location: Location = bikeStation.location;
    this.map?.flyTo(new Leaflet.LatLng(location.latitude, location.longitude), 17);
    this.displayedBikeStation = bikeStation;
    //This is needed, since the change of the displayedBikeStation would not be recognized in the HTML
    this.changeDetector.detectChanges();
  }

  closeDetail() {
    setTimeout(() => this.map?.invalidateSize(true), 100);
    this.displayedBikeStation = null;
    this.changeDetector.detectChanges();
  }

}
