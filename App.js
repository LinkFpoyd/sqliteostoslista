import React, {useState, useEffect} from 'react';
import * as SQLite from 'expo-sqlite';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';

export default function App() {
  const [teksti, setTeksti] = useState('');
  const [amount, setAmount] = useState('');
  const [list, setList] = useState([]);

  const db = SQLite.openDatabase('coursedb.db');

  useEffect(() => { 
    db.transaction(tx => {
          tx.executeSql('create table if not exists ostokset (id integer primary key not null, teksti text, amount text);');  
         }, null, updateList);}, []);

  const lisaa = () => {
    db.transaction(tx => {
          tx.executeSql('insert into ostokset (teksti, amount) values (?, ?);',
            [teksti, amount]);
              }, null, updateList)
    clean()       
    }
  
  const clean = () => {
    setTeksti('');
    setAmount('');
  }

  const updateList = () => {
    db.transaction(tx => {
          tx.executeSql('select * from ostokset;', [], (_, { rows }) =>
                setList(rows._array)
                        );
                         } , null, null);
    }


  const clearAll = () =>{
    db.transaction(tx => {
      tx.executeSql('drop table ostokset;');  
     }, null, null)
    db.transaction(tx => {
      tx.executeSql('create table if not exists ostokset (id integer primary key not null, teksti text, amount text);');  
     }, null, updateList)
  }
  

  const deleteItem = (id) => {
    db.transaction(tx => {tx.executeSql('delete from ostokset where id = ?;'
    , [id]);}, null, updateList) 
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder='Product' textAlign={'center'} onChangeText={input => setTeksti(input)} value={teksti}/>
      <TextInput style={styles.input} placeholder='Amount' textAlign={'center'} onChangeText={input => setAmount(input)} value={amount}/>
      <View style={styles.button}>
        <Button onPress={lisaa} title='Add to list'/>
        <Button onPress={clearAll} title='Clear all'/>
      </View>
      <Text style={styles.text}>Shopping List:</Text>
      <FlatList 
        data={list}
        renderItem={({ item }) =>
        <View style={styles.list}> 
          <Text>{item.teksti}</Text>
          <Text style={{marginLeft: 10}}>{item.amount}</Text>
          <Text style={{color: '#0000ff', marginLeft: 10}} onPress={() => deleteItem(item.id)} >Done</Text>
        </View>
        }
        keyExtractor={(item, index) => index.toString()}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 150,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 200,
    height: 40,
    marginBottom: 2,
    borderColor: 'gray', 
    borderWidth: 1,
  },
  button: {
    flexDirection: 'row',
  },
  text: {
    color: 'blue',
    fontSize: 20,
    margin: 20,
  },
  list:{
    flexDirection: 'row',
    alignItems: 'center'
  }
});
