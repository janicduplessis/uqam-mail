import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './components/login/LoginScreen';
import Inbox from './components/inbox/Inbox';
import Login from './components/login/LoginScreen';
import ViewMessageScreen from './components/inbox/ViewMessageScreen'
import { StackNavigator } from 'react-navigation';

class App extends React.Component {
  render() {
    return (
      <AppNavigator ref={nav => { this.navigator = nav; }} />
    );
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
  Login: { screen: Login },
  Inbox: { screen: Inbox },
  ViewMessage: { screen: ViewMessageScreen },
});

Expo.registerRootComponent(App);
