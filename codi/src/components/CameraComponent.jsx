import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { request, PERMISSIONS } from 'react-native-permissions';

export default function CameraComponent({ selectedImage, setSelectedImage }) {
  const [storagePermission, setStoragePermission] = useState('');

  useEffect(() => {
    checkStoragePermission();
  }, []);

  const checkStoragePermission = async () => {
    const status = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    setStoragePermission(status);
  };

  const handleCameraLaunch = () => {
    if (storagePermission === 'granted') {
      let options = {
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        saveToPhotos: true
      };
      launchCamera(options, (res) => {
        console.log('Response = ', res);
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.error) {
          console.log('ImagePicker Error: ', res.error);
        } else if (res.customButton) {
          console.log('User tapped custom button: ', res.customButton);
          alert(res.customButton);
        } else {
          setSelectedImage(res.assets[0]);
        }
      });
    } else {
      console.log('Storage permission not granted');
    }
  };

  const handleImageGalleryLaunch = () => {
    if (storagePermission === 'granted') {
      let options = {
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      launchImageLibrary(options, (res) => {
        console.log('Response = ', res);
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.error) {
          console.log('ImagePicker Error: ', res.error);
        } else if (res.customButton) {
          console.log('User tapped custom button: ', res.customButton);
          alert(res.customButton);
        } else {
          setSelectedImage(res.assets[0]);
        }
      });
    } else {
      console.log('Storage permission not granted');
    }
  };

  return (
    <View>
      <View style={styles2.container}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles2.image} />
        ) : (
          <Text style={styles2.noImageText}>Imagen no seleccionada</Text>
        )}
      </View>

      <View style={styles2.buttonsContainer}>

        <TouchableOpacity onPress={handleCameraLaunch} style={styles2.btnCamera}>
          <Text style={styles2.btnText}>Usar Camara</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleImageGalleryLaunch} style={styles2.btnCamera}>
          <Text style={styles2.btnText}>Abrir galeria</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles2 = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 40,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  noImageText: {
    fontSize: 16,
    marginBottom: 20,
  },
  btnCamera: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  btnText: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 30,
    position: 'absolute',
    bottom: 20,
    width: '100%'
  },
});