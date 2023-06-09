
import axios from "axios";
import { Alert } from "react-native";
import { BASE_URL_API } from "../constants";

/**
 * PUT /account API call to update user profile
 * 
 * @param {*} name 
 * @param {*} surname 
 * @param {*} email 
 * @param {*} edat 
 * @param {*} password 
 * @returns API response
 */
export const updateProfileService = async (name, surname, email, edat, password) => {
    var response = await axios({
        method: 'put',
        url: BASE_URL_API + '/account/' + `${email}`,
        headers: {'Content-Type': 'application/json'}, 
        data: {
            // This is the body part
            name: name + ' ' + surname,
            email: email,
            edat: edat,
            password: password
        }
    }).catch(function (error) {
        Alert.alert("Error", "No s'ha pogut actualitzar el perfil, torni a intentar-ho", [
            { text: "OK" }
        ]);
    });
       
    return response    
}