import { JwtPayload } from "jwt-decode";

export interface JwtToken extends JwtPayload{
    userId?: string | undefined;
    email?: string | undefined;
    role?: string | undefined;
}