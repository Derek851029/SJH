import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  NetInfo,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Linking
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from "react-native-dialog";
import fetch from 'react-native-fetch-polyfill';
import Net from "@react-native-community/netinfo";

class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      dialogVisible: false, ip: "fet.joseph.org.tw:8087"}//"118.163.27.22:9000"}//118.163.27.22:8001
    var ipAddress = "";
    this.getValue(this);
  }
  //此功能是透過上方呼叫
  async getValue(classInstance){
    try {
      //const value = await AsyncStorage.getItem('@SJH:ip');

      var agentid = await AsyncStorage.getItem('@SJH:userid');
      var agentpassword = await AsyncStorage.getItem('@SJH:userpassword');
      var ip = await AsyncStorage.getItem('@SJH:ip');
          // const { navigate } = this.props.navigation
          // const resetAction = StackActions.reset({
          //   index: 0,
          //   actions: [
          //     NavigationActions.navigate({ routeName: 'Home' })
          //   ],
          //   key: null
          // });
          // this.props.navigation.dispatch(resetAction);
      //console.warn(value);
      /*if (value !== null || value != ""){
        classInstance.setState({ username: "TEST04", password: "TEST04",
        dialogVisible: false, ip: value});
        //return value;
      }
      else{
        classInstance.setState({ username: "TEST01", password: "TEST01",
        dialogVisible: false, ip: "118.163.27.22:9000"});
        //return "118.163.27.22:9000";
      }*/
      if (ip === null || ip == '') {
        //ip = 'fet.joseph.org.tw:8087';//'118.163.27.22:9000';
        //global.server_ip = 'fet.joseph.org.tw:8087';//'118.163.27.22:9000';
        ip = '220.130.248.55:8087';//'118.163.27.22:9000';
        global.server_ip = '220.130.248.55:8087';//'118.163.27.22:9000';
      }
      else{
        global.server_ip = ip;
        this.setState({ip: ip});
      }
      if (agentid !== null && agentid != "" && agentpassword !== null && agentpassword != "") {
          classInstance.setState({ username: agentid, password: agentpassword,
            dialogVisible: false, ip: ip});
          classInstance.onPressLogin();
      }
    } catch (error) {
      // Error retrieving data
    }
  }

    onPressLogin = async () => {
      var classInstance = this;
      //this.props.navigation.navigate('LoadWebView', {link: 'http://118.163.27.22:9000/Mobile_Login.aspx?login=9DDAEBE19D3B1D85&page=3', title: '行程表'});
      //const xml2js = require('react-native-xml2js');
      //const parseString = new xml2js.Parser({async: false}).parseString;
      const parseString = require('react-native-xml2js').parseString;
      var agentid = this.state.username;
      var agentpassword = this.state.password;
      var storage_agentid = await AsyncStorage.getItem('@SJH:userid');
      var storage_agentpassword = await AsyncStorage.getItem('@SJH:userpassword');
      if(storage_agentid != null && storage_agentpassword != null){
        agentid = storage_agentid
        agentpassword = storage_agentpassword
      }
      Net.fetch().then(state => {
        if(state.isConnected == false){
          Alert.alert(
            "警告:",
            "未偵測到網路，請確認是否連接網路",
            [
              { text: "OK", onPress: () => {}}
            ],
          );
        }
        else{
          fetch('http://'+global.server_ip+'/SNISResponse.asmx/Login',{
            timeout: 10000,
            method: 'POST',
            headers: {
              Accept: 'application/x-www-form-urlencoded',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'Agent_ID='+agentid+'&Agent_PWD='+agentpassword+'&API_KEY=kB3UxXV5fNywMh7&version=20210714',
          })
          .then(response => response.text())
          .then((response) => {
              parseString(response, async function (err, result) {
                if (result.response.Logins[0].Status) {
                  console.log(result.response.Logins[0].Status);
                  try {
                    await AsyncStorage.setItem('@SJH:userid', agentid);
                    console.log('123')
                    await AsyncStorage.setItem('@SJH:userpassword', agentpassword);
                    await AsyncStorage.setItem('@SJH:usertoken', result.response.Logins[0].Status[0].$.Login_status);
                    classInstance.setState({ username: "", password: ""});
                    //console.log(result.response.Logins[0].Status[0].$.Login_status);
                    Actions.reset('HomeScreen',{'ip': global.server_ip});
                    //console.warn("asyncstorage", agentid)
                  } catch (error) {

                    console.warn('fetch',error.message);
                    Alert.alert(
                      '錯誤',
                      '伺服器發生錯誤',
                      [
                        //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: '確定', onPress: () => console.log('OK Pressed')},
                      ],
                      { cancelable: false }
                    );
                    console.warn("asyncstorage", error.message)
                  }

                    //dzI6me1z5j0:APA91bHpj7hNMskCiwzHwTiHOg7l9-pURMvvA8SCpMu1p6TvGYQIzkDw6g5hghllYJhk4c1N95U0OblFCWkyspPUYyqH4NTNXG3wRqm_Qs7FMb-WUKiZOSye1go4sKoWm6HKTnoxVzSQ
                    ////const fcmToken = await firebase.messaging().getToken();
                    //console.error(fcmToken);

                    /*if (fcmToken) {//firebase暫不會用到
                        var devicePlatform = 'ALL';
                        if (Platform.OS == 'ios') {
                          devicePlatform = 'IOS'
                        }
                        else if (Platform.OS == 'android') {
                          devicePlatform = 'Android'
                        }
                        fetch('http://'+global.server_ip.split(':')[0]+':8001/Notify/api/Notify/'+devicePlatform+'/registry',{
                          timeout: 10000,
                          method: 'POST',
                          headers: {
                            Accept: 'application/x-www-form-urlencoded',
                            'Content-Type': 'application/x-www-form-urlencoded',
                          },
                          body: 'TelNo='+agentid+'&RegistryID='+fcmToken,
                        })
                          .then(response => response.text())
                          .then((response) => {
                            console.warn(response);
                          })
                          .catch((err) => {
                                              //this.props.navigation.navigate('Home');
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
                          })*/
                    /*} else {//firebase暫用不到
                        // user doesn't have a device token yet
                        console.warn('fetch', err.message);
                        Alert.alert(
                          '錯誤',
                          '無法取得手機通知訊息辨識碼',
                          [
                            //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {text: '確定', onPress: () => console.log('OK Pressed')},
                          ],
                          { cancelable: false }
                        );
                    }*/

                    ///*const enabled = await firebase.messaging().hasPermission();
                    /*if (enabled) {//firebase暫不會用到
                        // user has permissions
                        //console.warn('alreadyok')
                        //classInstance.props.navigation.navigate('Home');
                        const resetAction = StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: 'Home' })],
                            });
                        classInstance.props.navigation.dispatch(resetAction);

                    } else {
                      try {
                          await firebase.messaging().requestPermission();
                          //console.warn('ok')
                          //classInstance.props.navigation.navigate('Home');

                          const resetAction = StackActions.reset({
                                  index: 0,
                                  actions: [NavigationActions.navigate({ routeName: 'Home' })],
                              });
                          classInstance.props.navigation.dispatch(resetAction);
                          // User has authorised
                      } catch (error) {
                          // User has rejected permissions
                          //console.warn('nook')
                      }
                    }*/
                }
                else {
                  var login_status = result.response.Logins[0].Login_status[0];
                  if (login_status.$.success == 'False') {
                    Alert.alert(
                      '錯誤',
                      login_status.$.msg,
                      [
                        //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: '確定', onPress: () => Linking.openURL('https://drive.google.com/file/d/14QHSpdfeLVqPmSkCdr70ENKlOC4d02cq/view?usp=sharing')},
                      ],
                      { cancelable: false }
                    );
                    //throw new Error('break the chain');
                  }
                }
              });
          })
          .catch((err) => {
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
      })

    }
    onPressCancel = () => {
      //this.state.password = "";
      this.setState({password: "", username: ""})
    }
    onPressChangeIp = () => {
          this.setState({ dialogVisible: true });
    }

    handleCancel = () => {

        this.setState({ dialogVisible: false });
    }

    handleConfirm = async () => {
          await AsyncStorage.setItem('@SJH:ip', this.state.ip);
          global.server_ip = this.state.ip;
          this.setState({ dialogVisible: false });
    }

    handleDefault = () => {

      this.setState({ip: "fet.joseph.org.tw:8087"});//"118.163.27.22:9000"});
    }

  render() {
    return (
      <SafeAreaView style={styles.container}>
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
              top: 50,
              bottom: 0,
              flex: 1 }}
        >

<KeyboardAvoidingView
  //keyboardVerticalOffset = {Header.HEIGHT + 20}
  //keyboardVerticalOffset={Platform.select({ios: Header.HEIGHT + 20, android: 500})}
  style = {{ flex: 1 }}
  behavior= {(Platform.OS === 'ios')? "padding" : null} >
<ScrollView>
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>網址設定</Dialog.Title>
          <Dialog.Description>
            請輸入欲修改的網址。
          </Dialog.Description>
          <Dialog.Input onChangeText={(ip) => this.setState({ip})}
          value={this.state.ip}>
          </Dialog.Input>
          <Dialog.Button label="回復預設" onPress={this.handleDefault} />
          <Dialog.Button label="取消" onPress={this.handleCancel} />
          <Dialog.Button label="確定" onPress={this.handleConfirm} />
        </Dialog.Container>

          <View style={{width: '100%', height: '16%', flexDirection: 'row', justifyContent: 'center'}}>
            <Image
              source={require('./assets/images/logoSJH.png')}
              style={{width: 75, height: 75, marginTop: 10}}>
            </Image>

                          <View style={{position: 'absolute', right:10, flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',}}>
                            <TouchableHighlight style={{}} onPress={this.onPressChangeIp}>
                              <View style={{flexDirection: 'row', justifyContent: 'center',  alignItems: 'center',}}>
                                <Text
                                  style={{
                                    fontSize: 20,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    paddingTop: 10}}>
                                  網址設定
                                </Text>
                              </View>
                            </TouchableHighlight>
                          </View>
          </View>
          <View style={{width: '100%', height: '84%', paddingLeft: '10%', paddingRight: '10%', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch'}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold', }}>
              帳號
            </Text>
            <TextInput
              placeholder = "請輸入帳號" 
              placeholderTextColor = "gray"
              style={{height: 40, borderColor: 'gray', borderWidth: 2}}
              onChangeText={(username) => this.setState({username})}
              value={this.state.username}
              //value='Htest'
            />

            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                paddingTop: '10%'}}>
              密碼
            </Text>
            <TextInput
              placeholder = "請輸入密碼" 
              placeholderTextColor = "gray"
              style={{height: 40, borderColor: 'gray', borderWidth: 2}}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              //value='Htest'
              secureTextEntry = {true}
            />
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch'}}>
              <TouchableOpacity style={{
                margin: 20,
                padding: 10,
                paddingLeft: 20,
                paddingRight: 20,
                backgroundColor: '#406E9F',
                borderRadius: 9,
                width: '40%',
                alignItems: 'center',
                justifyContent: 'center',}} onPress={()=>this.onPressLogin()}>
                <Text style={{color: '#ffffff', fontSize: 18}}> 登入 </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                margin: 20,
                padding: 10,
                paddingLeft: 20,
                paddingRight: 20,
                backgroundColor: '#406E9F',
                borderRadius: 9,
                width: '40%',
                alignItems: 'center',
                justifyContent: 'center',}} onPress={this.onPressCancel}>
                <Text style={{color: '#ffffff', fontSize: 18}}> 取消 </Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}><Text style={{color: 'red'}}>提醒: 第一次下載APP請輸入帳號和密碼進行登入</Text></View>
            <View style={{flex: 1}}><Text style={{color: 'red'}}>若無使用登出功能，請直接按登入進入功能選單</Text></View>
          </View>
</ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
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

 export default LoginScreen;