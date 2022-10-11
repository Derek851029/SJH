import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  WebView,
  View,
  Alert,
} from 'react-native';

import fetch from 'react-native-fetch-polyfill';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoadLocalWebView extends React.Component {
  webview: WebView
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', ''),
    };
  };

  loadData = async () => {
    var name = await AsyncStorage.getItem('@SJH:membername');
    var gender = await AsyncStorage.getItem('@SJH:membergender');
    var phone = await AsyncStorage.getItem('@SJH:memberphone');
    var memberid = await AsyncStorage.getItem('@SJH:memberid');
    var caseid = await AsyncStorage.getItem('@SJH:caseid');caseid
    var now = new Date();
    var str_NowDate = (now.getFullYear()) + "/" + (now.getMonth() + 1) + "/" + now.getDate();
    this.webview.postMessage(JSON.stringify({name:name, memberid:memberid, caseid:caseid, phone:phone, gender:gender, str_NowDate:str_NowDate}))
  }

  onMessage(evt) {
    var classInstance = this;
    //Prints out data that was passed.
    const message = JSON.parse(evt.nativeEvent.data);
    //console.warn(message);
    //console.log(message);
    var urlDomain = '';
    switch (message.formidnumber) {
      case 'h1':
        urlDomain = 'Upload_CASE';
        break;
      case 'h2':
        urlDomain = 'Upload_IADL';
        break;
      case 'h3':
        urlDomain = 'Upload_SPMSQ';
        break;
      case 'h4':
        urlDomain = 'Upload_AD8';
        break;
      case 'h5':
        urlDomain = 'Upload_GDS';
        break;
      case 'h6':
        urlDomain = 'Upload_LongCare';
        break;
    }
    message.strAgentName = '';
    var m = new Date();
    var dateString =
        m.getUTCFullYear() + "-" +
        ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
        ("0" + m.getUTCDate()).slice(-2) + " " +
        ("0" + m.getUTCHours()).slice(-2) + ":" +
        ("0" + m.getUTCMinutes()).slice(-2) + ":" +
        ("0" + m.getUTCSeconds()).slice(-2);

    message.Fill_Date = dateString;
    delete message.formidnumber;

    var body = Object.keys(message).map(function(k) {
      //if (k != 'formidnumber') {
        return encodeURIComponent(k) + '=' + encodeURIComponent(message[k])
      //}
    }).join('&');

          const parseString = require('react-native-xml2js').parseString;
          fetch('http://'+global.server_ip+'/SNISResponse.asmx/'+urlDomain,{
            timeout: 10000,
            method: 'POST',
            headers: {
              Accept: 'application/x-www-form-urlencoded',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body,
          })
            .then(response => response.text())
            .then((response) => {
                parseString(response, async function (err, result) {
                  //if (result.response.Logins[0].Status) {
                      Alert.alert(
                        '離線表單',
                        '已送出',
                        //login_status.$.msg,
                        [
                          //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                          //classInstance.props.navigation.navigate('OfflineTableScreen')},//
                          {text: '確定', onPress: () => console.log('OK Pressed')},
                        ],
                        { cancelable: false }
                      );

                });
            })
            .catch(async (err) => {
              var offlinetables = await AsyncStorage.getItem('@SJH:offlinetables');
              if (offlinetables == null) {
                var sendobject = {urlDomain: urlDomain, body: body};
                var arrayObject = [];
                arrayObject.push(sendobject);
                await AsyncStorage.setItem('@SJH:offlinetables', JSON.stringify(arrayObject));
              }
              else{
                var arrayObject = JSON.parse(offlinetables);
                var sendobject = {urlDomain: urlDomain, body: body};
                arrayObject.push(sendobject);
                await AsyncStorage.setItem('@SJH:offlinetables', JSON.stringify(arrayObject));
              }
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
            })
  }

  render() {
    const { navigation } = this.props;
    const link = navigation.getParam('link', '');
    return (
      <View style={styles.container}>
        <WebView
          ref={w => this.webview = w}
          //url="h1.html"
          source={Platform.OS === 'ios' ? link : { uri: link }}
          //source={link}
          //useWebKit={false}
          //source={{ uri: 'https://github.com/facebook/react-native' }}
          //style={styles.video}
          dataDetectorTypes='none'
          onLoadEnd={this.loadData}
          originWhitelist={["file://"]}
          onMessage={this.onMessage}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
container: {
  flex: 1,
},
video: {
  flex: 1
}
});
 export default LoadLocalWebView;
