import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environment";
import { UserAccount } from "../model/user-account"; 

@Injectable({ providedIn: 'root' })
export class AccountService{
    private apiUrl: string = environment.BASE_URL;

    constructor(private http: HttpClient) { }

    public getUserAccount(userId: string): Observable<UserAccount> {
      const url = `${this.apiUrl}/users/${userId}/account`;
      return this.http.get<UserAccount>(url);
  }
}