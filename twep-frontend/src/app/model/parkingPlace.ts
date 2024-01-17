import { BikeCategory } from "./bikeCategory";

export class ParkingPlace{
    id: string;
    bike_categories: BikeCategory[];

    constructor(id: string, bike_categories: BikeCategory[]) {
        this.id = id;
        this.bike_categories = bike_categories;
    }
}