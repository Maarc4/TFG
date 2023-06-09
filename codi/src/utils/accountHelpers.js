import { signUpService } from "../api/account/createAccount"
import { loginService } from "../api/account/loginService"
import { updateProfileService } from "../api/account/updateAccount"

import {Alert} from 'react-native'

/**
 * Validate Sign In API response to pass data to Main page or show errors
 * 
 * @param {*} response 
 * @param {*} setShowError 
 * @param {*} setLogged 
 * @param {*} setUserData 
 * @param {*} navigation 
 */
const validateSignIn = (response, setShowError, setLogged, setUserData, navigation) => {
    if (response.status === 200) {
        setShowError(false)
        console.log('STATUS ' + response.data.account + ': User logged in correctly')
        setLogged(true)
        setUserData(response.data.account)
        navigation.navigate("Main");
    } else {
        setShowError(true)
        console.log('STATUS ' + response.status + ': ' + response.data.message)
    }
}

/**
 * Make the API request for user login
 * 
 * @param {*} setLogged 
 * @param {*} setIsLoading 
 * @param {*} setShowError 
 * @param {*} emailInput 
 * @param {*} passwordInput 
 * @param {*} setUserData 
 * @param {*} navigation 
 */
export const signIn = async (setLogged, setIsLoading, setShowError, emailInput, passwordInput, setUserData, navigation) => {       
    //Llamada al servicio de /login
    var response = {}
    setIsLoading(true)
    try {
        response = await loginService(emailInput.email, passwordInput.password)
        validateSignIn(response, setShowError, setLogged, setUserData, navigation)
    } catch (error) {
        console.error(error);
    }
    setIsLoading(false)
}

/**
 * Front validations for form inputs when sign in or update profile
 * 
 * @param {*} nameInput 
 * @param {*} surnameInput 
 * @param {*} emailInput 
 * @param {*} ageInput 
 * @param {*} passwordInput 
 * @param {*} passwordConfirmInput 
 * @param {*} setTextError 
 * @param {*} setShowError 
 * @param {*} setLogged 
 * @param {*} setUserData 
 * @param {*} navigation 
 * @returns if inputs are valid or not
 */

export const checkTextInputs = (nameInput, surnameInput, emailInput, ageInput, passwordInput, passwordConfirmInput, setTextError, setShowError, setLogged, setUserData, navigation) => {

    //Check empty inputs
    if (!nameInput || !surnameInput || !emailInput || !ageInput 
        || !passwordInput || !passwordConfirmInput) {
        setTextError("Omple tots els camps")
        setShowError(true)
        return false;
    }

    //Check email format
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    const validator = require('validator')

    if(!reg.test(emailInput.toString())) {
        setTextError("El correu electónic no té un format vàlid")
        setShowError(true)
        return false;
    }

    if(passwordInput.toString() !== passwordConfirmInput.toString()) {
        setTextError('Les contrasenyes no coincideixen')
        setShowError(true)
        return false;
    }

    // Si todos los campos són válidos registramos la cuenta
    setShowError(false)
    return true;
}

/**
 * Validate Sign Up API response to pass data to Main page or show errors
 * 
 * @param {*} response 
 * @param {*} setShowError 
 * @param {*} setTextError 
 * @param {*} setLogged 
 * @param {*} setUserData 
 * @param {*} navigation 
 */
const validateSignUp = (response, setShowError, setTextError, setLogged, setUserData, navigation) => {
    if (response.status === 200) {
        setShowError(false)
        // console.log('STATUS ' + response.data + ': User created correctly')
        setLogged(true)
        setUserData(response.data)
        navigation.navigate("Tutorial");
    } else {
        setShowError(true)
        setTextError('Aquest correu ja existeix')
    }
}

/**
 * Make the API request for user sign up
 * 
 * @param {*} nameInput 
 * @param {*} surnameInput 
 * @param {*} emailInput 
 * @param {*} ageInput 
 * @param {*} passwordInput 
 * @param {*} passwordConfirmInput 
 * @param {*} setShowError 
 * @param {*} setTextError 
 * @param {*} setLogged 
 * @param {*} setIsLoading 
 * @param {*} setUserData 
 * @param {*} navigation 
 */
export const signUp = async (nameInput, surnameInput, emailInput, ageInput, passwordInput, passwordConfirmInput, setShowError, setTextError, setLogged, setIsLoading, setUserData, navigation) => {
    setIsLoading(true)
    if (checkTextInputs(nameInput, surnameInput, emailInput, ageInput, passwordInput, passwordConfirmInput, setTextError, setShowError, setLogged, setUserData, navigation)) {
        //Llamada al servicio de POST /account
        var response = {}
        try {
            response = await signUpService(nameInput, surnameInput, emailInput, ageInput, passwordInput)
            console.log(response)
            validateSignUp(response, setShowError, setTextError, setLogged, setUserData, navigation)
        } catch (error) {
            console.error(error);
        }
    }
    setIsLoading(false)
 }

/**
 * Get logged user data and prepare for updateProfile form
 * 
 * @param {*} userData 
 * @param {*} setNameInput 
 * @param {*} setSurnameInput 
 * @param {*} setEmailInput 
 * @param {*} setAgeInput 
 */
export const getUserData = (userData, setNameInput, setSurnameInput, setEmailInput, setAgeInput) => {
    setNameInput(userData.name.split(' ')[0])
    setSurnameInput(userData.name.split(' ')[1] + (userData.name.split(' ')[2] !== undefined ? ' ' + userData.name.split(' ')[2] : ''))
    setEmailInput(userData.email)
    setAgeInput(parseInt(userData.edat))
}

/**
 * Get API response when update profile call
 * 
 * @param {*} nameInput 
 * @param {*} surnameInput 
 * @param {*} emailInput 
 * @param {*} ageInput 
 * @param {*} passwordInput 
 * @param {*} passwordConfirmInput 
 * @param {*} setTextError 
 * @param {*} setShowError 
 * @param {*} setIsLoading 
 * @param {*} setUserData 
 * @param {*} navigation 
 */
export const sendUpdatedProfile = async (nameInput, surnameInput, emailInput, ageInput, passwordInput, passwordConfirmInput, setTextError, setShowError, setIsLoading, setUserData, navigation) => {
    setIsLoading(true)
    if (checkTextInputs(nameInput, surnameInput, emailInput, ageInput, passwordInput, passwordConfirmInput, setTextError, setShowError)) {
        var response = {}
        try {
            response = await updateProfileService(nameInput, surnameInput, emailInput, ageInput, passwordInput)
            if (response.status === 200) {
                Alert.alert("Completat", "El teu perfil s'ha actualitzat correctament", [
                    { text: "OK" }
                ]);
                setUserData(response.data)
                navigation.navigate("Main")
            } else {
                Alert.alert("Error", "No s'ha pogut actualitzar el perfil, torni a intentar-ho", [
                    { text: "OK" }
                ]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No s'ha pogut actualitzar el perfil, torni a intentar-ho", [
                { text: "OK" }
            ]);
        }
    }
    setIsLoading(false)
}

