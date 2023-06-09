import React, {useEffect} from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { getCurrentLocation } from '../utils/routesHelpers.js';

export default function Inicio ({navigation, logged, setLogged, setFromSideBar}) {

    useEffect(() => {
        (async() => {
          const response = await getCurrentLocation()
          // console.log(response)
          if(response.status) {
            console.log("Acces granted")
          }
        })()
      }, [])

    return (
        <View style={{flex: 1}}>
            <View style={styles.titleView}>
                <Text style={styles.title}>Benvingut a</Text>
                <Text style={styles.title}> CAMINA I RESPIRA</Text>
            </View>
            <View style={styles.body}>
                {!logged && <View style={styles.bodyParts}>
                    <Text style={styles.bodyTexts}>Si encara no estas registrat, fes-ho en un moment aquí</Text>
                    <Button color='#0E6AB2' title="Registra't" onPress={() => {
                        setFromSideBar(false)
                        navigation.navigate("SignUp")}}/>
                </View>}

                {!logged && <View style={styles.bodyParts}>
                    <Text style={styles.bodyTexts}>Si ja tens un compte, inicia sessió:</Text>
                    <Button color='#108718' title="Iniciar Sessió" onPress={() => {
                        setFromSideBar(false)
                        navigation.navigate("SignIn")}}/>
                </View>}

                {logged && <View>
                    <View style={styles.bodyParts}>
                        <Text style={styles.bodyTexts}>Si desitja entrar amb un altre compte, primer ha de tancar l'actual sessió:</Text>
                        <Button color='#DD0D06' title="Tancar sessió" onPress={() =>
                        setLogged(false)}/>
                    </View>
                    <View style={styles.bodyParts}>
                        <Text style={styles.bodyTexts}>Continuar amb aquest compte</Text>
                        <Button color='#138E9B' title="Tornar al mapa" onPress={() =>
                        navigation.navigate("Main")}/>
                    </View>
                </View>}

                {!logged && <View style={styles.bodyParts}>
                    <Text style={styles.bodyTexts}>També pots entrar sense iniciar sessió</Text>
                <Button color='#138E9B' title="Entrar com a Invitat" onPress={() =>
                    navigation.navigate("Main")}/>
                </View>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    titleView: {
        marginTop: 50,
        width: '60%',
        alignItems: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center'
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        alignSelf: 'center',
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    body: {
        marginTop: 20,
        marginLeft: 70
    },
    bodyParts: {
        marginTop: 40,
        width: '80%',
        
    },
    bodyTexts: {
        fontSize: 20,
        marginBottom: 15
    }
});