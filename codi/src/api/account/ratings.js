
import axios from "axios";
import { Alert } from "react-native";
import { BASE_URL_API } from "../constants";


export const postRating = async (user_id, route_id, stars, comment) => {
  var data = {
    // This is the body part
    user_id: user_id,
    route_id: route_id,
    stars: stars,
    comment: comment
  }
  var response = await axios({
    method: 'post',
    url: BASE_URL_API + '/rating',
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

export const updateCompletedRoutes = async (id) => {
  const updatedData = {
    n_completed_routes: 1 // Set to whatever value you want to increment by
  };
  var response = await axios({
    method: 'put',
    url: BASE_URL_API + `/account/${id}`,
    headers: { 'Content-Type': 'application/json' },
    data: updatedData
  }).then(response => {
    console.log(response.data);
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


export const fetchRatings = async (user_id) => {
  try {
    const response = await axios.get(`${BASE_URL_API}rating/${user_id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.ratings_list;
  } catch (error) {
    console.error(error);
    return [];
  }
};
