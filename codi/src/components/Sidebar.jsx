import { View, Button, StyleSheet, Text } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import MedalOption from '../components/MedalOption'
export const SideBar = ({ navigation, logged, setLogged, setSideBar, setFromSideBar, userData }) => {
    return (
        <View style={{ position: 'absolute', top: 0, height: '100%', width: '45%', right: 0, backgroundColor: '#D9D9D9', marginTop: '0%', zIndex: 999, alignItems: 'center', shadowColor: '#171717' }}>
            <View style={{ marginTop: 20 }}><Icon name="person-circle-outline" size={50} color="black" /></View>
            {logged && <View style={{ marginBottom: 50, width: '90%' }}>
                <MedalOption completedRoutes={userData.completed_routes_week}></MedalOption>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ marginBottom: 10, fontSize: 15 }}>Click aquí per modificar las dades del perfil</Text>
                    <Button color='#0E6AB2' title="Modificar perfil" onPress={() => {
                        setSideBar(false)
                        setFromSideBar(true)
                        navigation.navigate("UpdateProfile")
                    }} />
                </View>
                <View style={{ marginTop: 40 }}>
                    <Text style={{ marginBottom: 10, fontSize: 15 }}>Click aquí per veure historial de puntuacions</Text>
                    <Button color='#0E6AB2' title="Historial puntuacions" onPress={() => {
                        setSideBar(false)
                        setFromSideBar(true)
                        navigation.navigate("ReviewsHistory")
                    }} />
                </View>
                {/* <View style={{ marginTop: 60 }}>
                    <Text style={{ marginBottom: 10, fontSize: 15 }}>Click aquí per veure les rutes personalitzades guardades</Text>
                    <Button color='#0E6AB2' title="Historial rutes personalitzades" onPress={() => {
                        setSideBar(false)
                        setFromSideBar(true)
                        navigation.navigate("SavedRoutes")
                    }} />
                </View> */}
                <View style={{ marginTop: 340 }}>
                    <Button color='#DD0D06' title="Tancar sessió" onPress={() =>
                        setLogged(false)} />
                </View>
            </View>}
            {!logged && <View style={{ marginBottom: 50, width: '90%' }}>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ marginBottom: 10, fontSize: 16 }}>Si ja tens un compte, inicia sessió:</Text>
                    <Button color='#108718' title="Iniciar Sessió" onPress={() => {
                        setSideBar(false)
                        setFromSideBar(true)
                        navigation.navigate("SignIn")
                    }} />
                </View>
                <View style={{ marginTop: 50 }}>
                    <Text style={{ marginBottom: 10, fontSize: 16 }}>Si encara no estas registrat, fes-ho en un moment aquí</Text>
                    <Button color='#0E6AB2' title="Registra't" onPress={() => {
                        setSideBar(false)
                        setFromSideBar(true)
                        navigation.navigate("SignUp")
                    }} />
                </View>
            </View>}
        </View>
    );
}
