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
import { LoadingOverlayComponent } from '../common/loading-overlay/loading-overlay.component';
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
    StationCardComponent,
    LoadingOverlayComponent
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
  runningAction: boolean = false;
  userLocation?: Location;

  constructor(
    private bikeStationService: BikeStationService,
    private changeDetector: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {
    this.runningAction = true;
    this.displayedBikeStation = null;
    this.loadStations();
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude: number = position.coords.latitude;
      const longitude: number = position.coords.longitude;
      this.userLocation = new Location(latitude, longitude);
      this.runningAction = false;
    }, () => {
      this.runningAction = false;
      this.notificationService.showClientError("Could not get user position");
    });
  }

  onMapReady(map: Leaflet.Map): void {
    this.map = map;
    setTimeout(() => map.invalidateSize(), 0);
    if (this.userLocation !== undefined) {
      const latitude: number = this.userLocation.latitude;
      const longitude: number = this.userLocation.longitude;
      const userMarker: Leaflet.Marker<any> = LeafletUtil.getUserMarker(latitude, longitude);
      userMarker.bindPopup("You are here");
      this.layers.push(userMarker);
      map.setView(new Leaflet.LatLng(latitude, longitude), 14);
    }
  }

  loadStations(): void {
    this.bikeStationService.getBikeStationsForUser().subscribe({
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

  get stationDetailTitle(): string {
    return this.displayedBikeStation?.name ?? "";
  }

  get stationDetailSubtitle(): string{
    const information: string[] = ["Bike Station"];
    if (this.userLocation !== undefined && this.displayedBikeStation?.location !== undefined) {
      const distanceToStation: string = LeafletUtil.getDistance(this.userLocation, this.displayedBikeStation.location);
      information.push(`${distanceToStation} km away`);
    }
    return information.join(", ");
  }
}
