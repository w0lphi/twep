import * as Leaflet from 'leaflet';
import { Location } from '../model/location';

//Leaflet Layers, found here https://leaflet-extras.github.io/leaflet-providers/preview/
const osm_common: Leaflet.TileLayer = Leaflet.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
});

const stationIconUrl: string = '../../assets/station_marker.png'
const stationIconDisabledUrl: string = '../../assets/station_marker_disabled.png'
const userIconUrl: string = '../../assets/user_marker.png'

const coordinatesKlu = Leaflet.latLng(46.624268, 14.3051051);
export class LeafletUtil {

    static get mapOptions(): Leaflet.MapOptions {
        return {
            layers: [
                osm_common,
            ],
            zoom: 12,
            center: coordinatesKlu
        }
    }

    static getStationMarker(latitude: number, longitude: number, options?: MarkerOptions): Leaflet.Marker<any> {
        const iconHeight: number = options?.iconHeight ?? 50;
        const iconWidth: number = options?.iconWidth ?? 40;
        const disabled: boolean = options?.disabled ?? false;
        const iconUrl: string = disabled ? stationIconDisabledUrl : stationIconUrl;
        const iconSize: Leaflet.PointExpression = [iconWidth, iconHeight];
        const iconAnchor: Leaflet.PointExpression = [iconWidth / 2, iconHeight];
        const icon: Leaflet.Icon = Leaflet.icon({iconSize, iconAnchor, iconUrl, popupAnchor: [0, -iconHeight] });
        return Leaflet.marker([latitude, longitude], { icon })
    }

    static getUserMarker(latitude: number, longitude: number, options?: MarkerOptions): Leaflet.Marker<any> {
        const iconHeight: number = options?.iconHeight ?? 50;
        const iconWidth: number = options?.iconWidth ?? 40;
        const iconSize: Leaflet.PointExpression = [iconWidth, iconHeight];
        const iconAnchor: Leaflet.PointExpression = [iconWidth / 2, iconHeight];
        const icon: Leaflet.Icon = Leaflet.icon({iconSize, iconAnchor, iconUrl: userIconUrl, popupAnchor: [0, -iconHeight] })
        return Leaflet.marker([latitude, longitude], { icon })
    }

    /**
     * Returns the distance between two locations in kilometers
     * @param origin 
     * @param destination 
     * @returns 
     */
    static getDistance(origin: Location, destination: Location): string {
        const EARTH_RADIUS_KM = 6371;
        const originLat = this.degToRadian(origin.latitude);
        const destinationLat = this.degToRadian(destination.latitude);
        const deltaLat: number = this.degToRadian(destination.latitude - origin.latitude);
        const deltaLon: number = this.degToRadian(destination.longitude - origin.longitude);

        const a: number = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(originLat) * Math.cos(destinationLat) * Math.pow(Math.sin(deltaLon/2), 2);
        const c: number = 2 * Math.asin(Math.sqrt(a));
        const distanceKm = c * EARTH_RADIUS_KM;
        return new Intl.NumberFormat("en-GB", {
            maximumSignificantDigits: 2
        }).format(distanceKm)
    }

    private static degToRadian(degree: number): number {
        return degree*Math.PI/180;
    }
}

export class MarkerOptions{
    iconHeight?: number;
    iconWidth?: number;
    disabled?: boolean;
}