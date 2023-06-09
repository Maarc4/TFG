import axios from "axios";
import { Alert } from "react-native";
import { BASE_URL_API } from "../constants";

export const postIncidencia = async (route_id, coords, reportType, comment) => {
  console.log(coords)
  var data = {
    // This is the body part
    route_id: route_id,
    coordenadas: JSON.stringify(coords),
    report_type: reportType,
    comment: comment
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