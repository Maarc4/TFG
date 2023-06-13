import MapBoxView from '../components/MapBoxView.jsx'
import InfoRoute from '../components/InfoRoute.jsx'
import Dropdowns from '../components/Dropdowns.jsx'
import { UIStartedRoute } from '../components/UIStartedRoute.jsx'

import { View, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SideBar } from '../components/Sidebar.jsx'
import { Header } from '../components/Header.jsx'
import { ReviewCard } from '../components/Card.jsx'
import { SaveRoute } from '../components/SaveRoute.jsx'
import Retroaccio from '../components/Retroaccio';


const Main = ({ navigation, userData, sideBar, setSideBar, logged, setLogged, startRoute, setStartRoute, endedRoute, setEndedRoute, setFromSideBar }) => {
    const [showRoutes, setShowRoutes] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [infoRoute, setInfoRoute] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [locationUser, setLocationUser] = useState([1, 2]);
    const [isLoading, setIsLoading] = useState(false);
    const [reptesInfo, setReptesInfo] = useState([])
    const [showPopup, setShowPopup] = useState(false)

    const backAction = () => {
        // No queremos que vuelva a la pantalla de inicio de session al darle atrás, le lleva al inicio
        navigation.navigate("Inicio");
        return true;
    };
    // console.log("Main endedRoute:"+endedRoute)
    // console.log("Main logged:"+logged)
    // console.log("Main n_saved_routes:"+userData.n_saved_routes)
    useEffect(() => {

        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [])

    return (
        <>
            {!startRoute && !showPopup &&  <Header navigation={navigation} sideBar={sideBar} setSideBar={setSideBar} />}
            <View style={{
                flex: 1
            }}>
                {<MapBoxView showRoutes={showRoutes} setShowInfo={setShowInfo} setInfoRoute={setInfoRoute} infoRoute={infoRoute} filterData={filterData} startRoute={startRoute} setStartRoute={setStartRoute} setEndedRoute={setEndedRoute} setIsLoading={setIsLoading} setSideBar={setSideBar} locationUser={locationUser} setLocationUser={setLocationUser} />}
                {!startRoute && !showPopup && <Dropdowns setShowInfo={setShowInfo} setShowRoutes={setShowRoutes} setFilterData={setFilterData} isLoading={isLoading} setSideBar={setSideBar} />}
                {showInfo && <InfoRoute setShowInfo={setShowInfo} infoRoute={infoRoute} setStartRoute={setStartRoute} setSideBar={setSideBar} />}
                {startRoute && <UIStartedRoute showPopup={showPopup} setShowPopup={setShowPopup} setEndedRoute={setEndedRoute} setStartRoute={setStartRoute} coords={locationUser} route_id={infoRoute[4]} />}
                {showPopup && <Retroaccio setShowPopup={setShowPopup} route_id={infoRoute[4]} coords={locationUser} />}
                {logged && endedRoute && filterData[2] !== "AUTO" && <ReviewCard userData={userData} setEndedRoute={setEndedRoute} route_id={infoRoute[4]} />}
                {logged && endedRoute && filterData[2] === "AUTO" && userData.n_saved_routes < 3 && <SaveRoute infoRoute={infoRoute} userData={userData} setEndedRoute={setEndedRoute} />}
                {sideBar && <SideBar navigation={navigation} logged={logged} setLogged={setLogged} setSideBar={setSideBar} setFromSideBar={setFromSideBar} userData={userData} />}

            </View>
        </>
    )
}

export default Main