import { BikeModel } from "./bikeModel";
import { BikeStation } from "./bikeStation";

//TODO: Use camelCase instead of snake case
export class Bike{
    id: string;
    bikeModelId: string;
    bikeCategory: string;
    status: BikeStatus;

    //Only in response
    category?: string;
    description?: string;
    extraFeatures?: string[];
    model?: string;
    modelId?: string;
    parkingPlaceId?: string;
    wheelSize?: number;
    categoryId?: string;
    station?: BikeStation;

    constructor(id: string, bikeModel: BikeModel | null, status?: BikeStatus) {
        this.id = id;
        this.bikeModelId = bikeModel?.id ?? "";
        this.bikeCategory = bikeModel?.bikeCategory ?? "";
        this.status = status ?? BikeStatus.AVAILABLE;
    }
}

export enum BikeStatus {
    AVAILABLE = "available"
}