import React,{ Component, useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  ActivityIndicator
} from 'react-native';
import WebView from 'react-native-webview';
import { Actions } from 'react-native-router-flux';
import BackgroundTimer from 'react-native-background-timer';

class LoadWebView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            link: 0,
        }
    }
    componentDidMount(){
      this.timer = BackgroundTimer.setTimeout(() => {
        Alert.alert('警告', '超過5分鐘未有任何操作，將回到上一頁');
        Actions.reset('HomeScreen');
      }, 300000);//300000
    }
    componentWillUnmount(){
      BackgroundTimer.clearTimeout(this.timer);
    }
    //進畫面後自動執行componentDidMount

  render() {
    const link = this.props.link;
    console.log(link);
    return (
      <View style={styles.container}>
        <WebView
          source={{uri: link}}
          style={styles.video}
          onError={() =>{Alert.alert(
            "警告:",
            "網路異常，請至訊號優良的地方或稍後重新嘗試",
            [
              { text: "OK", onPress: () => {Actions.pop()} }
            ],
          );}
          }
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
 export default LoadWebView;
