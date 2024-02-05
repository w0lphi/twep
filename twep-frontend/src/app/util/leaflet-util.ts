import * as Leaflet from 'leaflet';

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
}