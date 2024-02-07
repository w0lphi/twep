import * as Leaflet from 'leaflet';
import { Location } from '../model/location';

//Leaflet Layers, found here https://leaflet-extras.github.io/leaflet-providers/preview/
const osm_common: Leaflet.TileLayer = Leaflet.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
});

const stationIconUrl: string = '../../assets/station_marker.png'
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

    static getStationMarker(latitude: number, longitude: number, iconHeight: number = 50, iconWidth: number = 40): Leaflet.Marker<any> {
        const iconSize: Leaflet.PointExpression = [iconWidth, iconHeight];
        const iconAnchor: Leaflet.PointExpression = [iconWidth / 2, iconHeight];
        const icon: Leaflet.Icon = Leaflet.icon({iconSize, iconAnchor, iconUrl: stationIconUrl })
        return Leaflet.marker([latitude, longitude], { icon })
    }

    static getUserMarker(latitude: number, longitude: number, iconHeight: number = 50, iconWidth: number = 40): Leaflet.Marker<any> {
        const iconSize: Leaflet.PointExpression = [iconWidth, iconHeight];
        const iconAnchor: Leaflet.PointExpression = [iconWidth / 2, iconHeight];
        const icon: Leaflet.Icon = Leaflet.icon({iconSize, iconAnchor, iconUrl: userIconUrl, popupAnchor: [0, -50] })
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