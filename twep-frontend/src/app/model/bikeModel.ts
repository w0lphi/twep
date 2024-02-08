export class BikeModel{
    id: string;
    name: string;
    description: string;
    wheelSize: number;
    bikeCategory: string;
    extraFeatures: string[];
    categoryId: string;

    constructor(id: string, name: string, description: string, wheelSize: number, bikeCategory: string, categoryId: string, extraFeatures: string[] = []){
        this.id = id;
        this.name = name;
        this.description = description;
        this.wheelSize = wheelSize;
        this.bikeCategory = bikeCategory;
        this.categoryId = categoryId;
        this.extraFeatures = extraFeatures;
    }

}