import { Injectable } from "@angular/core";
import { LoginUser } from "../model/loginUser"
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environment";

@Injectable({ providedIn: 'root' })
export class LoginService{
    private apiUrl: string = environment.BASE_URL;

    constructor(private http: HttpClient) {

    }

    public login(loginUser: LoginUser): Observable<Object>{
        return this.http.post(`${this.apiUrl}/login`, loginUser)
    }
}