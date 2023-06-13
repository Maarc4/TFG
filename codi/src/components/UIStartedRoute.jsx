import { View, TextInput, Alert, StyleSheet, Text, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Stopwatch } from 'react-native-stopwatch-timer';
import Icon from 'react-native-vector-icons/Ionicons';
import { postIncidencia } from '../api/routes/incidencies';
import Retroaccio from '../components/Retroaccio';

export const UIStartedRoute = ({ setEndedRoute, setStartRoute, coords, route_id, showPopup, setShowPopup}) => {
  const [currentTime, setCurrentTime] = useState(0)
  const [showDisclaimerRetroaccio, setShowDisclaimerRetroaccio] = useState(true)
  const [showDisclaimerRetroaccioFinalRuta, setShowDisclaimerRetroaccioFinalRuta] = useState(true)
  const [stopwatchStart, setStopwatchStart] = useState(true)
  const [stopwatchReset, setStopwatchReset] = useState(false)


  useEffect(() => {
    showDisclaimerRetroaccio && disclaimerRetroaccio();
  }, [])

  const getFormattedTime = (time) => {
    setCurrentTime(time);
  };

  const disclaimerRetroaccio = () => {
    console.log("Disclaimer retro")
    return (
      Alert.alert("Avís ciència ciutadana!", "Durant la ruta trobarás adalt a la dreta un botó per a donar retroacció sobre la ruta en qualsevol moment (com ara si està en mal estat, hi ha algún element bloquejant el pas, etc.) i un grup d'experts ho revisarà. Moltes gràcies per la seva colaboració. ", [
        { text: "D'ACORD", onPress: () => setShowDisclaimerRetroaccio(false) }
      ])
    );
  }

  const disclaimerRetroaccioFinalRuta = () => {
    console.log("Disclaimer retro final")
    return (
      Alert.alert(
        "Avís ciència ciutadana!",
        "Enhorabona, has finalitzat la ruta. La ruta estava en bon estat? En cas de clicar NO, podries omplir la següent informació?",
        [
          { text: "NO CONTESTAR", onPress: () => console.log("Cancel button pressed") },
          { text: "SI", onPress: () => {} },
          { text: "NO", onPress: () => {
            setShowDisclaimerRetroaccioFinalRuta(false);
            setShowPopup(true);
          }}
        ]
      )
    );
  }

  const endRoute = () => {
    return (
      Alert.alert("Ep, un moment!", "Estas segur que vols acabar la ruta?", [
        {
          text: "Cancelar",
          onPress: () => null,
          style: "cancel"
        },
        {
          text: "SORTIR", onPress: () => {
            disclaimerRetroaccioFinalRuta();
            setStartRoute(false);
            setEndedRoute(true);
          }
        }
      ])
    );
  }

  const handleReportButtonPress = () => {
    setShowPopup(true);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.stopwatchContainer}>
          <Stopwatch
            laps
            start={stopwatchStart}
            reset={stopwatchReset}
            options={options}
            getTime={getFormattedTime}
          />
        </View>
        <View>
          <Pressable
            style={styles.btnReport}
            onPress={handleReportButtonPress}
            accessibilityLabel="Learn more about this purple button"
          >
            <Text style={styles.btnText}>DONAR RETROACCIÓ</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Pressable
          style={styles.btnPause}
          onPress={() => setStopwatchStart(!stopwatchStart)}
          accessibilityLabel="Learn more about this purple button"
        >
          <Text style={styles.btnText}>
            {stopwatchStart ? "Pausar ruta" : "Reanudar ruta"}
          </Text>
        </Pressable>
        <Pressable
          style={styles.btnExit}
          onPress={endRoute}
          accessibilityLabel="Learn more about this purple button"
        >
          <Text style={styles.btnText}>SORTIR DE LA RUTA</Text>
        </Pressable>
      </View>
      {!stopwatchStart && (
        <Pressable
          style={styles.modalPause}
          onPress={() => setStopwatchStart(true)}
        >
          <Icon name="play" size={40} color="black" />
        </Pressable>
      )}
      {showPopup && <Retroaccio setShowPopup={setShowPopup} route_id={route_id} coords={coords} />}
    </>
  )
}

const options = {
  container: {
    backgroundColor: '#D9D9D9',
    padding: 5,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black'
  },
  text: {
    fontSize: 30,
    color: '#000',
    marginLeft: 7,
  }
};

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
