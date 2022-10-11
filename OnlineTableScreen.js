import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class OnlinetableScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '線上表單',
    };
  };

  async fetchList(){
    var classInstance = this;
    this.downloadedmission = await AsyncStorage.getItem('@SJH:downloadedmission');

    if (this.downloadedmission !== null && this.downloadedmission != "" ){
      //console.warn(this.downloadedmission);
      classInstance.setState({
        dataSource: JSON.parse(this.downloadedmission),
        isLoading: false
      })
    }
    else{
        Alert.alert(
          '警告',
          '請先至個人設定中下載表單',
          [
            //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: '確定', onPress: () => {
              console.log('OK Pressed');
              classInstance.props.navigation.pop();
            }},
          ],
          { cancelable: false }
        );
    }
  }

  constructor(props) {
    super(props)
    this.fetchList();
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    this.todayString = "現在時間：\n"+year+"年"+month+"月"+date+"日";
    this.state = { isLoading: true}
  }


  async GetFlatListItem (CNo, name) {
    //console.warn(CNo);
    var usertoken = await AsyncStorage.getItem('@SJH:usertoken');
    this.props.navigation.navigate('LoadWebView', {link: 'http://'+global.server_ip+'/Mobile_Login.aspx?login='+usertoken+'&page=4&cno='+CNo, title: name});
  }

  parseTime(datetimeString) {
    var datetimeArray = datetimeString.split(' ');
    if (datetimeArray.length < 2) {
      return '日期時間格式有錯。'
    }
    else{
      var timeArray  = datetimeArray[1].split(':');
      if (timeArray.length < 3) {
          return '時間格式有錯。'
      }
      else{
        return timeArray[0]+":"+timeArray[1];
      }
    }
  }

  onPressQRCodeScan (CNo, name, qrcode, isarrived) {
    //console.warn(CNo);
    this.props.navigation.navigate('ScanQRCodeAndUploadGPS', {qrcode: qrcode, cno: CNo, isarrived: isarrived});
  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 0,
          width: "100%",
          backgroundColor: "#607D8B",
        }}
      />
    );
  }
  /*
    onPressLogin = () => {
      var classInstance = this;
      //this.props.navigation.navigate('LoadWebView', {link: 'http://'+global.server_ip+'/Mobile_Login.aspx?login=9DDAEBE19D3B1D85&page=3', title: '行程表'});
      //const xml2js = require('react-native-xml2js');
      //const parseString = new xml2js.Parser({async: false}).parseString;
      const parseString = require('react-native-xml2js').parseString;
      var agentid = this.state.username;
      var agentpassword = this.state.password;



    }*/

    _renderItem = ({item}) => (

      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.item} onPress={this.GetFlatListItem.bind(this, item.$.CNo, item.$.ServiceName)}>{this.parseTime(item.$.Time_01)}{"\n"}{item.$.Cust_Name}</Text>
      </View>
      /*<Text style={styles.item} onPress={this.GetFlatListItem.bind(this, item.$.CNo, item.$.ServiceName)}>{item.$.ServiceName}</Text>*/
      /*<Text style={styles.item2}   onPress={this.onPressQRCodeScan.bind(this, item.$.CNo, item.$.ServiceName, item.$.QR_Code, true)}>到</Text><Text style={styles.item2}   onPress={this.onPressQRCodeScan.bind(this, item.$.CNo, item.$.ServiceName, item.$.QR_Code, false)}>離</Text>*/
    );

  render() {

    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
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
        <Text
          style={{
            fontSize: 20,
            color: 'red',
            fontWeight: 'bold',
            paddingTop: 10}}>{this.todayString}</Text>
          <FlatList
            data={this.state.dataSource}
            ItemSeparatorComponent = {this.FlatListItemSeparator}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index}
          />
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
  item: {
    width: '90%',
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 10,
    fontSize: 20,
    textAlign: 'center',
    //height: 44,
    backgroundColor: 'white',
    color: '#4cb8c4',

  },
  item2: {
    width: '15%',
    //height: '80%',
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 30,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 0,
    marginRight: 10,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    //height: 44,
    backgroundColor: 'white',
    color: '#4cb8c4',

  },
});

 export default OnlinetableScreen;
