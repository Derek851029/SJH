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
import Dialog from "react-native-dialog";
import AsyncStorage from '@react-native-async-storage/async-storage';


class OfflineTableScreen extends React.Component {

  async fetchList(){
  }

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleOK = () => {
    this.setState({ dialogVisible: false });
    this.setMember();
    //console.warn(this.state.name);
    //console.warn(this.state.phone);
    //console.warn(this.state.gender);
  };

  async initMember(){
      await AsyncStorage.setItem('@SJH:membername', '');
      await AsyncStorage.setItem('@SJH:memberphone', '');
      await AsyncStorage.setItem('@SJH:membergender', '');
      await AsyncStorage.setItem('@SJH:memberid', '');
      await AsyncStorage.setItem('@SJH:caseid', '');
  }

  async setMember(){
      await AsyncStorage.setItem('@SJH:membername', this.state.name);
      await AsyncStorage.setItem('@SJH:memberphone', this.state.phone);
      await AsyncStorage.setItem('@SJH:membergender', this.state.gender);
      await AsyncStorage.setItem('@SJH:memberid', this.state.id);
      await AsyncStorage.setItem('@SJH:caseid', this.state.caseid);
  }

  constructor(props) {
    super(props)
    this.initMember();
    this.state = {
      dataSource: [
        /*{"name": "HC-5.居家護理-訪視紀錄表A", "index": "HC-5"},
        {"name": "HC-6A.潛在危機性皮膚完整性受損護理計畫", "index": "HC-6A"},
        {"name": "HC-6B.現存皮膚完整性受損.壓瘡", "index": "HC-6B"},
        {"name": "HC-6C.潛在危險性肺炎", "index": "HC-6C"},
        {"name": "HC-6D.現存皮膚完整性受損.胃造口", "index": "HC-6D"},
        {"name": "HC-6E.現存皮膚完整性受損.結腸造口", "index": "HC-6E"},
        {"name": "HC-6F.知識缺失.糖尿病", "index": "HC-6F"},
        {"name": "HC-6G.呼吸道清除功能失效", "index": "HC-6G"},
        {"name": "HC-7.(修改版)傷口護理紀錄單", "index": "HC-7"},
        {"name": "HC-9.居家醫療出診紀錄單", "index": "HC-9"},
        {"name": "HC-15.修改版工作性日常生活活動量表(IADL)", "index": "HC-15"},
        {"name": "HC-16.修改版科氏量表及巴氏量表", "index": "HC-16"},*/
        {"name": "個案資料輸入", "index": "input"},
        {"name": "個案日常生活評估量表", "index": "h1"},
        {"name": "工具性日常生活量表（IADL）", "index": "h2"},
        {"name": "SPMSQ認知功能量表", "index": "h3"},
        {"name": "記憶健檢(AD-8 極早期失智症篩檢量表)篩檢量表", "index": "h4"},
        {"name": "老人心理健康評估表(GDS-15)", "index": "h5"},
        {"name": "長照綜合評估量表", "index": "h6"},
      ],
      isLoading: false,
      dialogVisible: false,
      phone: '',
      name: '',
      gender: '',
      id: '',
      caseid: ''
    }
  }

  async GetFlatListItem (index, name) {
    var link;
    switch (index) {
      case 'input':
        this.setState({ dialogVisible: true });
        break;
      case 'h1':
        //link = require('./assets/offline_docs/h1.html');
        link = Platform.OS === 'ios' ? require('./assets/offline_docs/h1.html') : 'file:///android_asset/h1.html'
        this.props.navigation.navigate('LoadLocalWebView', {link: link, title: name});
        break;
      case 'h2':
        //link = require('./assets/offline_docs/h2.html');
        link = Platform.OS === 'ios' ? require('./assets/offline_docs/h2.html') : 'file:///android_asset/h2.html'
        this.props.navigation.navigate('LoadLocalWebView', {link: link, title: name});
        break;
      case 'h3':
        //link = require('./assets/offline_docs/h3.html');
        link = Platform.OS === 'ios' ? require('./assets/offline_docs/h3.html') : 'file:///android_asset/h3.html'
        this.props.navigation.navigate('LoadLocalWebView', {link: link, title: name});
        break;
      case 'h4':
        //link = require('./assets/offline_docs/h4.html');
        link = Platform.OS === 'ios' ? require('./assets/offline_docs/h4.html') : 'file:///android_asset/h4.html'
        this.props.navigation.navigate('LoadLocalWebView', {link: link, title: name});
        break;
      case 'h5':
        //link = require('./assets/offline_docs/h5.html');
        link = Platform.OS === 'ios' ? require('./assets/offline_docs/h5.html') : 'file:///android_asset/h5.html'
        this.props.navigation.navigate('LoadLocalWebView', {link: link, title: name});
        break;
      case 'h6':
        //link = require('./assets/offline_docs/h6.html');
        link = Platform.OS === 'ios' ? require('./assets/offline_docs/h6.html') : 'file:///android_asset/h6.html'
        this.props.navigation.navigate('LoadLocalWebView', {link: link, title: name});
        break;
      /*
      case 'HC-5':
        link = require('./offline_docs/HC-5.html');
        break;
      case 'HC-6A':
        link = require('./offline_docs/HC-6A.html');
        break;
      case 'HC-6B':
        link = require('./offline_docs/HC-6B.html');
        break;
      case 'HC-6C':
        link = require('./offline_docs/HC-6C.html');
        break;
      case 'HC-6D':
        link = require('./offline_docs/HC-6D.html');
        break;
      case 'HC-6E':
        link = require('./offline_docs/HC-6E.html');
        break;
      case 'HC-6F':
        link = require('./offline_docs/HC-6F.html');
        break;
      case 'HC-6G':
        link = require('./offline_docs/HC-6G.html');
        break;
      case 'HC-7':
        link = require('./offline_docs/HC-7.html');
        break;
      case 'HC-9':
        link = require('./offline_docs/HC-9.html');
        break;
      case 'HC-15':
        link = require('./offline_docs/HC-15.html');
        break;
      case 'HC-16':
        link = require('./offline_docs/HC-16.html');
        break;
      */
      default:

    }
    //this.props.navigation.navigate('LoadLocalWebView', {link: 'https://www.google.com', title: name});
    //this.props.navigation.navigate('LoadWebView', {link: 'http://'+global.server_ip+'/Mobile_Login.aspx?login='+usertoken+'&page=4&cno='+CNo, title: name});
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

  <View style={{flexDirection: 'row',}}>
  <Text style={styles.item} onPress={this.GetFlatListItem.bind(this, item.index, item.name)}>{item.name}</Text>
  </View>
);

 handleName = (name : string) => {
  this.setState({ name: name });
}
 handlePhone = (phone : string) => {
  this.setState({ phone: phone });
}
 handleGender = (gender : string) => {
  this.setState({ gender: gender });
}
 handleID = (id : string) => {
  this.setState({ id: id });
}
 handleCaseID = (caseid : string) => {
  this.setState({ caseid: caseid });
}

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
        renderItem={this._renderItem}
        keyExtractor={(item, index) => index}
        />
        </View>

        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>個案資料輸入</Dialog.Title>
          <Dialog.Input label="姓名" onChangeText={(name : string) => this.handleName(name)} value={this.state.name}></Dialog.Input>
          <Dialog.Input label="身分證號" onChangeText={(id : string) => this.handleID(id)} value={this.state.id}></Dialog.Input>
          <Dialog.Input label="性別" onChangeText={(gender : string) => this.handleGender(gender)} value={this.state.gender}></Dialog.Input>
          <Dialog.Input label="電話" onChangeText={(phone : string) => this.handlePhone(phone)} value={this.state.phone}></Dialog.Input>
          <Dialog.Input label="居服編號" onChangeText={(caseid : string) => this.handleCaseID(caseid)} value={this.state.caseid}></Dialog.Input>
          <Dialog.Button label="Cancel" onPress={this.handleCancel} />
          <Dialog.Button label="OK" onPress={this.handleOK} />
        </Dialog.Container>
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
    //height: 44,
    backgroundColor: 'white',
    color: '#4cb8c4',

  }
});

export default OfflineTableScreen;
