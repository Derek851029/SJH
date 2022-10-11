import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableHighlight,
  Alert
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetch from 'react-native-fetch-polyfill';

class SettingsScreen extends React.Component {

  async fetchList(){
    this.agentid = await AsyncStorage.getItem('@SJH:userid');
    var date = new Date();
    try{
      const parseString = require('react-native-xml2js').parseString;
      //this.a();
      if (this.agentid !== null){
        //console.warn(this.agentid);
        fetch('http://'+global.server_ip+'/SNISResponse.asmx/Dispatch_List',{
          timeout: 10000,
          method: 'POST',
          headers: {
            Accept: 'application/x-www-form-urlencoded',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'UserID='+this.agentid+'&Day=' + date.getFullYear() + ('0' + (date.getMonth()+1)).slice(-2) + ('0' + date.getDate()).slice(-2) +'&API_KEY=kB3UxXV5fNywMh7',
        })
          .then(response => response.text())
          .then((response) => {
            console.warn(response);
            parseString(response, async function (err, result) {
              console.warn(result);
              if (result.response.missions.length > 0 && result.response.missions[0] != '') {

                /*classInstance.setState({
                  dataSource: result.response.missions[0].mission,
                  isLoading: false
                })*/
                //console.warn ('response', result.response.missions[0].mission);
                //console.warn(result.response.missions[0].mission);

                try{
                  await AsyncStorage.setItem('@SJH:downloadedmission', JSON.stringify(result.response.missions[0].mission));

                  Alert.alert(
                    '下載表單',
                    '下載成功',
                    [
                      //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: '確定', onPress: () => console.log('OK Pressed')},
                    ],
                    { cancelable: false }
                  );
                } catch (e){
                  Alert.alert(
                    '結果',
                    '下載任務失敗',
                    [
                      //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: '確定', onPress: () => console.log('OK Pressed')},
                    ],
                    { cancelable: false }
                  );

                }
              }
              else {
                await AsyncStorage.setItem('@SJH:downloadedmission', '');
                Alert.alert(
                  '結果',
                  '沒有任何任務',
                  [
                    //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: '確定', onPress: () => console.log('OK Pressed')},
                  ],
                  { cancelable: false }
                );
              }
            });
          })
          .catch((err) => {
              console.warn('fetch', err.message)
          })
      }
    } catch (error) {
        console.warn('fetch', error.message)
    }
  }

  constructor(props) {
    super(props)
    //this.state = { isLoading: true}
    this.state = {offlineStatus: '傳送離線表單'};
    this.setValue();

  }

  async setValue(){

    var offlinetables = await AsyncStorage.getItem('@SJH:offlinetables');
    if (offlinetables != null) {
      var arrayObject = JSON.parse(offlinetables);
      this.setState({offlineStatus: '傳送離線表單('+arrayObject.length+')'});
    }
  }

  onPressDownloadTable = () => {
    //console.warn("download");
    this.fetchList();
  }
  onPressSendOffline = async () => {
    var classInstance = this;
    var offlinetables = await AsyncStorage.getItem('@SJH:offlinetables');
    if (offlinetables == null) {
      Alert.alert(
        '資訊',
        '沒有未傳的離線資料',
        [
          //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: '確定', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      );
    }
    else{
      /*
      while (offlinetables != null) {
        var arrayObject = JSON.parse(offlinetables);
        const parseString = require('react-native-xml2js').parseString;
        await fetch('http://'+global.server_ip+'/SNISResponse.asmx/'+arrayObject[0].urlDomain,{
          timeout: 10000,
          method: 'POST',
          headers: {
            Accept: 'application/x-www-form-urlencoded',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: arrayObject[0].body,
        })
        .then(response => response.text())
        .then(async (response) => {
          arrayObject.shift();
          if (arrayObject.length>0) {
            await AsyncStorage.setItem('@SJH:offlinetables', JSON.stringify(arrayObject));
          }
          else{
            await AsyncStorage.removeItem('@SJH:offlinetables');
          }
          console.warn('done');

        })
        .catch(async (err) => {
            Alert.alert(
              '錯誤',
              '伺服器發生錯誤',
              [
                //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: '確定', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            );
        })
        offlinetables = await AsyncStorage.getItem('@SJH:offlinetables');
      }*/
      let promiseArray = [];
      var arrayObject = JSON.parse(offlinetables);
      const parseString = require('react-native-xml2js').parseString;
      for (var i = 0; i < arrayObject.length; i++) {
        promiseArray.push(fetch('http://'+global.server_ip+'/SNISResponse.asmx/'+arrayObject[i].urlDomain,{
          timeout: 10000,
          method: 'POST',
          headers: {
            Accept: 'application/x-www-form-urlencoded',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: arrayObject[i].body,
        })
        .then(response => response.text())
        /*.catch(async (err) => {
            console.warn('fetch', err.message);
            Alert.alert(
              '錯誤',
              '伺服器發生錯誤',
              [
                //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: '確定', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            );
        })*/);
      }
      Promise.all(promiseArray)
      .then( function(response){
        Alert.alert(
          '資訊',
          '離線表單傳送完成',
          [
            //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: '確定', onPress: async () => {
              await AsyncStorage.removeItem('@SJH:offlinetables');
              classInstance.setState({offlineStatus: '傳送離線表單'});
              console.log('OK Pressed');
            }},
          ],
          { cancelable: false }
        );

      })
      .catch((err) => {
        console.warn('fetch', err.message);
        Alert.alert(
          '錯誤',
          '伺服器發生錯誤',
          [
            //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: '確定', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        );
      });
    }
/*
    if (offlinetables != null) {
      var arrayObject = JSON.parse(offlinetables);
      var arrayObjectForError = JSON.parse(offlinetables);


      for (var i = 0; i < arrayObject.length; i++) {

      }

    }
    else{
      Alert.alert(
        '資訊',
        '沒有未傳的離線資料',
        [
          //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: '確定', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      );
    }*/
  }

  onPressLogout = async () => {
    await AsyncStorage.removeItem("@SJH:userid");
    await AsyncStorage.removeItem("@SJH:userpassword");
    await AsyncStorage.removeItem("@SJH:usertoken");
    await AsyncStorage.removeItem("@SJH:downloadedmission");
    //this.props.navigation.popToTop();
    Actions.reset('LoginScreen');
  }

      render() {
        return (
          <View style={styles.container}>
            <ImageBackground
                source={require('./assets/images/background.png')}
                style={{ width: '100%',
                  height: 300,
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1 }}
            >
            </ImageBackground>
            <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  flex: 1 }}
            >

              <View style={{width: '100%', height: '5%', flexDirection: 'row', justifyContent: 'center'}}>
              </View>
              <View style={{width: '100%', height: '10%', flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableHighlight
                  style={{backgroundColor: 'white', width: '80%', height: '100%'}}
                  onPress={this.onPressDownloadTable}>
                  <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',}}>
                      下載表單
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={{width: '100%', height: '5%', flexDirection: 'row', justifyContent: 'center'}}>
              </View>
              <View style={{width: '100%', height: '10%', flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableHighlight
                  style={{backgroundColor: 'white', width: '80%', height: '100%'}}
                  onPress={this.onPressSendOffline}>
                  <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',}}>
                      {this.state.offlineStatus}
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>

              <View style={{width: '100%', height: '5%', flexDirection: 'row', justifyContent: 'center'}}>
              </View>
              <View style={{width: '100%', height: '10%', flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableHighlight
                  style={{backgroundColor: 'white', width: '80%', height: '100%'}}
                  onPress={this.onPressLogout}>
                  <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',}}>
                      登出
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>

              <View style={{width: '100%', height: '70%', flexDirection: 'row'}}>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  padding: 10,
                  bottom: 0}}>
                201912301700
              </Text>
              </View>

            </View>
          </View>
        );
      }
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

 export default SettingsScreen;
