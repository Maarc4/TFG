
import axios from "axios";
import { BASE_URL_API } from "../constants";

/**
 * POST /account make API request to create new User
 * 
 * @param {*} name 
 * @param {*} surname 
 * @param {*} email 
 * @param {*} edat 
 * @param {*} password 
 * @returns API response
 */
export const signUpService = async (name, surname, email, edat, password) => {
    var response = await axios({
        method: 'post',
        url: BASE_URL_API + '/account',
        headers: {'Content-Type': 'application/json'}, 
        data: {
            // This is the body part
            name: name + ' ' + surname,
            email: email,
            edat: edat,
            password: password
        }
    })
    .catch(function (error) {
        return error
    });

    return response
}