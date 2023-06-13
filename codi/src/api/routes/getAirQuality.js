import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseCoordinates } from "../../utils/routesHelpers";
import { airToken, URL_AIR_QUALITY } from "../constants"

/**
 * Get air quality data from external API.
 * 
 * @param {*} coordinates 
 * @returns AQI param indicating air quality
 */
export const getRouteAirQuality = async (coordinates) => {

    let response = null;
    let aqi = 0;
    let coordinates_formatted = null;

    await AsyncStorage.getItem('airData4', async (err, value) => {
        response = (JSON.parse(value));

        // there is data in cache && cache is expired
        if (response !== null && response['expireAt'] && new Date(response.expireAt) < (new Date())) {
          //clear cache
          await AsyncStorage.removeItem('airData4');
          //update data to be null
          response = null;
        } else {
          console.log('read airData from cache');
        }
    });
    //update cache + set expire at date
    if (response === null) {
        console.log('cache new Date AIRQ');
        coordinates_formatted = parseCoordinates(coordinates[0])
        const options = {
            method: 'GET',
            url: URL_AIR_QUALITY,
            params: {lat: coordinates_formatted[1].toString(), lng: coordinates_formatted[0].toString()},
            headers: {'x-api-key': airToken, 'Content-type': 'application/json'}
        };
        try{
            response = await axios.request(options)
            aqi = response.data.stations[0].AQI;
            aqi = aqi.toString()
            let expireAt = getExpire6h()
            const airData = JSON.stringify({expireAt, aqi}); 
            await AsyncStorage.setItem('airData4', airData);
            return airData
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
//     if (lastRequest == null || lastRequest > cacheExpiryTime) {

//         const options = {
//             method: 'GET',
//             url: URL_AIR_QUALITY,
//             params: {lat: coordinates_formatted[1].toString(), lng: coordinates_formatted[0].toString()},
//             headers: {'x-api-key': airToken, 'Content-type': 'application/json'}
//         };

//         await axios.request(options).then(async function (response) {
//             AQI = response.data.stations[0].AQI;
//             await AsyncStorage.setItem('airData', AQI.toString())
            
//         }).catch(function (error) {
//             console.log("error aqi")
//             console.error(error.message);
//         });
//         console.log('AQI: ' + AQI)
//         return AQI;
//     }

//     return lastRequest;
// }