import React, {useState} from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { Appbar, TextInput } from 'react-native-paper'
import Spinner from 'react-native-loading-spinner-overlay';
import { signUp } from '../utils/accountHelpers';

export default function SignUp ({navigation, setLogged, setUserData, fromSideBar}) {
    const [nameInput, setNameInput] = useState('')
    const [surnameInput, setSurnameInput] = useState('')
    const [emailInput, setEmailInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [passwordConfirmInput, setPasswordConfirmInput] = useState('')
    const [ageInput, setAgeInput] = useState('')
    const [showError, setShowError] = useState(false)
    const [textError, setTextError] = useState('Usuari no creat. Si-us-plau, revisi las dades introduïdes')
    const [isLoading, setIsLoading] = useState(false)

    return (
        <View style={{flex: 1}}>
            <Appbar style={{backgroundColor: '#C8E2E7'}}>
                <Appbar.BackAction style={{backgroundColor: 'white'}} onPress={() => fromSideBar ? navigation.navigate("Main") : navigation.navigate("Inicio")}/>
                <Appbar.Content title="Pàgina de registre" />
            </Appbar>
            <Text style={{position: 'absolute', marginTop: 70, marginHorizontal: 30, fontSize: 20}}>Introdueix les següents dades per crear un compte nou:</Text>
            <View style={{marginTop: 80, marginHorizontal: 20}}>
                <TextInput label="Nom" onChangeText={setNameInput}/>
                <TextInput label="Cognoms" onChangeText={setSurnameInput}/>
                <TextInput label="Edat" onChangeText={setAgeInput} keyboardType="numeric" />
                <TextInput label="Correu electrónic" onChangeText={setEmailInput} keyboardType="email-address"/>
                <TextInput label="Contrasenya" onChangeText={setPasswordInput} secureTextEntry={true}/> 
                <TextInput label="Confirmar contrasenya" onChangeText={setPasswordConfirmInput} secureTextEntry={true} />
            </View>
            <View style={{marginTop: 20, width: '100%', alignItems:'center'}}>
                <Button color='#0E6AB2' title="Registrar i començar les rutes"  onPress={() =>
                    signUp(nameInput, surnameInput, emailInput, ageInput, passwordInput, passwordConfirmInput, setShowError, setTextError, setLogged, setIsLoading, setUserData, navigation)}>
                </Button>
            </View>
            {showError && <View style={styles.errorBox}>
                <Text style={styles.errorText}>{textError}</Text>
            </View>}

            <Spinner
                visible={isLoading}
                textContent={'Iniciant sessió...'}
                textStyle={{size: 20, color: 'black'}}
            /> 
        </View>
    );
}

const styles = StyleSheet.create({
    btnRegister: {
        backgroundColor: '#0E6AB2',
        height: 40
    },
    btnText: {
        padding: 8,
        fontSize: 15,
        color: 'white',
        textTransform: 'uppercase'
    },
    errorBox: {
        alignItems: 'center',
        position: 'absolute',
        marginTop: 590,
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
});