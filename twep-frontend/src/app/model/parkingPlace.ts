import { BikeCategory } from "./bikeCategory";

export class ParkingPlace{
    id: string;
    bikeCategories: BikeCategory[];
    occupied: boolean;

    constructor(id: string, bikeCategories: BikeCategory[], occupied?: boolean) {
        this.id = id;
        this.bikeCategories = bikeCategories;
        this.occupied = occupied ?? false;
    }
}