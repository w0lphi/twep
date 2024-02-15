import { Bike } from "./bike";

export type Ticket = {
    ticketId: string,
    userId: string,
    fromDate: string,
    untilDate: string,
    immediateRenting: boolean,
    bike: Bike,
    qrCodeBase64: string,
}