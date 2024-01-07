import { Location } from "./location";

export class BikeStation{
    id?: string;
    name?: string;
    address?: string;
    location?: Location;
    operational?: boolean;
    bikeSpaces?: number;

    get locationString(): string {
        return `Long: ${this.location?.longitude}, Lat: ${this.location?.latitude}`;
    }
}