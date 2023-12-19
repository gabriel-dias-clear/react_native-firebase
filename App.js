import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList } from 'react-native';
import firebase from './src/firebaseConnection';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');

  async function login() {
    await firebase.auth().signInWithEmailAndPassword(email, password)
      .then(value => {
        alert('Welcome, ' + value.user.email);
        setUser(value.user.email);
      })
      .catch(error => {
        alert('Something went wrong');
      });
  }

  async function logout() {
    await firebase.auth().signOut();
    setUser('');
    alert('Successfully logged out');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Email</Text>
      <TextInput
        style={styles.input}
        underlineColorAndroid="transparent"
        onChangeText={(text) => setEmail(text)}
      />

      <Text style={styles.text}>Password</Text>
      <TextInput
        style={styles.input}
        underlineColorAndroid="transparent"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />

      <Button
        title="Login"
        onPress={login}
      />

      <FlatList
        keyExtractor={item => item.key}
        data={users}
        renderItem={({ item }) => (<Listing data={item} />)}
      />

      <Text>
        {user}
      </Text>
      {user.length > 0 && <Button
        title="Logout"
        onPress={logout}
      />}
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
