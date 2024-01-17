import * as Leaflet from 'leaflet';

//Leaflet Layers, found here https://leaflet-extras.github.io/leaflet-providers/preview/
const esri_WorldImagery: Leaflet.TileLayer = Leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

const stadia_StamenTerrainLabels: Leaflet.TileLayer = Leaflet.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain_labels/{z}/{x}/{y}{r}.png', {
	minZoom: 0,
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

const stationIconUrl: string = '../../assets/station_marker.png'

const coordinatesKlu = Leaflet.latLng(46.624268, 14.3051051);
export class LeafletUtil {

    static get mapOptions(): Leaflet.MapOptions {
        return {
            layers: [
                esri_WorldImagery,
                stadia_StamenTerrainLabels
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
}