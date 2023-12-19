import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';

import firebase from './src/firebaseConnection';

export default function App() {
  const [name, setName] = useState('Loading...');
  const [position, setPosition] = useState('');
  
  useEffect(() => {
    async function fetchData() {
      await firebase.database().ref('type').set('Client');
      await firebase.database().ref('type').remove();
      await firebase.database().ref('users').child(3).update({
        name: 'John',
      });
    }
    fetchData();
  }, []);

  async function register() {
    if (name !== '' && position !== '') {
      let users = await firebase.database().ref('users');
      let key = users.push().key;

      users.child(key).set({
        name: name,
        position: position,
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Name</Text>
      <TextInput
        style={styles.input}
        underlineColorAndroid="transparent"
        onChangeText={(text) => setName(text)}
      />

      <Text style={styles.text}>Position</Text>
      <TextInput
        style={styles.input}
        underlineColorAndroid="transparent"
        onChangeText={(text) => setPosition(text)}
      />

      <Button
        title="Add Employee"
        onPress={register}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});
