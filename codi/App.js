import Main from './src/pages/Main.jsx'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import SignUp from './src/pages/SignUp.jsx'
import Inicio from './src/pages/Inicio.jsx'
import SignIn from './src/pages/SignIn.jsx'
import ReviewsHistory from './src/pages/ReviewsHistory.jsx'
import { Header } from './src/components/Header.jsx'

import React, {useState, useEffect} from 'react';
import { View, Text, Button, Pressable} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { SideBar } from './src/components/Sidebar.jsx'
import { UpdateProfile } from './src/pages/UpdateProfile.jsx'
import { Tutorial } from './src/pages/Tutorial.jsx'

const Stack = createNativeStackNavigator();

const App = () => {
  const [logged, setLogged] = useState(false)
  const [userData, setUserData] = useState([])
  const [sideBar, setSideBar] = useState(false)
  const [startRoute, setStartRoute] = useState(false);
  const [endedRoute, setEndedRoute] = useState(false)
  const [fromSideBar, setFromSideBar] = useState(false)
  return (
    <>
    <NavigationContainer>
            <Stack.Navigator headerShown={false} initialRouteName='Inicio'>
              <Stack.Screen name='Inicio' options={{ headerShown: false }}>{props => <Inicio {...props} logged={logged} setLogged={setLogged} setFromSideBar={setFromSideBar} />}</Stack.Screen>
                <Stack.Screen name='SignUp' options={{ headerShown: false }}>{props => <SignUp {...props} setLogged={setLogged} setUserData={setUserData} fromSideBar={fromSideBar}/>}</Stack.Screen>
                <Stack.Screen name='Tutorial' component={Tutorial} options={{headerShown: false}} />
                <Stack.Screen name='UpdateProfile' options={{ headerShown: false}}>{props => <UpdateProfile {...props} userData={userData} setUserData={setUserData} fromSideBar={fromSideBar}/>}</Stack.Screen>
                <Stack.Screen name='ReviewsHistory' options={{ headerShown: false}}>{props => <ReviewsHistory {...props} userData={userData} setUserData={setUserData} fromSideBar={fromSideBar}/>}</Stack.Screen>
                <Stack.Screen name='SignIn' options={{ headerShown: false }}>{props => <SignIn {...props} setLogged={setLogged} setUserData={setUserData} fromSideBar={fromSideBar}/>}</Stack.Screen>
                <Stack.Screen name='Main'
                options={{headerShown: false}}>{props => <Main {...props} userData={userData} sideBar={sideBar} setSideBar={setSideBar} logged={logged} setLogged={setLogged} startRoute={startRoute} setStartRoute={setStartRoute} endedRoute={endedRoute} setEndedRoute={setEndedRoute} setFromSideBar={setFromSideBar}/>}</Stack.Screen>
            </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}


export default App; 