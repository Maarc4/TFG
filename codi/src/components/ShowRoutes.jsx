import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { fetchRoute, onSelectedRoute } from "../utils/routesHelpers.js";
import { accessToken } from "../api/constants.js";

MapboxGL.setWellKnownTileServer('Mapbox');
MapboxGL.setAccessToken(accessToken);

export default function ShowRoutes({ setShowInfo, setInfoRoute, filterData, startRoute, setIsLoading, locationUser }) {
    const [listRoutes, setListRoutes] = useState([])
    const [routesDistances, setRoutesDistances] = useState([])
    const [routesAirQuality, setRoutesAirQuality] = useState([])
    const [routesId, setRoutesId] = useState([])
    // var temp_aqi = [0, 20, 40, 60, 80, 100, 0, 20, 40, 60, 80, 100, 0, 20, 40, 60, 80, 100, 20, 20, 20]
    useEffect(() => {
        fetchRoute(setRoutesId, setIsLoading, setListRoutes, setRoutesDistances, setRoutesAirQuality, filterData, locationUser)
    }, [filterData])
    // var tipus_ruta=filterData[2]
    // console.log(tipus_ruta)
    const renderRoutes = () => {
        return (
            listRoutes.map((route, index) => ( //Dins de route tenir las coordenades, nom ruta, color segons la contaminació.
                <>

                    <MapboxGL.PointAnnotation
                        key={`${index}-PointAnnotation`}
                        id={`${index}-PointAnnotation`}
                        coordinate={route.features[0].geometry.coordinates[0]}
                        onSelected={() => onSelectedRoute(route, index, filterData, setInfoRoute, setShowInfo, routesDistances, routesAirQuality, routesId)}>
                    </MapboxGL.PointAnnotation>

                    <MapboxGL.ShapeSource
                        key={`${index}-ShapeSource`}
                        id={`${index}-ShapeSource`}
                        shape={route}
                        onPress={() => onSelectedRoute(route, index, filterData, setInfoRoute, setShowInfo, routesDistances, routesAirQuality, routesId)}>
                        <MapboxGL.LineLayer key={`routeID-${index}`} id={`routeID-${index}`}
                            // style={(routesAirQuality[index] <= 50 && routesMeteorology.forecast < 15) ? styles.greenLine : ((routesAirQuality[index] > 50) && (routesAirQuality[index] <= 100)) ? styles.yellowLine : ((routesAirQuality[index] > 100) && (routesAirQuality[index] <= 149) || (routesMeteorology.forecast > 15 && routesAirQuality[index] <= 149)) ? styles.orangeLine : styles.redLine} />
                            style={(routesAirQuality[index] <= 50 && routesMeteorology.forecast < 15 && routesMeteorology.tempXafogor <= 24 && routesMeteorology.tempXafogor >= 18) ? styles.greenLine : ((routesMeteorology.forecast > 15 || routesAirQuality[index] <= 149) || ((routesMeteorology.tempXafogor < 18 && routesMeteorology.tempXafogor >= 10) || (routesMeteorology.tempXafogor >= 24 && routesMeteorology.tempXafogor <= 30))) ? styles.orangeLine : styles.redLine} />
                    </MapboxGL.ShapeSource>
                </>
            ))
        );
    }

    return (
        <>
            {!startRoute && renderRoutes()}
        </>
    )
}

const styles = StyleSheet.create({
    redLine: {
        lineWidth: 4,
        lineJoin: 'bevel',
        lineColor: "#E73219"
    },
    orangeLine: {
        lineWidth: 4,
        lineJoin: 'bevel',
        lineColor: "#ff7514"
    },
    yellowLine: {
        lineWidth: 4,
        lineJoin: 'bevel',
        lineColor: "#FDE308"
    },
    greenLine: {
        lineWidth: 4,
        lineJoin: 'bevel',
        lineColor: "#079318"
    }

})