import { Injectable } from "@angular/core";
import { LoginUser } from "../model/loginUser"
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environment";

@Injectable({ providedIn: 'root' })
export class AuthService{
    private apiUrl: string = environment.BASE_URL;
    private storageKey: string = environment.TOKEN_KEY;

    constructor(private http: HttpClient) { }

    public login(loginUser: LoginUser): Observable<Object>{
        return this.http.post(`${this.apiUrl}/users/login`, loginUser)
    }

    public setSession(token: string): void {
        localStorage.setItem(this.storageKey, token);
    }

    public logout() {
        localStorage.removeItem(this.storageKey);
    }

    public isLoggedIn() {
        const token: string | null = localStorage.getItem(this.storageKey);
        return token !== null && token !== undefined;
    }
}