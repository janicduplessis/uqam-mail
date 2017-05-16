import React from 'react';
import { StyleSheet, Text, KeyboardAvoidingView, Modal, TextInput, TouchableOpacity, AsyncStorage, ScrollView, View} from 'react-native';

import ApiUtils from '../../api/ApiUtils';

export default class LoginScreen extends React.Component {
  state = {
    code: '',
    mdp: '',
    modalOpen: true,
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
    this.setState({ modalOpen: false })
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
      <View style={styles.outerContainer}>
        {/*<Modal animationType="fade" visible={this.state.modalOpen} onRequestClose={() => this.setState({ modalOpen: false })}>*/}
          <KeyboardAvoidingView behavior="height" style={styles.container}>
            <Text>Code utilisateur</Text>
            <TextInput
              style={styles.input}
              value={this.state.code}
              onChangeText={(code) => this.setState({ code })}
              returnKeyType="done"
              autoCapitalize={"none"}
            />
            <Text>Mot de Passe</Text>
            <TextInput
              style={styles.input}
              value={this.state.mdp}
              onChangeText={(mdp) => this.setState({ mdp })}
              returnKeyType="done"
              autoCapitalize={"none"}
              secureTextEntry
            />
            <TouchableOpacity onPress={this._login}>
              <Text>connexion</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        {/*</Modal>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  input: {
    height: 50,
    fontSize: 14,
    color: 'black',
    borderColor: 'gray',
    textAlign: 'center',
  }
});
