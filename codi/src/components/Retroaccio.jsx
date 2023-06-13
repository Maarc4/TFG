import { View, TextInput, Alert, StyleSheet, Text, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { postIncidencia } from '../api/routes/incidencies';

import CameraComponent from './CameraComponent';

export default function Popup({ setShowPopup, route_id, coords }) {
  const [reportType, setReportType] = useState(null);
  const [comment, setComment] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleReportPopupClose = () => {
    setShowPopup(false);
    setReportType(null);
    setSelectedOption(null);
  };

  const handleReportTypeChange = (type) => {
    setReportType(type);
  };

  const handleCommentChange = (text) => {
    setComment(text);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setComment("");
  };

  const handleReportSubmit = () => {
    try {
      postIncidencia(route_id, coords, reportType, comment, selectedImage)
    } catch (error) {
      console.log(error)
      console.log("ERROR AL POST INCIDENCIA UIStartedRoute.jsx")
    }
    setShowPopup(false)
  }

  return (
    <>
      <View style={styles.popupContainer}>
        <View style={styles.popup}>
          <Text style={styles.popupTitle}>Selecciona el tipo de reporte</Text>
          <View style={styles.popupOptions}>
            <Pressable style={[styles.popupOption, reportType === 'good' && styles.popupOptionSelected]} onPress={() => handleReportTypeChange('good')}>
              <Text style={styles.popupOptionText}>Ruta en buen estado</Text>
            </Pressable>
            <Pressable style={[styles.popupOption, reportType === 'bad' && styles.popupOptionSelected]} onPress={() => handleReportTypeChange('bad')}>
              <Text style={styles.popupOptionText}>Ruta en mal estado</Text>
            </Pressable>
            <Pressable style={[styles.popupOption, reportType === 'closed' && styles.popupOptionSelected]} onPress={() => handleReportTypeChange('closed')}>
              <Text style={styles.popupOptionText}>Ruta cerrada</Text>
            </Pressable>
            <TextInput
              style={styles.popupOption}
              onChangeText={handleReportTypeChange}
              placeholder="Otros: Especifica otro tipo de reporte"
            />
          <Text style={styles.popupTitle}>Añade comentario o foto del reporte</Text>

            <View style={styles.popupOptions}>
              <Pressable
                style={[
                  styles.popupOption,
                  selectedOption === "comment" && styles.popupOptionSelected,
                ]}
                onPress={() => handleOptionChange("comment")}
              >
                <Text style={styles.popupOptionText}>Añadir comentario</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.popupOption,
                  selectedOption === "photo" && styles.popupOptionSelected,
                ]}
                onPress={() => handleOptionChange("photo")}
              >
                <Text style={styles.popupOptionText}>Añadir foto</Text>
              </Pressable>
            </View>
            {selectedOption === "comment" && (
              <TextInput
                style={styles.textInput}
                multiline={true}
                onChangeText={handleCommentChange}
                value={comment}
                placeholder="Escribe tus comentarios aquí"
              />
            )}
            {selectedOption === "photo" && <CameraComponent selectedImage={selectedImage}  setSelectedImage={setSelectedImage}/>}
          </View>
          <View style={styles.popupButtonsContainer}>
            <Pressable style={[styles.popupButton, styles.popupButtonCancel]} onPress={() => handleReportPopupClose()}>
              <Text style={styles.popupButtonText}>Cancel·lar</Text>
            </Pressable>
            <Pressable style={[styles.popupButton, reportType ? styles.popupButtonActive : styles.popupButtonInactive]} onPress={() => handleReportSubmit()} disabled={!reportType}>
              <Text style={styles.popupButtonText}>Enviar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    height: 300,
    width: '100%',
    backgroundColor: 'none'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 30,
    position: 'absolute',
    bottom: 20,
    width: '100%'
  },
  btnPause: {
    backgroundColor: '#A17DFB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  btnExit: {
    backgroundColor: '#FF605F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  btnReport: {
    backgroundColor: '#5EBA7D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalPause: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popupContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popup: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  popupOptions: {
    marginBottom: 10,
  },
  popupOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    marginBottom: 10,
  },
  popupOptionText: {
    fontWeight: 'bold',
  },
  popupOptionSelected: {
    backgroundColor: '#5EBA7D',
    borderColor: '#5EBA7D',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    minHeight: 100,
  },
  textOther: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  popupButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  popupButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  popupButtonActive: {
    backgroundColor: '#5EBA7D',
  },
  popupButtonInactive: {
    backgroundColor: '#D3D3D3',
  },
  popupButtonCancel: {
    backgroundColor: 'red',
  },
  popupButtonText: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  btnReport: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#5EBA7D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
