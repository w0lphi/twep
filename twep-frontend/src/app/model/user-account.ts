export type UserAccount  = {
    id: string;
    email: string;
    role: string;
    wallet: number;
    tickets: Ticket[];
  }
  
  export type Ticket = {
    id: string;
    bikeType: string;
    station: string;
    purchaseDate: Date;
    immediateRenting: boolean;
    reservedStation: string;
  }
