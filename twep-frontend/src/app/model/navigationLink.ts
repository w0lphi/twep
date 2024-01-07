export class NavigationLink{
    private _icon: string;
    private _title: string;
    private _route: string;

    constructor(title: string, icon: string, route: string) {
        this._title = title;
        this._icon = icon;
        this._route = route;
    }

    get icon(): string{
        return this._icon;
    }

    get title(): string {
        return this._title;
    }

    get route(): string {
        return this._route;
    }
}