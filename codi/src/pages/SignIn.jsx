import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Text, Button, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { Appbar, TextInput } from 'react-native-paper'
import { signIn } from '../utils/accountHelpers.js';
import Spinner from 'react-native-loading-spinner-overlay';

export default function SignIn ({navigation, setLogged, setUserData, fromSideBar}) {
    const [showError, setShowError] = useState(false)
    const [emailInput, setEmailInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
     
    return (
        <View style={{flex: 1}}>
            <SafeAreaView >
                <ScrollView>
                    <Appbar style={{backgroundColor: '#C8E2E7'}}>
                        <Appbar.BackAction style={{backgroundColor: 'white'}} onPress={() => fromSideBar ? navigation.navigate("Main") : navigation.navigate("Inicio")}/>
                        <Appbar.Content title="Pàgina d'Inici de sessió" />
                    </Appbar>
                    {showError && <View style={styles.errorBox}>
                        <Text style={styles.errorText}>Usuari no trobat. Si-us-plau, revisi las dades introduïdes</Text>
                    </View>}
                    <Text style={{position: 'absolute', marginTop: 150, marginLeft: 30, fontSize: 20}}>Introduiex les següents dades per iniciar sessió:</Text>
                    <View style={{marginTop: 200, marginHorizontal: 20}}>
                        <TextInput label="Correu electrónic" onChangeText={(email) => setEmailInput({email})} keyboardType="email-address"/>
                        <TextInput label="Contrasenya" onChangeText={(password) => setPasswordInput({password})} secureTextEntry={true} /> 
                    </View>
                    <View style={{marginTop: 100, width: '100%', alignItems:'center'}}>
                        <TouchableOpacity style={styles.btnIniciar} onPress={() => 
                            signIn(setLogged, setIsLoading, setShowError, emailInput, passwordInput, setUserData, navigation) 
                        }>
                            <Text style={styles.btnText}>Iniciar sessió i començar les rutes</Text>
                        </TouchableOpacity>
                    </View>         
                </ScrollView>
            </SafeAreaView>
            <Spinner
                visible={isLoading}
                textContent={'Iniciant sessió...'}
                textStyle={{size: 20, color: 'black'}}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    btnIniciar: {
        backgroundColor: '#108718',
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
        marginTop: 410,
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