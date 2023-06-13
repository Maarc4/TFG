import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { meteoToken, URL_METEO_DATA } from "../constants";

/**
 * Get forecast data from external API Meteocat. 3 Days forecast.
 * 
 * @param {*} time day and hour
 * @returns rain value forecast
 */
export const getForecastData = async (time) => {

  let response = null;
  let rainValue = null;
  let tempXafogor = null;

  await AsyncStorage.getItem('meteoData3', async (err, value) => {

    response = (JSON.parse(value));

    // there is data in cache && cache is expired
    if (response !== null && response['expireAt'] && new Date(response.expireAt) < (new Date())) {
      //clear cache
      AsyncStorage.removeItem('meteoData3');
      //update data to be null
      response = null;
    } else {
      console.log('read meteoData from cache');
    }
  });

  //update cache + set expire at date
  if (response === null) {
    console.log('cache new Date ');
    const options = {
      method: 'GET',
      url: URL_METEO_DATA,
      headers: { 'X-Api-Key': meteoToken, 'Content-type': 'application/json' },
    };
    try {
      response = await axios.request(options);
      rainValue = response.data.dies[time.day].variables.precipitacio.valor[time.hour].valor;
      tempXafogor = response.data.dies[time.day].variables.tempXafogor.valors[time.hour].valor;
      let expireAt = getExpire6h()
      const forecastData = JSON.stringify({ expireAt, rainValue, tempXafogor });

      AsyncStorage.setItem('meteoData3', forecastData);

      return forecastData;

    } catch (error) {
      console.error(error.message);
      return null;
    }
  }
  return response;
}

/**
*
* @returns {Date}
*/
const getExpire6h = () => {
  const now = new Date();
  let expireTime = new Date(now);
  expireTime.setHours(now.getHours() + 6);
  return expireTime;
}