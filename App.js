/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {Router, Scene} from 'react-native-router-flux';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen'
import LoadWebView from './LoadWebView'
import SettingsScreen from './SettingsScreen'
import OnlineTableScreen from './OnlineTableScreen'
import TakePhotoScreen from './TakePhotoScreen'
import TakePhotoTableListScreen from './TakePhotoTableListScreen'
import LoadLocalWebView from './LoadLocalWebView'
import OfflineTableScreen from './OfflineTableScreen'
import React, { Component } from 'react';
const RootStack = () =>
  {
    return(
      <Router>
      <Scene key="root">
          <Scene key="LoginScreen" component={LoginScreen} title="登入" initial></Scene>
          <Scene key="HomeScreen" component={HomeScreen} title="首頁"></Scene>
          <Scene key="LoadWebView" component={LoadWebView} title="LoadWebView"></Scene>
          <Scene key="SettingsScreen" component={SettingsScreen} title="SettingsScreen"></Scene>
          <Scene key="OnlineTableScreen" component={OnlineTableScreen} title="OnlineTableScreen"></Scene>
          <Scene key="TakePhotoScreen" component={TakePhotoScreen} title="TakePhotoScreen"></Scene>
          <Scene key="TakePhotoTableListScreen" component={TakePhotoTableListScreen} title="TakePhotoTableListScreen"></Scene>
          <Scene key="LoadLocalWebView" component={LoadLocalWebView} title="LoadLocalWebView"></Scene>
          <Scene key="OfflineTableScreen" component={OfflineTableScreen} title="OfflineTableScreen"></Scene>
      </Scene>
  </Router>
  )
};
export default class App extends React.Component {

  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    //BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
     // Build a channel
    // const channel = new firebase.notifications.Android.Channel('test-channel', 'SJH Channel', firebase.notifications.Android.Importance.Max)//firebase暫不用
    // .setDescription('SJH channel');//firebase暫不用
    //console.warn(channel);
    //console.log('sssaaa');
          //this.showLocalNotification();
          //this.scheduleLocalNotification();

    // Create the channel
 /*   firebase.notifications().android.createChannel(channel);//firebase暫不用

    firebase.notifications().getInitialNotification()
      .then((notificationOpen: NotificationOpen) => {
        if (notificationOpen) {
          // Get information about the notification that was opened
          const notif: Notification = notificationOpen.notification;
          this.setState({
            initNotif: notif.data
          })
          if(notif && notif.targetScreen === 'detail'){
            setTimeout(()=>{
              this.props.navigation.navigate('Detail')
            }, 500)
          }
        }
      });

      registerAppListener(this.props.navigation);

    if (!await firebase.messaging().hasPermission()) {
      console.warn('has no Permission')
      try {
        await firebase.messaging().requestPermission();
      } catch(e) {
        alert("Failed to grant permission")
      }
    }
    else{
      console.warn('hasPermission')
    }

    firebase.messaging().getToken().then(token => {
      console.log("TOKEN (getFCMToken)", token);
      this.setState({token: token || ""})

    });*/

    // topic example
    //firebase.messaging().subscribeToTopic('sometopic');
    //firebase.messaging().unsubscribeFromTopic('sometopic');

  /*
  FCM = firebase.messaging();
    FCM.requestPermissions();

    FCM.getFCMToken().then(token => {
      console.warn("TOKEN (getFCMToken)", token);
    });

    FCM.getInitialNotification().then(notif => {
      console.warn("INITIAL NOTIFICATION", notif)
    });

    this.notificationListner = FCM.on(FCMEvent.Notification, notif => {
      console.warn("Notification", notif);
      if(notif.local_notification){
        console.warn('local');
        return;
      }
      if(notif.opened_from_tray){
        console.warn('tray');
        return;
      }

      if(Platform.OS ==='ios'){
              //optional
              //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
              //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
              //notif._notificationType is available for iOS platfrom
              switch(notif._notificationType){
                case NotificationType.Remote:
                  notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                  break;
                case NotificationType.NotificationResponse:
                  notif.finish();
                  break;
                case NotificationType.WillPresent:
                  notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
                  break;
              }
      }
      this.showLocalNotification(notif);
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
      console.warn("TOKEN (refreshUnsubscribe)", token);
    });
    */
  }
/*
  showLocalNotification(notif) {
    console.warn("showLocal:"+notif);
    /*
    FCM = firebase.messaging();
    FCM.presentLocalNotification({
      title: notif.title,
      body: notif.body,
      priority: "high",
      click_action: notif.click_action,
      show_in_foreground: true,
      local: true
    });
    //* /
  }
*/
  // componentWillUnmount() {//暫用不到
  //   deRegisterAppListerner();//暫用不到
    //this.onTokenRefreshListener();
    //this.notificationOpenedListener();
    //this.messageListener();
    //BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    /*
    this.notificationListner.remove();
    this.refreshTokenListener.remove();
    */
  //}//暫用不到

  /*showLocalNotification() {//firebase暫不用
    let notification = new firebase.notifications.Notification();
    notification = notification.setNotificationId(new Date().valueOf().toString())
    .setTitle( "Test Notification with action")
    .setBody("Force touch to reply")
    //.setSound("bell.mp3")
    .setData({
      now: new Date().toISOString()
    });
    notification.ios.badge = 10
    notification.android.setAutoCancel(true);

    notification.android.setBigPicture("https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", "https://image.freepik.com/free-icon/small-boy-cartoon_318-38077.jpg", "content title", "summary text")
    notification.android.setColor("red")
    notification.android.setColorized(true)
    notification.android.setOngoing(true)
    notification.android.setPriority(firebase.notifications.Android.Priority.High)
    notification.android.setSmallIcon("ic_launcher")
    notification.android.setVibrate([300])
    notification.android.addAction(new firebase.notifications.Android.Action("view", "ic_launcher", "VIEW"))
    notification.android.addAction(new firebase.notifications.Android.Action("reply", "ic_launcher", "REPLY").addRemoteInput(new firebase.notifications.Android.RemoteInput("input")) )
    notification.android.setChannelId("test-channel")

    firebase.notifications().displayNotification(notification)
  }

  scheduleLocalNotification() {
    let notification = new firebase.notifications.Notification();
    notification = notification.setNotificationId(new Date().valueOf().toString())
    .setTitle( "Test Notification with action")
    .setBody("Force touch to reply")
    //.setSound("bell.mp3")
    .setData({
      now: new Date().toISOString()
    });
    notification.android.setChannelId("test-channel")
    notification.android.setPriority(firebase.notifications.Android.Priority.High)
    notification.android.setSmallIcon("ic_launcher")

    firebase.notifications().scheduleNotification(notification, { fireDate: new Date().getTime() + 5000 })
  }*/
/*
  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }

    dispatch(NavigationActions.back());
    return true;
  };*/

  render() {
    return <RootStack />;
  }
}