import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import {Rating} from 'react-native-elements';
import { postRating, updateCompletedRoutes } from '../api/account/ratings';

export const Card = ({ rating }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Ruta: {rating.route_name}</Text>
      <Text style={styles.rating}>{rating.stars} estrellas</Text>
      {rating.comment && <Text style={styles.comment}>{rating.comment}</Text>}
    </View>
  );
};


export const ReviewCard = ({ userData, setEndedRoute, route_id}) => {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  console.log("routeid: "+route_id)
  console.log(stars)

  const handleCommentChange = (text) => {
    setComment(text);
  };

  const handleStarRatingChange = (rating) => {
    setStars(rating);
  };

  const handleSave = () => {
    try{
      postRating(userData.id, route_id, stars, comment)
      updateCompletedRoutes(userData.id)
    }catch (error){
      console.log(error)
      console.log("ERROR AL POST RATING Card.jsx")
    }
    setEndedRoute(false);
  };

  const handleCancel = () => {
    setEndedRoute(false);
  };
  return (
    <View style={styles_give_rating.container}>
      <Text style={styles_give_rating.title}>Puntua esta ruta</Text>
      <Text
        style={styles_give_rating.title}
        // value={title}
        value="TITULO PROVISIONAL"
      />
      <Rating
        count={5}
        showRating
        onFinishRating={handleStarRatingChange}
      />
      <TextInput
        style={styles_give_rating.input}
        placeholder="Añade un comentario (opcional)"
        onChangeText={handleCommentChange}
        value={comment}
      />
      <View style={styles_give_rating.buttonsContainer}>
        <TouchableOpacity style={styles_give_rating.cancelButton} onPress={handleCancel}>
          <Text style={styles_give_rating.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles_give_rating.saveButton} onPress={handleSave}>
          <Text style={styles_give_rating.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles_give_rating = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  saveButton: {
    backgroundColor: '#008000',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  comment: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});