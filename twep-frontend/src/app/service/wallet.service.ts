import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl: string = environment.BASE_URL;

  constructor(private http: HttpClient) { }

  public addMoneyToWallet(userId: number, amount: number): Observable<any> {
    const requestBody = { amount: amount };
    return this.http.post(`${this.apiUrl}/users/${userId}/account`, requestBody);
  }

  public removeMoneyFromWallet(userId: number, amount: number): Observable<any> {
    const requestBody = { amount: amount };
    return this.http.post(`${this.apiUrl}/users/${userId}/account`, requestBody);
  }


  public getWalletStatus(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}/account`);
  }
}
