import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';

import ApiUtils from '../../api/ApiUtils';

export default class LoginScreen extends React.Component {
  state = {
    code: '',
    mdp: '',
  }

  componentWillMount() {
    this._checkToken();
  }

  _checkToken = async () => {
    const { navigate } = this.props.navigation;
    let token = await AsyncStorage.getItem('token');
    if (token) {
      navigate('Inbox');
    }
  }

  _login = async () => {
    let res = await ApiUtils.login(this.state.code, this.state.mdp);
    // let res = await ApiUtils.login("kc791164", "x62986");
    console.log(res.iwcp.loginResponse.appToken)
    let indexOfEuqal = res.iwcp.loginResponse.appToken.indexOf("=");
    let token = res.iwcp.loginResponse.appToken.substring(indexOfEuqal+1, res.iwcp.loginResponse.appToken.length);
    console.log(token)
    await AsyncStorage.setItem('token', token);
    this._checkToken();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Code accès étudiant</Text>
        <TextInput style={styles.input} value={this.state.code} onChangeText={(code) => this.setState({ code })}/>
        <Text>Mot de Passe</Text>
        <TextInput style={styles.input} value={this.state.mdp} onChangeText={(mdp) => this.setState({ mdp })}/>
        <TouchableOpacity onPress={this._login}>
          <Text>connexion</Text>
        </TouchableOpacity>
      </View>
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
  input: {
    height: 50,
    fontSize: 14,
    color: 'black',
    borderColor: 'gray',
  }
});
