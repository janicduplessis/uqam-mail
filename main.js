import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import LoginScreen from './components/login/LoginScreen';
import Inbox from './components/inbox/Inbox';
import Login from './components/login/LoginScreen';
import ViewMessageScreen from './components/inbox/ViewMessageScreen'
import { StackNavigator } from 'react-navigation';
import ApiUtils from './api/ApiUtils';

class App extends React.Component {
  state = {
    token: null,
  }

  async _getToken () {
    if (!this.state.token) {
      let token = await AsyncStorage.getItem('token');
      let res = await ApiUtils.getEmails(token);
      let resText = await res.text();
      let obj = eval(resText.substring(10,resText.length));
      if (obj.length > 7) {
        this.setState({ token });
      }
    }
  }

  _onLogin = () => {
    this._getToken();
  }


  render() {
    this._getToken();
    if (this.state.token) {
      return (
        <AppNavigator ref={nav => { this.navigator = nav; }} />
      );
    }
    return <Login onLogin={this._onLogin}/>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AppNavigator = StackNavigator({
  Inbox: { screen: Inbox },
  ViewMessage: { screen: ViewMessageScreen },
  Login: { screen: Login },
});

Expo.registerRootComponent(App);
