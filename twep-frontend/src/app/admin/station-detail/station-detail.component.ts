import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingOverlayComponent } from '../../common/loading-overlay/loading-overlay.component';
import { BikeStation } from '../../model/bikeStation';
import { BikeStationService } from '../../service/bikeStation.service';
import { Location } from '../../model/location';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletUtil } from '../../util/leaflet-util'
import * as Leaflet from 'leaflet';
import { ParkingPlace } from '../../model/parkingPlace';
import { BikeCategory } from '../../model/bikeCategory';

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
    LeafletModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSelectModule
  ],
  templateUrl: './station-detail.component.html',
  styleUrl: './station-detail.component.scss'
})
export class StationDetailComponent {
  runningAction: boolean = false;
  stationId?: string;
  bikeStationForm: FormGroup;
  bikeStationName: string = "";
  bikeStation?: BikeStation;
  bikeCategories: BikeCategory[] = [];
  parkingPlaces: ParkingPlace[] = [];
  options: Leaflet.MapOptions = {};
  layers: Leaflet.Layer[] = [];


  @Input()
  set id(stationId: string) {
    this.stationId = encodeURIComponent(stationId);
    this.loadStation();
  }

  constructor(
    private bikeStationService: BikeStationService,
    private router: Router
  ) {

    this.bikeStationForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      latitude: new FormControl(null, Validators.required),
      longitude: new FormControl(null, Validators.required),
      operational: new FormControl(false, Validators.required),
    });

    this.bikeCategories = [
      new BikeCategory("1", "City Bike"),
      new BikeCategory("2", "Mountain Bike"),
      new BikeCategory("3", "Electric Bike"),
    ]
  }

  ngOnInit(): void {
    this.options = LeafletUtil.mapOptions;
  }

  loadStation(): void{
    this.runningAction = true;
    if (this.stationId === null || this.stationId === undefined) {
      return; 
    }
    if(this.stationId === "new"){
      this.bikeStation = new BikeStation("", "", new Location(0, 0));
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

  updateStation(): void {
    if (this.bikeStationForm.invalid) return;
    this.runningAction = true;
    if (this.bikeStation === undefined) return;
    const bikeStation: BikeStation = this.bikeStation;
    bikeStation.location = new Location(this.latitude?.value, this.longitude?.value);
    bikeStation.name = this.name?.value;
    bikeStation.operational = this.operational?.value;
    bikeStation.parkingPlaces = this.parkingPlaces;
    console.log("Updated station", bikeStation);

    if (this.stationId === "new") {
      this.bikeStationService.createBikeStation(bikeStation).subscribe({
        next: () => {
          this.runningAction = false;
          return;
        },
        error: () => {
          this.runningAction = false;
        }
      })
    } else {
      this.bikeStationService.updateBikeStation(bikeStation).subscribe({
        next: () => {
          this.runningAction = false;
          return;
        },
        error: () => {
          this.runningAction = false;
        }
      })
    }
  }

  deleteStation() {
    if (this.bikeStation?.id === undefined) return;
    this.runningAction = true;
    this.bikeStationService.deleteBikeStation(this.bikeStation?.id).subscribe({
      next: () => {
        this.runningAction = false;
        return;
      },
      error: () => {
        this.runningAction = false;
      }
    });
  }

  updateForm(bikeStation: BikeStation): void {
    this.bikeStationForm.patchValue({
      id: bikeStation.id,
      name: bikeStation.name,
      longitude: bikeStation.location?.longitude,
      latitude: bikeStation.location?.longitude,
      operational: bikeStation.operational,
    })
    this.parkingPlaces = this.bikeStation?.parkingPlaces ?? [];
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

  addParkingPlace(): void {
    this.parkingPlaces.push(new ParkingPlace("", []))
  }

  removeParkingPlace(index: number): void{
    this.parkingPlaces.splice(index, 1);
  }

  goBackToOverview(): void {
    this.router.navigateByUrl("/admin/stations");
  }

  updateCategories(parkingPlace: ParkingPlace, event: MatSelectChange): void {
    parkingPlace.bikeCategories = event.value
  }

  get name(): AbstractControl<any, any> | null {
    return this.bikeStationForm.get('name');
  }

  get operational(): AbstractControl<any, any> | null {
    return this.bikeStationForm.get('operational');
  }

  get longitude(): AbstractControl<any, any> | null {
    return this.bikeStationForm.get('longitude');
  }

  get latitude(): AbstractControl<any, any> | null {
    return this.bikeStationForm.get('latitude');
  }

  get parkingPlaceColumns(): string[]{
    return [
      "id",
      "categories"
    ]
  }

}
