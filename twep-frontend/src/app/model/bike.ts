import { BikeModel } from "./bikeModel";
import { BikeStation } from "./bikeStation";

//TODO: Use camelCase instead of snake case
export class Bike{
    id: string;
    bikeModelId: string;
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
    hourPrice?: number;

    constructor(id: string, bikeModelId: string, status?: BikeStatus) {
        this.id = id;
        this.bikeModelId = bikeModelId;
        this.status = status ?? BikeStatus.AVAILABLE;
    }
}

export enum BikeStatus {
    AVAILABLE = "available"
}