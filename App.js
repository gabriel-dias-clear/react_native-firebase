import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import firebase from './src/firebaseConnection';
import Login from './src/Components/Login';
import TaskList from './src/Components/TaskList';
let tasks = [
  {key: '1', name: 'Buy Coca Cola'},
  {key: '2', name: 'Study native' }
]

export default function App(){

  const [user, setUser] = useState(null)
  const [newTask, setNewTask] = useState()

  if(!user){
    return <Login changeStatus={user => setUser(user)}/>
  }

  return(
    <SafeAreaView style={styles.container}>
      <View style={styles.containerTask}>
        <TextInput
          style={styles.input}
          placeholder="What are you going to do today?"
          value={newTask}
          onChangeText={text => setNewTask(text)}
        />
        <TouchableOpacity style={styles.buttonAdd}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.key}
        renderItem={({item}) => (
          <TaskList data={item}/>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: '#F2f6fc'
  },
  containerTask:{
    flexDirection: 'row'
  },
  input:{
    flex:1, 
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#141414',
    height: 45,
  },
  buttonAdd:{
   backgroundColor: '#141414',
   height: 45,
   alignItems: 'center',
   justifyContent: 'center',
   marginLeft:  5,
   paddingHorizontal: 14,
   borderRadius: 4,
  },
  buttonText:{
    color: '#FFF',
    fontSize: 22,
  }
})
