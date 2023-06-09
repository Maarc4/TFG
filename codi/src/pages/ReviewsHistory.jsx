import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList } from 'react-native';
import { Appbar } from 'react-native-paper'
import Spinner from 'react-native-loading-spinner-overlay';

import { Card } from '../components/Card';
import { fetchRatings } from '../api/account/ratings'


const ReviewsHistory = ({ navigation, userData, setUserData, fromSideBar }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [ratings, setRatings] = useState([])

  useEffect(() => {
    const getRatings = async () => {
      const fetchedRatings = await fetchRatings(userData.id);
      setRatings(fetchedRatings);
    };
    
    setIsLoading(true)
    getRatings();
    setIsLoading(false)
  }, [userData.email]);

  console.log(ratings)
  return (
    <>
      <Appbar style={{ backgroundColor: '#C8E2E7' }}>
        <Appbar.BackAction style={{ backgroundColor: 'white' }} onPress={() => navigation.navigate("Main")} />
        <Appbar.Content title="Historial puntuacions" />
      </Appbar>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={ratings}
          renderItem={({ item }) => <Card rating={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      </SafeAreaView>
      <Spinner
          visible={isLoading}
          textContent={'Carregant...'}
          textStyle={{size: 20, color: 'black'}}
      />
    </>
  );
};

export default ReviewsHistory;
