import { Location } from "./location";
import { ParkingPlace } from "./parkingPlace";

export class BikeStation{
    id: string;
    name: string;
    location: Location;
    operational: boolean;
    parkingPlaces: ParkingPlace[];

    constructor(id: string = "", name: string = "", location: Location, operational: boolean = false, parkingPlaces: ParkingPlace[] = []){
        this.id = id;
        this.name = name;
        this.location = location;
        this.operational = operational;
        this.parkingPlaces = parkingPlaces;
    }
}