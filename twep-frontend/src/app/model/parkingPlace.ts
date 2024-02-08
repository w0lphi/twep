import { BikeCategory } from "./bikeCategory";

export class ParkingPlace{
    id: string;
    _bikeCategories: BikeCategory[];
    bike_categories: BikeCategory[];
    occupied: boolean;

    constructor(id: string, bikeCategories: BikeCategory[], occupied?: boolean) {
        this.id = id;
        this._bikeCategories = bikeCategories;
        this.bike_categories = bikeCategories;
        this.occupied = occupied ?? false;
    }

    set bikeCategories(bikeCategories: BikeCategory[]) {
        this._bikeCategories = bikeCategories;
        this.bike_categories = bikeCategories;
    }

    get bikeCategories(): BikeCategory[]{
        return this._bikeCategories;
    }
}