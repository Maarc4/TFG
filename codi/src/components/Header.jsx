import {View, Button, Alert, StyleSheet, Text, Pressable} from 'react-native'
import React, {useState} from 'react'
import { Appbar, TextInput } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons';

export const Header = ({navigation, sideBar, setSideBar}) => {

    return (
        <Appbar style={{backgroundColor: '#C8E2E7'}}>
            <Appbar.BackAction style={{backgroundColor: 'white'}} onPress={() => navigation.navigate("Inicio")}/>
            <Appbar.Content title="CAMINA I RESPIRA" />
            <View style={{marginRight: 10}}><Pressable onPress={() => setSideBar(!sideBar)}><Icon name="menu-outline" size={35} color="black" /></Pressable></View>
        </Appbar>
    );
}