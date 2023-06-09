import React, {useState } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, Button, Pressable} from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker'
import Spinner from 'react-native-loading-spinner-overlay';

const data_quan = [{label: 'AVUI', value:'AVUI'}, {label: 'DEMÀ', value:'DEMÀ'}, {label: 'DEMÀ PASSAT', value:'DEMÀ PASSAT'}]
const data_dificultat = [{label: 'FÀCIL', value:'FÀCIL'}, {label: 'MITJÀ', value:'MITJÀ'}, {label: 'DIFÍCIL', value:'DIFÍCIL'}]
const data_tipus = [{label: 'PROPOSTA INICIAL', value:'NORMAL'}, {label: 'PROPOSTA VERDA', value:'ZONES VERDES'}, {label: 'COMENÇA AQUÍ', value: 'AUTO'}]

const Dropdowns = ({setShowInfo, setShowRoutes, setFilterData, isLoading, setSideBar}) => {
    const [selectedQuan, setSelectedQuan] = useState('QUAN?')
    const [selectedDiff, setSelectedDiff] = useState('NIVELL')
    const [selectedTipus, setSelectedTipus] = useState('RUTES')

    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

    const searchRoutes = () => {
        //Resetamos el array
        setFilterData([])
        //Guardamos los valores de los filtros
        setFilterData(filterData => [...filterData, selectedQuan])
        setFilterData(filterData => [...filterData, selectedDiff])
        setFilterData(filterData => [...filterData, selectedTipus])
        setFilterData(filterData => [...filterData, date])
        setSideBar(false)
        setShowInfo(false)
        setShowRoutes(true)
    }

    return (
        <View style={{position: 'absolute', top: 0, width: '100%', alignItems: 'center'}}>
            <View style={{position: 'absolute', top: 0, backgroundColor: '#D9D9D9', height: 100, width: '96%',alignItems: 'center', zIndex: 1, justifyContent: 'center', borderRadius: 8, marginTop: 5, borderColor: '#6A6967', borderWidth: 0.8}}>
                <View style={{ flexDirection: 'row'}}>
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
                        onFocus={() => setSideBar(false)}
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
                    <DatePicker
                        title={"SELECCIONA L'HORA A LA QUE DESITJES FER LA RUTA"}
                        confirmText={"Confirmar"}
                        cancelText={"Cancelar"}
                        modal
                        open={open}
                        date={date}
                        mode={'time'}
                        locale={'es-ES'}
                        is24hourSource={'locale'}
                        onConfirm={(date) => {
                            setOpen(false)
                            setDate(date)
                        }}
                        onCancel={() => {
                            setOpen(false)
                        }}
                    />

                    <Spinner
                        visible={isLoading}
                        textContent={'CARREGANT RUTES...'}
                        textStyle={{size: 20, color: 'black'}}
                    />

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
                        onFocus={() => setSideBar(false)}
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
                        onFocus={() => setSideBar(false)}
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
            <View style={{paddingTop: 5, width: '100%', alignItems: 'center'}}>
                <Pressable 
                style={{alignItems: 'center', width: '60%', backgroundColor: '#F0ECEB', padding: 8, zIndex: 999, borderRadius: 10, borderColor: 'black', borderWidth: 0.5}} 
                onPress={searchRoutes}>
                <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>APLICAR FILTRES</Text>
            </Pressable>
            </View>
            </View>
        </View>
        
    );
}

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        width: '33%',
        borderColor: 'black',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingLeft: 0,
      },
      icon: {
       marginRight: 10,
       height: 20,
       width: 20
      },
      placeholderStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        justifyContent: 'center',
        color: 'black'
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
      
});

export default Dropdowns