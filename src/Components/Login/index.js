import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';

import firebase from '../../services/firebaseConnection';

export default function Login({ changeStatus }){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('login')
  
    function handleLogin(){
        if(type === 'login'){
            const user = firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
                changeStatus(user.user.uid)
            }).catch(error => console.error(error))
        }
        else{
            const user = firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
                changeStatus(user.user.uid)
            }).catch(error => console.error(error))
        }
    }
  
    return(
        <SafeAreaView style={styles.container}>
            <TextInput
                placeholder='Your email'
                style={styles.input}
                value={email}
                onChangeText={ text => setEmail(text)}
            />

            <TextInput
                placeholder='*******'
                style={styles.input}
                value={password}
                onChangeText={ text => setPassword(text)}
            />

            <TouchableOpacity
                style={[styles.handleLogin, { backgroundColor: type === 'login' ? 'blue' : '#141414'}]}
                onPress={handleLogin}
            >
                <Text>{type === 'login' ? 'Access' : 'Register'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={ () => setType(type => type === 'login' ? 'register' : 'login')}
            >
                <Text style={{textAlign: 'center'}}>{type === 'login' ? 'Create an account' : 'I already have an account'}</Text>
            </TouchableOpacity>
        </SafeAreaView>

  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop: 40,
        backgroundColor: '#F2f6fc',
        paddingHorizontal: 10,
      },
      input:{
        marginBottom: 10,
        backgroundColor: '#FFF',
        borderRadius: 4,
        height: 45,
        padding: 10,
        borderWidth: 1,
        borderColor: '#141414'
      },
      handleLogin:{
        alignItems: 'center',
        justifyContent:'center',
        height: 45,
        marginBottom: 10,
      },
      loginText:{
        color: '#FFF',
        fontSize: 17,
      }
})
