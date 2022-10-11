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

class TakePhotoTableListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '拍照記錄',
    };
  };

  async fetchList(){
    var classInstance = this;
    this.downloadedmission = await AsyncStorage.getItem('@SJH:downloadedmission');

    if (this.downloadedmission !== null && this.downloadedmission != "" ){
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
    this.state = { isLoading: true}
  }


  GetFlatListItem (CNo, name) {
    //console.warn(CNo);
    this.props.navigation.navigate('TakePhotoScreen', {cno:CNo});
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
          <FlatList
            data={this.state.dataSource}
            ItemSeparatorComponent = {this.FlatListItemSeparator}
            renderItem={({item}) => <Text style={styles.item} onPress={this.GetFlatListItem.bind(this, item.$.CNo, item.$.ServiceName)}>{item.$.ServiceName}</Text>}
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
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 20,
    //height: 44,
    backgroundColor: 'white',
    color: '#4cb8c4',

  },
});

 export default TakePhotoTableListScreen;
