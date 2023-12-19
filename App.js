import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList } from 'react-native';
import Listing from './src/Listing';
import firebase from './src/firebaseConnection';

export default function App() {
  const [name, setName] = useState('Loading...');
  const [position, setPosition] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await firebase.database().ref('user').on('value', snapshot => {
        setUsers([]);
        snapshot.forEach(childItem => {
          let data = {
            key: childItem.key,
            name: childItem.val().name,
            position: childItem.val().position,
          };
          setUsers(oldArray => [...oldArray, data]);
        });
      });
    }
    fetchData();
  }, []);

  async function register() {
    if (name !== '' && position !== '') {
      let usersRef = await firebase.database().ref('users');
      let key = usersRef.push().key;

      usersRef.child(key).set({
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

      <FlatList
        keyExtractor={item => item.key}
        data={users}
        renderItem={({ item }) => (<Listing data={item}/>)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
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
