import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { postRoute} from '../api/routes/saveRoute'

export const SaveRoute = ({ userData, infoRoute, setEndedRoute}) => {
    const [showPopup, setShowPopup] = useState(true);
    coordinates = infoRoute[2];
    const handleSaveRoute = () => {
        let coordsStr = "[";
        let step = 1;
        // Convertimos el array a string
        if (coordinates.length > 22) {
             step = Math.floor(coordinates.length / 10);
        }
        console.log("STEP:"+step)
        for (let i = 0; i < coordinates.length; i+=step) {
            coordsStr += "[";
            for (let j = 0; j < coordinates[i].length; j++) {
                coordsStr += coordinates[i][j].toString();
                coordsStr += ",";
            }
            coordsStr += "],";
        }
        coordsStr += "]";
        coordsStr = coordsStr.split(',]').join("]");
        
        // Logic to save the personalized route
        postRoute(infoRoute[0], coordsStr, userData)

        setShowPopup(false);
        setEndedRoute(false);
    };

    const handleCancel = () => {
        setShowPopup(false);
        setEndedRoute(false)
    };

    return (
        <View>
            <Modal visible={showPopup} animationType="slide" transparent={true}>
                <View style={styles.popup}>
                    <Text style={styles.title}>Guardar ruta personalizada?</Text>
                    <Text style={styles.message}>Quieres guardar esta ruta personalizada?</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSaveRoute} style={styles.saveButton}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    popup: {
        backgroundColor: '#fff',
        margin: 50,
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#f00',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: '#0f0',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

