import { Ticket } from "./ticket";

export type UserAccount  = {
    id: string;
    email: string;
    role: string;
    wallet: number;
    tickets: Ticket[];
}