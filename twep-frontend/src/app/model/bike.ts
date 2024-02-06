import { BikeModel } from "./bikeModel";

//TODO: Use camelCase instead of snake case
export class Bike{
    id: string;
    bike_model_id: string;
    bikeModelId: string;
    bikeCategory: string;
    bike_category: string;
    status: string;
    bikeModel?: BikeModel;

    constructor(id: string, bikeModel: BikeModel | null, status: string = "available") {
        this.id = id;
        this.bike_model_id = bikeModel?.id ?? "";
        this.bikeModelId = this.bike_model_id;
        this.bikeCategory = bikeModel?.bikeCategory ?? "";
        this.bike_category = this.bikeCategory;
        this.status = status;
    }
}