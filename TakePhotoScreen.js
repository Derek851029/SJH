import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import Base64 from './Base64.js'
import fetch from 'react-native-fetch-polyfill';
import ImagePicker from 'react-native-image-picker';
class TakePhotoScreen extends React.Component {

  base64ToBlob(base64, mime)
  {
      mime = mime || '';
      var sliceSize = 1024;
      var byteChars = Base64.atob(base64);
      var byteArrays = [];

      for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
          var slice = byteChars.slice(offset, offset + sliceSize);

          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
          }

          var byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, {type: mime});
  }

  newFilename(d) {
      function pad(n) {return n<10 ? '0'+n : n}
      return d.getUTCFullYear()+''
           + pad(d.getUTCMonth()+1)+''
           + pad(d.getUTCDate())+''
           + pad(d.getUTCHours())+''
           + pad(d.getUTCMinutes())+''
           + pad(d.getUTCSeconds())+''
           + '_' + this.makeRandomString(10)
           + '.jpg'
  }
  makeRandomString(number) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < number; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  constructor(props) {
    super(props)
    var classInstance = this;
    this.state = { avatarSource: '', cno: this.props.navigation.getParam('cno', ''), imageName: '', isProgress: false}
    console.warn(this.state);
    // More info on all the options is below in the README...just some common use cases shown here
    var options = {
      title: '選擇相片',
      //customButtons: [
      //  {name: 'fb', title: 'Choose Photo from Facebook'},
      //],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info below in README)
     */
    //ImagePicker.showImagePicker(options, (response) => {
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);
      this.setState({isProgress : true});

      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.props.navigation.goBack();
      }
      else if (response.error) {
        Alert.alert(
          '拍照記錄',
          response.error,
          [
            //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: '確定', onPress: () => classInstance.props.navigation.goBack()},
          ],
          { cancelable: false }
        );
        console.log('ImagePicker Error: ', response.error);
      }
      /*else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }*/
      else {

        var d = new Date();
        var newImageName = this.newFilename(d);

        var photoTaken = {
            uri: response.uri,
            type: 'image/jpeg',
            name: newImageName,
        };
        this.setState({
          imageName: newImageName
        });
        let source = { uri: response.uri };
        var data = new FormData()
        data.append('image', photoTaken)//this.base64ToBlob(response.data, 'image/jpeg'), 'aaaa.png')
        //console.warn("DD"+data);
        data.append('title', newImageName)
        fetch('http://fet.joseph.org.tw:8088/image/',{
        //fetch('http://118.163.27.22:5888/image/',{
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: data,
        })
          .then(response => response.text())
          .then((response) => {
              fetch('http://'+global.server_ip+'/SNISResponse.asmx/Upload_Image',{
                timeout: 10000,
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'CNo='+classInstance.state.cno+'&Image='+classInstance.state.imageName+'&API_KEY=kB3UxXV5fNywMh7',
              })
              .then(response => {
                Alert.alert(
                  '拍照記錄',
                  '上傳完成',
                  [
                    //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: '確定', onPress: () => classInstance.props.navigation.goBack()},
                  ],
                  { cancelable: false }
                );
                this.setState({ isProgress: false })
              })
              .catch((err) => {
                  console.warn('innerFetchError', err.message)
                  this.setState({ isProgress: false })
              })
          })
          .catch((err) => {
              console.warn('fetchError', err.message)
              this.setState({ isProgress: false })
          })
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        //console.warn(response.uri);
        this.setState({
          avatarSource: source
        });
        this.setState({ isProgress: false })
      }
    });
  }



  render() {
    /*if (this.state.isProgress) {
      return (
        <View style={{flexDirection: 'row',justifyContent: 'space-around',}}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      );
    }
    else{*/
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
            <Image source={this.state.avatarSource} style={{width:'100%'}} />
          </View>
            <View style={{flexDirection: 'row',justifyContent: 'space-around',}}>
              <ActivityIndicator size="large" color="#000000" />
            </View>
        </View>
      );
    }
  //}
}

const CustomProgressBar = ({ visible }) => (
  <Modal onRequestClose={() => null} visible={visible}>
    <View style={{ flex: 1, backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 }}>
        <Text style={{ fontSize: 20, fontWeight: '200' }}>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
});

 export default TakePhotoScreen;
