import React from 'react';
import { StyleSheet, Text, KeyboardAvoidingView, Modal, TextInput, TouchableOpacity, AsyncStorage, ScrollView, View, Image} from 'react-native';

import ApiUtils from '../../api/ApiUtils';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    code: '',
    mdp: '',
    modalOpen: true,
    error: false,
  }


  _login = async () => {
    this.setState({ modalOpen: false, error: false })
    let res = await ApiUtils.login(this.state.code, this.state.mdp);
    if (!res.iwcp.loginResponse) {
      this.setState({ error: true });
      return;
    }
    let indexOfEuqal = res.iwcp.loginResponse.appToken.indexOf("=");
    let token = res.iwcp.loginResponse.appToken.substring(indexOfEuqal+1, res.iwcp.loginResponse.appToken.length);
    await AsyncStorage.setItem('token', token);
    if (this.props.onLogin) {
      this.props.onLogin();
    } else {
      const { navigate } = this.props.navigation;
      navigate('Inbox');
    }
  }

  render() {

    return (
      <Image source={require('../../assets/reaz_phone.png')} style={styles.outerContainer}>
          <KeyboardAvoidingView behavior="position" style={styles.container}>
            <Image
              style={styles.uqam}
              source={{uri:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Universit%C3%A9_du_Qu%C3%A9bec_%C3%A0_Montr%C3%A9al_Logo.svg/1200px-Universit%C3%A9_du_Qu%C3%A9bec_%C3%A0_Montr%C3%A9al_Logo.svg.png'}}
            />
            <Text style={styles.title}>Connexion au courriel Web</Text>
            <Text>Code d'accès étudiant :</Text>
            <TextInput
              style={styles.input}
              value={this.state.code}
              onChangeText={(code) => this.setState({ code })}
              returnKeyType="done"
              autoCapitalize={"none"}
              underlineColorAndroid="transparent"
            />
            <Text>Mot de Passe :</Text>
            <TextInput
              style={styles.input}
              value={this.state.mdp}
              onChangeText={(mdp) => this.setState({ mdp })}
              returnKeyType="done"
              autoCapitalize={"none"}
              secureTextEntry
              underlineColorAndroid="transparent"
            />
            {
              this.state.error ? <Text style={styles.error}>Connexion Refusé</Text> : null
            }
          </KeyboardAvoidingView>
          <TouchableOpacity onPress={this._login} style={styles.connect}>
            <Text style={styles.connectText}>connexion</Text>
          </TouchableOpacity>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    width: null,
    height: null,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  uqam: {
    width: 200,
    height: 70,
    alignSelf: 'center',
  },
  input: {
    height: 30,
    fontSize: 14,
    color: 'black',
    borderColor: '#0195df',
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  connect: {
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 50,
    height: 30,
    width: 100,
    backgroundColor: '#0195df',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  connectText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#014bdf',
    alignSelf: 'center',
    marginBottom: 40,
  },
  error: {
    color: 'red',
  }
});
