import {View, Button, Alert, StyleSheet, Text, Pressable} from 'react-native'
import React, {useEffect, useState} from 'react'
import { Appbar, TextInput } from 'react-native-paper'
import Spinner from 'react-native-loading-spinner-overlay';
import { getUserData, sendUpdatedProfile } from '../utils/accountHelpers'

export const UpdateProfile = ({navigation, userData, setUserData, fromSideBar}) => {
    const [nameInput, setNameInput] = useState('')
    const [surnameInput, setSurnameInput] = useState('')
    const [emailInput, setEmailInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [passwordConfirmInput, setPasswordConfirmInput] = useState('')
    const [ageInput, setAgeInput] = useState(0)
    const [showError, setShowError] = useState(false)
    const [textError, setTextError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getUserData(userData, setNameInput, setSurnameInput, setEmailInput, setAgeInput)
    }, [])

    return (
        <>
        <Appbar style={{backgroundColor: '#C8E2E7'}}>
            <Appbar.BackAction style={{backgroundColor: 'white'}} onPress={() => navigation.navigate("Main")}/>
            <Appbar.Content title="Modificar perfil" />
        </Appbar>
        <Text style={{marginTop: 20, marginHorizontal: 20, fontSize: 17}}>Introdueix les dades que vulguis modificar del teu perfil:</Text>
        <View style={{marginTop: 30, marginHorizontal: 20}}>
            <TextInput label="Nom" value={nameInput} onChangeText={setNameInput}/>
            <TextInput label="Cognoms" value={surnameInput} onChangeText={setSurnameInput}/>
            <TextInput label="Edat" value={ageInput} onChangeText={setAgeInput} keyboardType="numeric" />
            <TextInput label="Correu electrónic" value={emailInput} onChangeText={setEmailInput} keyboardType="email-address"/>
            <TextInput label="Contrasenya" onChangeText={setPasswordInput} secureTextEntry={true}/> 
            <TextInput label="Confirmar contrasenya" onChangeText={setPasswordConfirmInput} secureTextEntry={true} />
            {showError && <View style={styles.errorBox}>
                <Text style={styles.errorText}>{textError}</Text>
            </View>}
            <View style={{marginTop: 20}}>
                <Button color='#0E6AB2' title="Modificar perfil" onPress={() => {
                    sendUpdatedProfile(nameInput, surnameInput, emailInput, ageInput, passwordInput, passwordConfirmInput, setTextError, setShowError, setIsLoading, setUserData, navigation)}}/>
            </View>
       </View>
       <Spinner
            visible={isLoading}
            textContent={'Actualitzant compte...'}
            textStyle={{size: 20, color: 'black'}}
        /> 
       </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        top: 0,
        height: 50,
        width: '100%',
        backgroundColor: 'red'
    },
    errorBox: {
        alignItems: 'center',
        marginTop: 10,
        marginLeft: '9%',
        height: 50,
        width: '80%',
        zIndex: 5,
        backgroundColor: '#DC091A',
        justifyContent: 'center'
    },
    errorText: {
        fontSize: 17,
        textAlign:'center',
        color: 'black',
        fontWeight: '500'
    }
})