import { Injectable } from "@angular/core";
import { LoginUser } from "../model/loginUser"
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environment";
import { BikeStation } from "../model/bikeStation";

@Injectable({ providedIn: 'root' })
export class BikeStationService{
    private apiUrl: string = environment.BASE_URL;

    constructor(private http: HttpClient) { }

    public getBikeStations(): Observable<BikeStation[]>{
        return this.http.get<BikeStation[]>(`${this.apiUrl}/stations`);
    }
}