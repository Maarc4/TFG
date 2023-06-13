import axios from "axios";
import { Alert } from "react-native";
import { BASE_URL_API } from "../constants";
import RNFetchBlob from 'rn-fetch-blob';

export const postIncidencia = async (route_id, coords, reportType, comment, selectedImage) => {
  console.log(coords)
  console.log(selectedImage)
  if (selectedImage !== null) {
    var data = {
      // This is the body part
      route_id: route_id,
      coordenadas: JSON.stringify(coords),
      report_type: reportType,
      comment: comment,
      image_url: "https://retroaccionsfotos.blob.core.windows.net/fotos/" + selectedImage.fileName
    }
    // Send the image file to the server
    RNFetchBlob.fetch(
      'POST',
      BASE_URL_API + '/upload',
      {
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'image',
          filename: selectedImage.fileName,
          type: selectedImage.type,
          data: RNFetchBlob.wrap(selectedImage.uri),
        }
      ]
    )
      .then(response => {
        // Handle the response from the server if needed
        console.log("response", response)
      })
      .catch(error => {
        // Handle any errors that occur during the network request
        console.log(error);
      });
  } else {
    var data = {
      // This is the body part
      route_id: route_id,
      coordenadas: JSON.stringify(coords),
      report_type: reportType,
      comment: comment
    }
  }


  var response = await axios({
    method: 'post',
    url: BASE_URL_API + '/report',
    headers: { 'Content-Type': 'application/json' },
    data: data
  }).catch(function (error) {
    // Alert.alert("Error", "No s'ha pogut actualitzar el perfil, torni a intentar-ho", [
    //     { text: "OK" }
    // ]);
    console.log(error.response.data.message)
    Alert.alert("Error", error.response.data.message)
    return error
  });

  return response
}
