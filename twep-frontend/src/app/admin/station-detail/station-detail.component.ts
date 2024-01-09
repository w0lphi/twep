import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { LoadingOverlayComponent } from '../../common/loading-overlay/loading-overlay.component';
import { BikeStation } from '../../model/bikeStation';
import { BikeStationService } from '../../service/bikeStation.service';
import { Location } from '../../model/location';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletUtil } from '../../util/leaflet-util'
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-station-detail',
  standalone: true,
  imports: [
    LoadingOverlayComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    LeafletModule
  ],
  templateUrl: './station-detail.component.html',
  styleUrl: './station-detail.component.scss'
})
export class StationDetailComponent {
  runningAction: boolean = false;
  stationId?: string;
  bikeStationForm: FormGroup;
  bikeStationName: string = "";
  bikeStation: BikeStation = new BikeStation("", "");
  options: Leaflet.MapOptions = {};
  layers: Leaflet.Layer[] = [];

  @Input()
  set id(stationId: string) {
    this.stationId = encodeURIComponent(stationId);
    this.loadStation();
  }

  constructor(
    private bikeStationService: BikeStationService
  ) {
    this.bikeStationForm = new FormGroup({
      id: new FormControl(this.bikeStation?.id),
      name: new FormControl(this.bikeStation?.name, Validators.required),
      latitude: new FormControl(this.bikeStation?.location?.latitude, Validators.required),
      longitude: new FormControl(this.bikeStation?.location?.longitude, Validators.required),
      address: new FormControl(this.bikeStation?.address),
      operational: new FormControl(this.bikeStation?.operational, Validators.required),
    })
  }

  ngOnInit() {
    this.options = LeafletUtil.mapOptions;
  }

  loadStation(): void{
    this.runningAction = true;
    if (this.stationId === null || this.stationId === undefined) {
      return; 
    }
    if(this.stationId === "new"){
      this.bikeStation = new BikeStation("", "");
      this.bikeStationName = "New station"
      this.runningAction = false;
    }else{
      this.bikeStationService.getBikeStation(this.stationId).subscribe({
        next: (bikeStation: BikeStation) => {
          this.bikeStation = bikeStation;
          this.bikeStationName = this.bikeStation.name;
          this.updateForm(bikeStation);
          if (this.bikeStation?.location !== undefined) {
            this.setMarker(this.bikeStation.location)
          }
          this.runningAction = false;
        },
        error: (error: any) => {
          console.error(error);
          this.runningAction = false;
          //TODO: Handle error
        } 
      })
    }
  }

  updateForm(bikeStation: BikeStation) {
    this.bikeStationForm.patchValue({
      id: bikeStation.id,
      name: bikeStation.name,
      address: bikeStation.address,
      longitude: bikeStation.location?.longitude,
      latitude: bikeStation.location?.longitude,
      operational: bikeStation.operational,
    })
  }

  setStationLocation(event: Leaflet.LeafletMouseEvent): void {
    const latitude: number = event.latlng.lat;
    const longitude: number = event.latlng.lng;
    this.bikeStationForm.patchValue({ longitude, latitude })
    this.setMarker(new Location(latitude, longitude));
  }

  setMarker(location: Location): void{
    const marker: Leaflet.Marker<any> = LeafletUtil.getStationMarker(location.latitude, location.longitude)
    this.layers = [marker];
  }

  get longitude(): AbstractControl<any, any> | null {
    return this.bikeStationForm.get('longitude');
  }

  get latitude(): AbstractControl<any, any> | null {
    return this.bikeStationForm.get('latitude');
  }


}
