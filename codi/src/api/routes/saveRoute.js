import axios from "axios";
import { Alert } from "react-native";
import { BASE_URL_API } from "../constants";

const updateSavedRoutes = async (user_id) => {
    const updatedData = {
        n_saved_routes: 1 // Set to whatever value you want to increment by
    };
    var response = await axios({
        method: 'put',
        url: BASE_URL_API + `/account/${user_id}`,
        headers: { 'Content-Type': 'application/json' },
        data: updatedData
    }).then(response => {
        console.log(response.data);
    }).catch(function (error) {
        // Alert.alert("Error", "No s'ha pogut actualitzar el perfil, torni a intentar-ho", [
        //     { text: "OK" }
        // ]);
        console.log(error.response.data.message)
        Alert.alert("Error", error.response.data.message)
        return error
    });
}

export const postRoute = async (distance, coords, userData) => {
    var data = {
        name: "RUTA PERSONALIZADA " + userData.name + (userData.n_saved_routes + 1),
        level: "MITJA",
        activity: "PASEO",
        distance: distance,
        type: "CIRCULAR",
        coordinates: coords,
        elevation: 0.52341,
        health_type: "NORMAL",
    }
    console.log("IN POST ROUTE")
    var response = await axios({
        method: 'post',
        url: BASE_URL_API + '/route',
        headers: { 'Content-Type': 'application/json' },
        data: data
    }).then(response => {
        console.log(response.data);
        updateSavedRoutes(userData.id)
    }).catch(function (error) {
        // Alert.alert("Error", "No s'ha pogut actualitzar el perfil, torni a intentar-ho", [
        //     { text: "OK" }
        // ]);
        console.log(error.response.data.message)
        Alert.alert("Error", error.response.data.message)
        return error
    });


    return response
}