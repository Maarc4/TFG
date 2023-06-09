// import ImagePicker from 'react-native-image-picker';
// // import { Storage } from '@google-cloud/storage';

// // Example for selecting an image and uploading to Google Cloud Storage
// ImagePicker.showImagePicker(options, async (response) => {
//   if (response.didCancel) {
//     console.log('User cancelled image picker');
//   } else if (response.error) {
//     console.log('ImagePicker Error: ', response.error);
//   } else {
//     // Handle the selected image
//     const { uri, type, fileName } = response;
//     console.log(uri, type, fileName)
//     // Upload the image to Google Cloud Storage
//     // const storage = new Storage();
//     // const bucket = storage.bucket('your-bucket-name');
//     // const file = bucket.file(fileName);

//     // await file.save(uri, {
//     //   contentType: type,
//     // });

//     const imageUrl = file.publicUrl();
//     // Save the image URL in the database
//   }
// });
// CameraComponent.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export default function CameraComponent() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCameraLaunch = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
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
  };

  const handleImageGalleryLaunch = () => {
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
    marginBottom:40,
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
  btnCamera:{
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