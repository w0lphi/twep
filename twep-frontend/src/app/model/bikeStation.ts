import { Location } from "./location";

export class BikeStation{
    id: string;
    name: string;
    location?: Location;
    address?: string;
    operational: boolean;
    bikeSpaces: number;

    constructor(id: string = "", name: string = "", location?: Location, operational: boolean = false, bikeSpaces: number = 0, address?: string){
        this.id = id;
        this.name = name;
        this.location = location;
        this.address = address;
        this.operational = operational;
        this.bikeSpaces = bikeSpaces;
    }

    get locationString(): string {
        return `Long: ${this.location?.longitude}, Lat: ${this.location?.latitude}`;
    }
}