import React, { useEffect } from 'react'
import { View, Text, Button } from 'react-native'
import { StyleSheet, Pressable } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

const InfoRoute = ({ setShowInfo, infoRoute, setStartRoute, setSideBar }) => {
    // console.log(infoRoute[2])
    const addZero = (i) => {
        if (i < 10) { i = "0" + i }
        return i;
    }

    state = {
        tableData: [
            ['Distància a caminar', infoRoute[0] === undefined ? '-' : infoRoute[0].toFixed(2) + ' km'],
            ['Nivell contaminació', (infoRoute[3] === undefined ? '-' : infoRoute[3].day === 'AVUI' ? "Qualitat d'aire " + ((infoRoute[1] <= 50) ? 'BONA: ' : ((infoRoute[1] > 50) && (infoRoute[1] <= 100)) ? 'MODERADA:\n' : ((infoRoute[1] > 100) && (infoRoute[1] <= 149)) ? 'DOLENTA:\n' : 'MOLT DOLENTA:\n') : "Disponible nomes per l'opció AVUI") + (infoRoute[3] === undefined ? '' : infoRoute[3].day === 'AVUI' ? '(ICA ' + infoRoute[1] + ')' : '')],
            ['Previsió meteorlògica:\n' + (infoRoute[3] === undefined ? '-' : infoRoute[3].day) + ' ' + (infoRoute[3] === undefined ? '-' : addZero(infoRoute[3].time.getHours())) + ':' + (infoRoute[3] === undefined ? '-' : addZero(infoRoute[3].time.getMinutes())) + 'h', (infoRoute[3] === undefined ? '-' : infoRoute[3].forecast < 2 ? 'SENSE PLUJA' : infoRoute[3].forecast >= 2 && infoRoute[3].forecast <= 15 ? 'PLUJA LLEUGERA' : infoRoute[3].forecast > 15 && infoRoute[3].forecast <= 30 ? "PLUJA INTENSA" : "PLUJA MOLT INTENSA")],
            ['Sensació tèrmica: ' + (infoRoute[3] === undefined ? '-' : infoRoute[3].tempXafogor + 'ºC'), (infoRoute[3] === undefined ? '-' : infoRoute[3].tempXafogor < 10 ? 'MOLT FRED' : infoRoute[3].tempXafogor >= 10 && infoRoute[3].tempXafogor <= 18 ? 'FRED' : infoRoute[3].tempXafogor > 18 && infoRoute[3].tempXafogor <= 24 ? "CONFORT TÈRMIC" : infoRoute[3].tempXafogor > 24 && infoRoute[3].tempXafogor <= 30 ? "CALOR" : "MOLTA CALOR")]
        ]
    }

    const startRoute = () => {
        setSideBar(false)
        setShowInfo(false)
        setStartRoute(true)
    }

    const closeInfo = () => {
        setShowInfo(false)
    }
    // if (infoRoute[3] !== undefined) { infoRoute[3].tempXafogor = 22; }
    return (
        <>
            <View style={{ position: 'absolute', justifyContent: 'flex-end', bottom: 0, width: '98%', height: '110%', marginLeft: '1%', borderRadius: 20, marginBottom: 4 }}>
                {/* Componente de adverténcias cuando hay contaminación, lluvia y/o calor/frio */}
                {(infoRoute[1] > 100 || (infoRoute[3] !== undefined && infoRoute[3].forecast > 15) || (infoRoute[3] !== undefined && (infoRoute[3].tempXafogor <= 10 || infoRoute[3].tempXafogor >= 30))) && <View style={{ alignSelf: 'center', width: '65%', height: '15%', backgroundColor: '#F0ECEB', marginBottom: '3%', borderColor: 'red', borderWidth: 1.2, paddingTop: 5 }}>
                    <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold', paddingBottom: 10, alignSelf: 'center' }}>ATENCIÓ!</Text>
                    {infoRoute[1] > 100 && <Text style={{ fontSize: 15, color: 'black', fontWeight: 'bold', paddingBottom: 20, marginLeft: 10 }}>La qualitat de l'aire és {(infoRoute[1] > 100 && infoRoute[1] <= 149 ? 'DOLENTA' : 'MOLT DOLENTA')}</Text>}
                    {infoRoute[3] !== undefined && infoRoute[3].forecast >= 2 && <Text style={{ fontSize: 15, color: 'black', fontWeight: 'bold', marginLeft: 10 }}>Es preveu {(infoRoute[3] === undefined ? '-' : infoRoute[3].forecast >= 2 && infoRoute[3].forecast <= 15 ? 'PLUJA LLEUGERA' : infoRoute[3].forecast > 15 && infoRoute[3].forecast <= 30 ? "PLUJA INTENSA" : "PLUJA MOLT INTENSA")}</Text>}
                    {infoRoute[3] !== undefined && infoRoute[3].tempXafogor && <Text style={{ fontSize: 15, color: 'black', fontWeight: 'bold', marginLeft: 10 }}>Es preveu {(infoRoute[3] === undefined ? '-' : infoRoute[3].tempXafogor <= 10 ? 'MOLT FRED' : infoRoute[3].tempXafogor > 10 && infoRoute[3].tempXafogor <= 18 ? "FRED" : infoRoute[3].tempXafogor > 18 && infoRoute[3].tempXafogor <= 24 ? "BON TEMPS" : infoRoute[3].tempXafogor > 24 && infoRoute[3].tempXafogor <= 30 ? "CALOR" : "MOLTA CALOR")}</Text>}
                </View>}
                <View style={
                    // ICA < 50 i no plou i temp 18-24º --> VERD
                    (infoRoute[1] <= 50
                        && (infoRoute[3] !== undefined && infoRoute[3].forecast < 15
                            && (infoRoute[3].tempXafogor > 18 && infoRoute[3].tempXafogor < 24))) ? styles.containerGreen
                        // ICA 50-149 i/o plou moderat i/o temp 10-18/24-30 --> TARONJA
                        : ((infoRoute[3] !== undefined && (infoRoute[3].forecast > 15 && infoRoute[3].forecast <= 30) || (infoRoute[1] > 50 && infoRoute[1] <= 149)))
                            || (infoRoute[3] !== undefined && (infoRoute[3].tempXafogor > 10 && infoRoute[3].tempXafogor <= 18)
                                || (infoRoute[3] !== undefined && (infoRoute[3].tempXafogor >= 24 && infoRoute[3].tempXafogor <= 30))
                                && infoRoute[1] <= 149) ? styles.containerOrange
                            // ICA > 150 i/o pluja intensa i/o temp <10 o >30 --> VERMELL
                            : styles.containerRed}>
                    <Pressable
                        style={{ position: 'absolute', marginTop: 5, left: '91%', width: '8%', height: '8%', backgroundColor: 'black', borderRadius: 100 }}
                        onPress={closeInfo}>
                        <Text style={{ color: 'white', fontSize: 16, alignSelf: 'center', paddingTop: 1, fontWeight: 'bold' }}>X</Text>
                    </Pressable>
                    <Text style={styles.title}>DESCRIPCIÓ DE LA RUTA</Text>
                    <View style={styles.tableInfo}>
                        <Table>
                            <Rows textStyle={styles.tableData} data={this.state.tableData}></Rows>
                        </Table>
                        <Pressable
                            style={styles.btnStart}
                            onPress={startRoute}
                            accessibilityLabel="Learn more about this purple button">
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>COMENÇAR RUTA</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </>
    );

}

export default InfoRoute


const styles = StyleSheet.create({
    containerGreen: {
        backgroundColor: '#A8D77F',
        opacity: 1,
        borderWidth: 0.5,
        height: '42%',
        width: '100%',
        borderRadius: 8
    },
    containerOrange: {
        backgroundColor: '#ff7514',
        opacity: 1,
        borderWidth: 0.5,
        height: '42%',
        width: '100%',
        borderRadius: 8
    },
    containerRed: {
        backgroundColor: '#E93C32',
        opacity: 1,
        borderWidth: 0.5,
        height: '42%',
        width: '100%',
        borderRadius: 8
    },
    title: {
        fontWeight: 'bold',
        fontSize: 30,
        alignSelf: 'center',
        paddingVertical: 20,
        color: 'black'
    },
    tableInfo: {
        height: 720
    },
    tableData: {
        fontSize: 18,
        padding: 7,
        marginLeft: 20,
        fontWeight: '700',
        color: 'black'
    },
    btnStart: {
        alignItems: 'center',
        width: '50%',
        alignSelf: 'center',
        padding: 8,
        backgroundColor: '#F0ECEB', //C8E2E7 blau
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 0.5
    },
});
