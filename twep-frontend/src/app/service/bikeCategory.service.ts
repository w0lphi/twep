import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environment";
import { BikeCategory } from "../model/bikeCategory";

@Injectable({ providedIn: 'root' })
export class BikeCategoryService{
    private apiUrl: string = environment.BASE_URL;

    constructor(private http: HttpClient) { }

    public getBikeCategories(): Observable<BikeCategory[]>{
        return this.http.get<BikeCategory[]>(`${this.apiUrl}/management/bike-categories`);
    }

    public createBikeCategory(bikeCategory: BikeCategory): Observable<any>{
        return this.http.post(`${this.apiUrl}/management/bike-categories`, bikeCategory);
    }

    public updateBikeCategory(bikeCategory: BikeCategory): Observable<any>{
        return this.http.put(`${this.apiUrl}/management/bike-categories/${bikeCategory.id}`, bikeCategory);
    }

    public deleteBikeCategory(id: string): Observable<any>{
        return this.http.delete(`${this.apiUrl}/management/bike-categories/${id}`);
    }

}