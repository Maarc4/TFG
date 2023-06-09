
import axios from "axios";
import { BASE_URL_API } from "../constants";

/**
 * POST /login API call for user login
 * 
 * @param {*} email 
 * @param {*} password 
 * @returns API response
 */
export const loginService = async (email, password) => {    
    var response = await axios({
        method: 'post',
        url: BASE_URL_API + '/login',
        headers: {'Content-Type': 'application/json'}, 
        data: {
            email: email,
            password: password // This is the body part
        }
    }).catch(function (error) {
        console.log(error.response.data.message)
        return error
    });

    return response
}