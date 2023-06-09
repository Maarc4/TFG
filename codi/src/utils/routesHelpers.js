import { getForecastData } from "../api/routes/getMeteoData"
import { getRoutesData } from "../api/routes/getRoutesData"
import { accessToken } from "../api/constants.js";

import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';
import * as Location from "expo-location"
import { getRouteAirQuality } from "../api/routes/getAirQuality";

/**
 * 
 * Ask user for app geolocation
 * @returns {Promise} User response for geolocation permission
 */
export const getCurrentLocation = async () => {
    var response = { status: false, location: null }
    const resultPermissions = await Location.requestForegroundPermissionsAsync();
    if (resultPermissions.status === "denied") {
        console.log('Permission denied')
        console.log("Debes dar permisos para la geolocalización")
        response = getCurrentLocation()
    } else {
        console.log('Permission granted')
        const position = await Location.getCurrentPositionAsync()
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
            //latitudeDelta: 0.001,
            //longitudDelta: 0.001
        }
        response.status = true
        response.location = location
    }
    return response
}

/**
 * 
 * Auxiliar method to format coordinates from BBDD into an array for mapbox directions api call
 * @param {String} coords 
 * @returns {Array} Coordinates pair
 */
export const parseCoordinates = (coords) => {
    coords = JSON.stringify(coords).replace(']', '')
    coords = JSON.stringify(coords).replace('[', '')
    coords = coords.split(',')
    const latitude = parseFloat(coords[0].replace('"', ''))
    const longitude = parseFloat(coords[1])
    coordsArray = [latitude, longitude]

    return coordsArray;
}

/**
 * 
 * Transform every coordinates array from every route into Mapbox format
 * @param {Object} route Object with coordinates
 * @param {Array} locationUser 
 * @returns waypoints for Mapbox request
 */
export const getWaypointsFromRoute = (route, locationUser) => {
    const waypoints = []
    // Quan es automatica afegim a l'inici i final el waypoint amb la localització del usuari
    if (locationUser.length > 0) {
        waypoints[0] = { coordinates: locationUser }
    }

    JSON.parse(route.coordinates).forEach((coords) => {
        waypoints.push({ coordinates: parseCoordinates(coords) })
    });

    return waypoints;
}

/**
 * Calculate all data for rendering routes. Calls meteo and air APIs and Mapbox Directions API for route
 * 
 * @param {*} setIsLoading 
 * @param {*} setListRoutes 
 * @param {*} setRoutesDistances 
 * @param {*} setRoutesAirQuality 
 * @param {*} filterData 
 * @param {*} locationUser 
 */
export const fetchRoute = async (setRoutesId, setIsLoading, setListRoutes, setRoutesDistances, setRoutesAirQuality, filterData, locationUser) => {
    const directionsClient = MapboxDirectionsFactory({ accessToken });
    let airData;
    setIsLoading(true);
    try {
        setRoutesId([]);
        setListRoutes([]);
        setRoutesDistances([]);
        setRoutesAirQuality([]);
        const routesData = await getRoutesData(filterData, locationUser);
        const parsed_routesData = await JSON.parse(routesData.request._response);
        var day = filterData[0];
        if (filterData[0] === 'QUAN?') {
            day = 'AVUI';
        }
        var day_hour = {
            day: (day === 'AVUI' ? 0 : day === 'DEMÀ' ? 1 : 2),
            hour: filterData[3].getHours()
        }
        var forecastData = await getForecastData(day_hour);
        routesMeteorology = { day: day, time: filterData[3], forecast: forecastData.rainValue, tempXafogor: forecastData.tempXafogor };
        var waypointsList = [];
        for (const route of parsed_routesData.routes) {
            console.log("route_id: "+route.id);
            const waypoints = getWaypointsFromRoute(route, (filterData[2] === 'AUTO' ? locationUser : ''));
            waypointsList.push(waypoints);
            setRoutesId(routesId => [...routesId, route.id]);
            setRoutesDistances(routesDistances => [...routesDistances, route.distance]);
            if (day === 'AVUI') {
                airData = await getRouteAirQuality(JSON.parse(route.coordinates));
                console.log("AIRDATA: ", airData.aqi, airData["aqi"])
            } else {
                airData = 0;
            }
            setRoutesAirQuality(routesAirQuality => [...routesAirQuality, airData.aqi]);
        }
        var waypointsSlice = [];
        for (const waypoints of waypointsList) {
            waypointsSlice.push(waypoints.slice(0, 25));
        }
        for (const waypoints of waypointsSlice) {
            const reqOptions = {
                waypoints: waypoints,
                profile: 'walking',
                geometries: 'geojson'
            }
            try {
                const res = await directionsClient.getDirections(reqOptions).send();
                const newRoute = res.body.routes[0].geometry.coordinates.map(coords => [
                    Number(coords[0].toFixed(5)),
                    Number(coords[1].toFixed(5))
                ]);
                const geojson = {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type: "LineString",
                                coordinates: newRoute
                            },
                        },
                    ],
                }
                setListRoutes(listRoutes => [...listRoutes, geojson]);
            } catch (error) {
                console.log(error);
            }
        }
        setIsLoading(false);
    } catch (error) {
        console.log("It is not possible to render the routes");
        console.log(error);
        setIsLoading(false);
    }
};
/**
 * Controls when user clicks in a route and pass data to InfoRoute component
 * 
 * @param {*} route 
 * @param {*} index 
 * @param {*} filterData 
 * @param {*} setInfoRoute 
 * @param {*} setShowInfo 
 * @param {*} routesDistances 
 * @param {*} routesAirQuality 
 */
export const onSelectedRoute = async (route, index, filterData, setInfoRoute, setShowInfo, routesDistances, routesAirQuality, routesId) => {
    console.log(index)
    setShowInfo(true)
    var day = filterData[0];
    if (filterData[0] === 'QUAN?') {
        day = 'AVUI'
    }

    // Params para obtener el forecast
    const day_hour = {
        day: (day === 'AVUI' ? 0 : day === 'DEMÀ' ? 1 : 2),
        hour: filterData[3].getHours()
    }
    //Recuperem de caché o truquem API
    var forecastData = await getForecastData(day_hour)
    console.log(forecastData)
    const meteoData = { day: day, time: filterData[3], forecast: forecastData.rainValue, tempXafogor: forecastData.tempXafogor }
    // var temp_aqi = [0, 20, 40, 60, 80, 100, 0, 20, 40, 60, 80, 100, 0, 20, 40, 60, 80, 100, 20, 20, 20]
    var ica = routesAirQuality[index]
    console.log("ICA; ", ica)
    // var ica = temp_aqi[index]
    // const info = [routesDistances[index], ica, route.features[0].geometry.coordinates, meteoData, routesId[index]] // Distancia, ICA, lista coordenadas, meteoData
    const info = [routesDistances[index], ica, route.features[0].geometry.coordinates, meteoData, routesId[index]] // Distancia, ICA, lista coordenadas, meteoData
    setInfoRoute(info)

}

export const areCoordinatesClose = (userLocation, coords, threshold = 0.00001) => {
    if (coords === undefined) return false;
    return Math.abs(userLocation[0] - coords[0]) < threshold && Math.abs(userLocation[1] - coords[1]) < threshold;
}