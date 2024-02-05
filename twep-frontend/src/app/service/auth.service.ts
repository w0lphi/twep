import { Injectable } from "@angular/core";
import { LoginUser } from "../model/loginUser"
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environment";
import { jwtDecode } from "jwt-decode";
import { JwtToken } from "../model/jwtToken";

@Injectable({ providedIn: 'root' })
export class AuthService{
    private apiUrl: string = environment.BASE_URL;
    private storageKey: string = environment.TOKEN_KEY;

    constructor(private http: HttpClient) { }

    public login(loginUser: LoginUser): Observable<Object>{
        return this.http.post(`${this.apiUrl}/users/login`, loginUser)
    }

    public setSession(token: string): void {
        this.logout();
        localStorage.setItem(this.storageKey, token);
    }

    public logout() {
        localStorage.removeItem(this.storageKey);
    }

    public getToken(): string | null{
        return localStorage.getItem(this.storageKey);
    }

    public isLoggedIn() {
        const token: string | null =  this.getToken();
        if (token === null || token == undefined) return false;
        const decodedToken: JwtToken = this.decodeToken(token);
        const exp: number | undefined = decodedToken.exp;
        if (exp === undefined || exp < new Date().getTime()) {
            return false
        }
        return true;
    }

    public getLoggedInUserId(): string | null {
        return this.decodedToken?.userId ?? null;
    }

    public getLoggedInUserRole(): string | null {
        return this.decodedToken?.role ?? null;
    }

    private get decodedToken(): JwtToken | null {
        const token: string | null =  this.getToken();
        if (token === null || token == undefined) return null;
        return this.decodeToken(token);
    }

    private decodeToken(token: string): JwtToken {
        return jwtDecode<JwtToken>(token);
    }
}