export interface UserAccount {
    id: string;
    email: string;
    role: string;
    wallet: number;
    tickets: Ticket[];
  }
  
  export interface Ticket {
    id: string;
    bikeType: string;
    station: string;
    purchaseDate: Date;
    immediateRenting: boolean;
    reservedStation: string;
  }
