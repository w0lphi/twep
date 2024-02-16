import { Bike } from "./bike";

export type Ticket = {
    ticketId: string,
    userId: string,
    fromDate: string,
    untilDate: string,
    immediateRenting: boolean,
    bike: Bike,
    qrCodeBase64: string,
    status: TicketStatus,
    price: string,
}

export enum TicketStatus {
    RENTED = "rented",
    UNUSED = "unused",
    RETURNED = "returned",
    CANCELLED = "cancelled",
}