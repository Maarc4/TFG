import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, Button, BackHandler, Alert } from 'react-native'
import MapboxGL from '@rnmapbox/maps';
import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { areCoordinatesClose } from "../utils/routesHelpers.js";

MapboxGL.setWellKnownTileServer('Mapbox');
const accessToken = "pk.eyJ1IjoicnVzdGlkb3IiLCJhIjoiY2w4ZzJmNWZ0MDM0ejNxbXJrbGI4OHgzZCJ9.rbUsQGuUVIMNDwESYwhiTw"
MapboxGL.setAccessToken(accessToken);


const StartedRoute = ({ infoRoute, setStartRoute, setEndedRoute, userLocation, startRoute }) => {
  const [geojson, setGeojson] = useState([])
  const [wait, setWait] = useState(true)
  const [mid_cc_checkpoint, setMidCcCheckpoint] = useState(false)

  var route_coords = infoRoute[2]

  const backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => setStartRoute(false) }
    ]);

    return true;
  };

 // Detecta si la ruta ha estat completada automàticament.
  if (mid_cc_checkpoint === false) {
    var close = areCoordinatesClose(userLocation, route_coords[Math.floor(route_coords.length / 2)])
    if (close === true) {
      setMidCcCheckpoint(true)
    }
  } else {
    if (areCoordinatesClose(userLocation, route_coords[route_coords.length - 1]) === true) {
      setStartRoute(false)
      setEndedRoute(true)
    }
  }
  useEffect(() => {
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: infoRoute[2]
          },
        },
      ]
    }
    setGeojson(geojson)
    //setLocationUser(geojson.features[0].geometry.coordinates[0])
    setWait(false)
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [startRoute])

  const renderRoutes = () => {
    return (
      <>

        <MapboxGL.PointAnnotation
          key={`-PointAnnotation`}
          id={`-PointAnnotation`}
          coordinate={geojson.features[0].geometry.coordinates[0]}
          onSelected={() => setStartRoute(false)}>
        </MapboxGL.PointAnnotation>

        <MapboxGL.ShapeSource
          key={`-ShapeSource`}
          id={`-ShapeSource`}
          shape={geojson}
          onPress={() => console.log('pressed')}>
          <MapboxGL.LineLayer key={`routeID-`} id={`routeID-`}

            style={(infoRoute[1] <= 50
              && (infoRoute[3] !== undefined && infoRoute[3].forecast < 15
                && (infoRoute[3].tempXafogor > 18 && infoRoute[3].tempXafogor < 24))) ? styles.greenLine
              // ICA 50-149 i/o plou moderat i/o temp 10-18/24-30 --> TARONJA
              : ((infoRoute[3] !== undefined && infoRoute[3].forecast > 15 && infoRoute[3].forecast <= 30))
              ||  ((infoRoute[1] !== undefined && infoRoute[1]>50 && infoRoute[1] <= 149))
                || (infoRoute[3] !== undefined && (infoRoute[3].tempXafogor >= 10 && infoRoute[3].tempXafogor <= 18)
                  || (infoRoute[3] !== undefined && (infoRoute[3].tempXafogor >= 24 && infoRoute[3].tempXafogor <= 30))
                  && infoRoute[1] <= 149) ? styles.orangeLine
                // ICA > 150 i/o pluja intensa i/o temp <10 o >30 --> VERMELL
                : styles.redLine} />
        </MapboxGL.ShapeSource>

      </>
    );
  }

  return (
    <>
      {!wait && renderRoutes()}
    </>
  )
}

const styles = StyleSheet.create({
  redLine: {
    lineWidth: 5,
    lineJoin: 'bevel',
    lineColor: "#ff0000"
  },
  orangeLine: {
    lineWidth: 5,
    lineJoin: 'bevel',
    lineColor: "orange"
  },
  greenLine: {
    lineWidth: 5,
    lineJoin: 'bevel',
    lineColor: "green"
  }

})

export default StartedRoute