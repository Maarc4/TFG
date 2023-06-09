import axios from "axios";
import { Alert } from "react-native";
import { BASE_URL_API } from "../constants";

/**
 * Clean params without accents for API call
 * 
 * @param {*} str 
 * @returns word formatted
 */
const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * GET /routes API call to get list of routes depending on filters
 * 
 * @param {*} filterData 
 * @param {*} locationUser 
 * @returns list of routes
 */
export const getRoutesData = async (filterData, locationUser) => {
    //Llamada al servicio de /routes
    var routes_endpoint = '/routes';
    var params = {};
    try {
        if (filterData[1] !== 'NIVELL' && filterData[2] !== 'RUTES') {
            params.level = removeAccents(filterData[1]);
            params.health_type = removeAccents(filterData[2]);
            if (filterData[2] === 'AUTO') {
                params.coords = '[' + locationUser.toString() + ']';
            }
        }
        if (filterData[1] !== 'NIVELL' && filterData[2] === 'RUTES') {
            params.health_type = removeAccents('NORMAL');
            params.level = removeAccents(filterData[1]);
        }
        if (filterData[1] === 'NIVELL' && filterData[2] !== 'RUTES') {
            params.health_type = removeAccents(filterData[2]);
            if (filterData[2] === 'AUTO') {
                params.coords = '[' + locationUser.toString() + ']';
            }
        }
        if (filterData[1] === 'NIVELL' && filterData[2] === 'RUTES') {
            params.health_type = removeAccents('NORMAL');
        }
        console.log(BASE_URL_API + routes_endpoint, { params: params })
        // Invoking get method to perform a GET request
        const response = await axios.get(BASE_URL_API + routes_endpoint, { params: params })
        if (response.status === 204) {
            Alert.alert(
                "No s'han trobat rutes",
                "Canvieu els filtres de cerca",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
        }

        return response
    } catch (error) {
        Alert.alert(
            "Error al obtenir las rutes",
            "En aquests moments no podem carregar las rutes. Torni a intentar-ho més tard. \nDisculpi les molesties",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }
}