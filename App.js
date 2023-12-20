import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList, Keyboard, useRef } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'

import firebase from './src/firebaseConnection';
import Login from './src/Components/Login';
import TaskList from './src/Components/TaskList';

export default function App(){

  const [user, setUser] = useState(null)
  const [newTask, setNewTask] = useState()
  const [tasks, setTasks] = useState([])
  const [key, setKey] = useState('')

  const inputRef = useRef(null)

  useEffect(() => {

    function getUser(){
      if(!user){
        return;
      }
      firebase.database().ref('tarefas').child(user).once('value', snap => {
        setTasks([]);
        snap?.forEach((childItem) => {
          let data = {
            key: childItem.key,
            nome: childItem.val().nome
          }
          setTasks(oldTasks => [...oldTasks, data])
        })
      })
    }

    getUser()
  
  }, [user])

  function handleAdd(){
    if(newTask === ''){
      return
    }
    if(key !== ''){
      firebase.database().ref('tarefas').child(user).child(key).update({
        nome: newTask
      }).then(snap => {
        const taskIndex = tasks.findIndex(item => item.key === key)
        let taskClone = tasks;
        taskClone[taskIndex].nome = newTask
        setTasks([...taskClone])
      })
      Keyboard.dismiss()
      setNewTask('');
      setKey('');
      
      return;
    }
    
    let tarefas = firebase.database().ref('tarefas').child(user);
    let chave = firebase.push().key;
    tarefas.child(chave).set({
      nome: newTask,
    }).then(() => {
      const data = {
        key: chave,
        nome: newTask
      };
      setTasks(oldTasks => [...oldTasks, data])
    })
    setNewTask('')
    Keyboard.dismiss()
  }

  function handleDelete(key){
    firebase.database().ref('tarefas').child(user).child(key).remove().then(snap => {
      const findTasks = tasks.filter( item => item.key !== key)
      setTasks(findTasks)
    })
  }

  function handleEdit(data){
    setKey(data.key)
    setNewTask(data.nome)
    inputRef.current.focus();
  }

  function cancelEdit(){
    setKey('')
    setNewTask('')
    Keyboard.dismiss()
  }

  if(!user){
    return <Login changeStatus={user => setUser(user)}/>
  }

  return(
    <SafeAreaView style={styles.container}>
      { key.length > 0 && 
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={cancelEdit}>
            <Feather name="x-circle" color="#FF0000" size={20}/>
          </TouchableOpacity>
          <Text style={{marginLeft: 5, color: '#FF0000'}}>Você está editando uma atividade!</Text>
        </View>
      }

      <View style={styles.containerTask}>
        <TextInput
          style={styles.input}
          placeholder="O que pretende fazer hoje?"
          value={newTask}
          onChangeText={text => setNewTask(text)}
          ref={inputRef}
        />
        <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.key}
        renderItem={({item}) => (
          <TaskList data={item} deleteItem={handleDelete} editItem={handleEdit}/>
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
    backgroundColor: '#FFFFFF',
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
    color: '#FFFFFF',
    fontSize: 22,
  }
})
