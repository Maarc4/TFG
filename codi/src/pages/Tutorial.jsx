import {View, Button, Alert, StyleSheet, Text, Pressable, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';

const data_quan = [{label: 'AVUI', value:'AVUI'}, {label: 'DEMÀ', value:'DEMÀ'}, {label: 'DEMÀ PASSAT', value:'DEMÀ PASSAT'}]
const data_dificultat = [{label: 'FÀCIL', value:'FÀCIL'}, {label: 'MITJÀ', value:'MITJÀ'}, {label: 'DIFÍCIL', value:'DIFÍCIL'}]
const data_tipus = [{label: 'PROPOSTA INICIAL', value:'NORMAL'}, {label: 'PROPOSTA VERDA', value:'ZONES VERDES'}, {label: 'COMENÇA AQUÍ', value: 'AUTO'}]

export const Tutorial = ({navigation}) => {
    const [selectedQuan, setSelectedQuan] = useState('QUAN?')
    const [selectedDiff, setSelectedDiff] = useState('NIVELL')
    const [selectedTipus, setSelectedTipus] = useState('RUTES')

    const [open, setOpen] = useState(false)

    return (
        <View style={styles.container}>
            <View>
                <Text style={{fontSize: 35, fontWeight: 'bold', marginTop: 40, alignSelf: 'center'}}>TUTORIAL</Text>
                <Text style={{marginTop: 20, marginHorizontal: 20}}>A continuació et mostrarem diferents rutes indicant el nivell de contaminació i previsió meteorológica segons els paràmetres de busqueda que fagis: </Text>
            </View>
            <View style={{paddingLeft: 40, paddingRight: 20, marginTop: 20, height: '90%'}}>
                <Text>Primer, podràs seleccionar en quin moment vols fer la ruta. AVUI, DEMÀ o DEMÀ PASSAT i a quina hora</Text>
                <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={data_quan}
                        maxHeight={500}
                        labelField="label"
                        valueField="value"
                        placeholder="QUAN?"
                        searchPlaceholder="Search..."
                        value={selectedQuan}
                        onChange={item => {
                            setSelectedQuan(item.value);
                            setOpen(true)
                        }}
                        renderLeftIcon={() => (
                            <Icon style={{paddingRight: 10, paddingLeft: 5}} name="caret-down-outline" size={15} color="black" />
                        )}
                        renderRightIcon={() => (
                            <Pressable onPress={() => {setSelectedQuan('QUAN?')}}>
                                <Icon style={styles.icon} name="trash-outline" size={20} color="black" />
                            </Pressable>
                        )}
                    />
                <Text>En el següent desplegable, podrás seleccionar la dificultat de la ruta per així trobar la que més s'ajusti al teu nivell. La dificultat s'estableix a partir de la distáncia</Text>
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={data_dificultat}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="NIVELL"
                    searchPlaceholder="Search..."
                    value={selectedDiff}
                    onChange={item => {
                        setSelectedDiff(item.value);
                    }}
                    renderLeftIcon={() => (
                        <Icon style={{paddingRight: 10, paddingLeft: 5}} name="caret-down-outline" size={15} color="black" />
                    )}
                    renderRightIcon={() => (
                        <Pressable onPress={() => {setSelectedDiff('NIVELL')}}>
                            <Icon style={styles.icon} name="trash-outline" size={20} color="black" />
                        </Pressable>
                    )}
                />
                <Text>Per últim, el més important de l'app. Podrás seleccionar que et mostri rutes de PROPOSTA VERDA per pasar per parcs i zones més sanes o de PROPOSTA INICIAL per caminar/correr sense necesitat de ser una zona verda o que et mostri una ruta AUTOMÀTICA des del punt on estas cap a zones verdes.</Text>
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyleTipus}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={data_tipus}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="RUTES"
                    searchPlaceholder="Search..."
                    value={selectedTipus}
                    onChange={item => {
                        setSelectedTipus(item.value);
                    }} 
                    renderLeftIcon={() => (
                        <Icon style={{paddingRight: 10, paddingLeft: 5}} name="caret-down-outline" size={15} color="black" />
                    )}
                    renderRightIcon={() => (
                        <Pressable onPress={() => {setSelectedTipus('RUTES')}}>
                            <Icon style={styles.icon} name="trash-outline" size={20} color="black" />
                        </Pressable>
                    )}
                />
            </View>
            <View style={styles.btn_accept}>
                <TouchableOpacity style={{textAlignVertical: 'center'}} title="Registrar i començar las rutes"  onPress={() =>
                    navigation.navigate("Main")}>
                    <Text style={styles.btn_text}>Acceptar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%'
    },
    btn_accept: {
        position: 'absolute', 
        bottom: 0, 
        alignSelf: 'center', 
        marginBottom: 30,
        width: '30%',
        height: '6%',
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 0.5,
        borderRadius: 5
    },
    btn_text: {
        paddingTop: 4,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },
    dropdown: {
        height: 50,
        width: '33%',
        borderColor: 'black',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingLeft: 0,
        marginBottom: 10,
        marginTop: 10,
        alignSelf: 'center',
        marginLeft: -20
    },
    selectedTextStyle: {
        fontSize: 15,
        fontWeight: 'bold',
        justifyContent: 'center',
        color: '#19B46E'
    },
    selectedTextStyleTipus: {
        fontSize: 12,
        fontWeight: 'bold',
        justifyContent: 'center',
        color: '#19B46E'
    },
})