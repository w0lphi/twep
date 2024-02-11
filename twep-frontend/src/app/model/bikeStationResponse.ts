import { BikeStation } from "./bikeStation";

export class BikeStationResponse {
    stations: BikeStation[];

    constructor(stations: BikeStation[]) {
        this.stations = stations;
    }
}