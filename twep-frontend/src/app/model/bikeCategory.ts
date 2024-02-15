export class BikeCategory{
    id?: string;
    name?: string;
    hourPrice: number;

    constructor(id: string, name: string, hourPrice: number = 0) {
        this.id = id; 
        this.name = name;
        this.hourPrice = hourPrice
    }
}