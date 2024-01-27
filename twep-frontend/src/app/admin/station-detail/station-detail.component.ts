import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingOverlayComponent } from '../../common/loading-overlay/loading-overlay.component';
import { BikeStation } from '../../model/bikeStation';
import { BikeStationService } from '../../service/bikeStation.service';
import { BikeCategoryService } from '../../service/bikeCategory.service';
import { DialogService } from '../../service/dialog.service';
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
  map?: Leaflet.Map;

  @Input()
  set id(stationId: string) {
    this.stationId = encodeURIComponent(stationId);
    this.loadStation();
  }

  constructor(
    private bikeStationService: BikeStationService,
    private bikeCategoryService: BikeCategoryService,
    private dialogService: DialogService,
    private router: Router,
  ) {

    this.bikeStationForm = new FormGroup({
      id: new FormControl({value: null, disabled: true}),
      name: new FormControl(null, Validators.required),
      latitude: new FormControl(null, Validators.required),
      longitude: new FormControl(null, Validators.required),
      operational: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.options = LeafletUtil.mapOptions;
    this.loadCategories();
  }

  onMapReady(map: Leaflet.Map): void {
    this.map = map;
    if (!this.isNew && this.bikeStation?.location !== undefined) {
      //Go to the bike station location
      const location: Location = this.bikeStation.location;
      this.map?.setView(new Leaflet.LatLng(location.latitude, location.longitude), 17);
    }
  }

  loadCategories(): void{
    this.bikeCategoryService.getBikeCategories().subscribe({
      next: (bikeCategories: BikeCategory[]): void => {
        this.bikeCategories = bikeCategories;
      }
    })
  }

  loadStation(): void{
    if (this.stationId === null || this.stationId === undefined) {
      return; 
    }
    if(this.isNew){
      this.bikeStation = new BikeStation("", "", new Location(0, 0));
      this.bikeStationName = "New station"
    } else {
      this.runningAction = true;
      this.bikeStationService.getBikeStation(this.stationId).subscribe({
        next: (bikeStation: BikeStation): void => {
          //Bike station successfully loaded
          this.bikeStation = bikeStation;
          this.bikeStationName = this.bikeStation.name;
          this.updateForm(bikeStation);
          if (this.bikeStation?.location !== undefined) {
            this.setMarker(this.bikeStation.location);
          }
          this.runningAction = false;
        },
        error: (): void => {
          this.runningAction = false;
        } 
      })
    }
  }

  updateStation(): void {
    if (this.bikeStationForm.invalid || this.bikeStation === undefined) return;
    this.runningAction = true;
    const bikeStation: BikeStation = this.bikeStation;
    bikeStation.location = new Location(this.latitude?.value, this.longitude?.value);
    bikeStation.name = this.name?.value;
    bikeStation.operational = this.operational?.value;
    bikeStation.parkingPlaces = this.parkingPlaces;

    if (this.isNew) {
      this.bikeStationService.createBikeStation(bikeStation).subscribe({
        next: (response: any): void => {
          const id: string = response?.id;
          if(id !== undefined && id !== null && id !== ""){
            this.router.navigateByUrl(`/admin/stations/${id}`);
          }else{
            this.router.navigateByUrl("/admin/stations");
          }
        },
        error: (): void => {
          this.runningAction = false;
        }
      })
    } else {
      this.bikeStationService.updateBikeStation(bikeStation).subscribe({
        next: (): void => {
          this.runningAction = false;
        },
        error: (): void => {
          this.runningAction = false;
        }
      })
    }
  }

  async deleteStation(): Promise<void> {
    if (this.bikeStation?.id === undefined) return;

    const confirmed: boolean = await this.dialogService.openConfirmDialog(
      "Delete station?",
      "Do you really want to delete the station? This cannot be undone!"
    )

    if(!confirmed) return;

    this.runningAction = true;
    this.bikeStationService.deleteBikeStation(this.bikeStation?.id).subscribe({
      next: (): void => {
        this.runningAction = false;
        this.router.navigateByUrl("/admin/stations");
        return;
      },
      error: (): void => {
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
    const latitude: number = Number(event.latlng.lat.toPrecision(7));
    const longitude: number = Number(event.latlng.lng.toPrecision(7));
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
    parkingPlace.bike_categories = event.value
  }

  get isNew(): boolean{
    return this.stationId === "new";
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
}
