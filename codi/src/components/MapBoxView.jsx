import MapboxGL, { Logger } from '@rnmapbox/maps';
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, BackHandler, TouchableOpacity, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { accessToken } from '../api/constants';
import ShowRoutes from './ShowRoutes'
import StartedRoute from './StartedRoute.jsx'

MapboxGL.setWellKnownTileServer('Mapbox');
MapboxGL.setAccessToken(accessToken);

export default function MapBoxView({ showRoutes, setShowInfo, setInfoRoute, infoRoute, filterData, startRoute, setStartRoute, setEndedRoute, setIsLoading, setSideBar, locationUser, setLocationUser}) {
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [compass, setCompass] = useState(false)
  const mapRef = useRef(null)

  const onUserLocationChange = () => {
    console.log(locationUser)
    setCompass(true)
    mapRef.current.setCamera({
      centerCoordinate: locationUser,
      zoomLevel: startRoute ? 17 : 12,
      animationMode: MapboxGL.Camera.FlyTo
    });
    setCompass(false)
  }

  useEffect(() => {
    if (locationUser && startRoute) {
      onUserLocationChange
    }
  }, [locationUser])

  //Para quitar logs molestos de mapbox
  Logger.setLogCallback(log => {
    const { message } = log;
    // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
    if (
      message.match('Request failed due to a permanent error: Canceled') ||
      message.match('Request failed due to a permanent error: Socket Closed')
    ) {
      return true;
    }
    return false;
  });

  const onPressMap = () => {
    //Cerramos el componente de info route al pulsar sobre el mapa
    setShowInfo(false)
    setSideBar(false)
  }

  const disclaimer = () => {
    return (
      Alert.alert("Atenció!", "No ens fem responsables de l'estat de las rutes ni dels inconvenients que en aquestes pugui haver-hi", [
        { text: "D'ACORD", onPress: () => setShowDisclaimer(false) }
      ])
    );
  }

  return (
    <View style={styles.page}>
      {/* {showDisclaimer && disclaimer()} */}
      <Pressable style={styles.btnPause}
        onPress={onUserLocationChange}>
        <Icon style={{ fontSize: 40, alignSelf: 'center' }} name="compass-outline" size={15} color="black" />
      </Pressable>
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => onPressMap()}>
        <MapboxGL.MapView
          style={{ flex: 1 }}
          styleURL={"mapbox://styles/mapbox/outdoors-v10"}
          compassEnabled={true}
          pitchEnabled={true}
          localizeLabels={true}>
          <MapboxGL.Camera
            ref={mapRef}
            zoomLevel={startRoute ? 17 : 12}
            followZoomLevel={startRoute ? 17 : 12}
            followUserLocation={(startRoute ? false : compass)}
            animationMode={'flyTo'}
            centerCoordinate={locationUser}>
          </MapboxGL.Camera>
          <MapboxGL.UserLocation visible={true} showsUserHeadingIndicator={true} onUpdate={location => {
            var currentCoords = [
              parseFloat(location.coords.longitude.toFixed(5)),
              parseFloat(location.coords.latitude.toFixed(5))
            ];
            setLocationUser(currentCoords)
          }} />

          {showRoutes && !startRoute && <ShowRoutes setShowInfo={setShowInfo} setInfoRoute={setInfoRoute} infoRoute={infoRoute} filterData={filterData} startRoute={startRoute} setIsLoading={setIsLoading} locationUser={locationUser} />}
          {startRoute && <StartedRoute infoRoute={infoRoute} setStartRoute={setStartRoute} setEndedRoute={setEndedRoute} userLocation={locationUser} startRoute={startRoute} />}
        </MapboxGL.MapView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    height: "100%",
    width: "100%",
    flex: 1
  },
  map: {
    flex: 1,
  },
  btnPause: {
    position: 'absolute',
    flexDirection: 'row',
    height: 42,
    width: 40,
    zIndex: 999,
    backgroundColor: '#D9D9D9',
    borderWidth: 0.5,
    marginTop: 120,
    borderRadius: 8,
    right: 0,
    marginRight: 8,
    alignContent: 'center'
  },
});