import { BikeCategory } from "./bikeCategory";

export class ParkingPlace{
    id: string;
    bikeCategories: BikeCategory[];

    constructor(id: string, bikeCategories: BikeCategory[]) {
        this.id = id;
        this.bikeCategories = bikeCategories;
    }
}