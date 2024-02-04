import { BikeModel } from "./bikeModel";

//TODO: Use camelCase instead of snake case
export class Bike{
    id: string;
    bike_model_id: string;
    bikeModelId: string;
    bike_category: string;
    status: string;

    constructor(id: string, bikeModel: BikeModel | null, status: string = "available") {
        this.id = id;
        this.bike_model_id = bikeModel?.id ?? "";
        this.bikeModelId = this.bike_model_id;
        this.bike_category = bikeModel?.bikeCategory ?? "";
        this.status = status;
    }
}