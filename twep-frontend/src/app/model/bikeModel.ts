export class BikeModel{
    id?: string;
    name?: string;
    description?: string;
    wheelSize?: number;
    extraFeatures?: string[];

    constructor(id: string, name: string, description: string, wheelSize: number, extraFeatures: string[] = []){
        this.id = id;
        this.name = name;
        this.description = description;
        this.wheelSize = wheelSize;
        this.extraFeatures = extraFeatures;
    }

}