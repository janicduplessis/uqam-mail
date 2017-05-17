import React from 'react';
import { StyleSheet, Text, View, ScrollView, AsyncStorage, ActivityIndicator, Dimensions } from 'react-native';
import HTMLView from 'react-native-htmlview';

import ApiUtils from '../../api/ApiUtils';

const {height, width} = Dimensions.get('window');

export default class ViewMessageScreen extends React.Component {
  static navigationOptions = {
    title: '',
  };
  state = {
    message: null,
  }

  componentWillMount() {
    this._getMessage();
  }

  _getMessage = async () => {
    const { params } = this.props.navigation.state;
    let token = await AsyncStorage.getItem('token');
    let res = await ApiUtils.getMessage(token, params.message.id);
    let resText = await res.text();
    let obj = eval(resText.substring(10,resText.length));
    this._constructMessage(obj);
  }

  _constructMessage = (obj) => {
    let msg = "";
    // obj[8].forEach((item) => console.log(item));
    for (let i = 0; i < obj[8].length; i += 1) {
      if (obj[8][i][1] === 'text/html') {
        msg = obj[8][i][6];
        break;
      }
    }

    this.setState(
      {
        message: {
          body: msg,
        }
      }
    );
  }

  render() {
    const { message } = this.state;
    if (!message) {
      return(<View style={styles.view}><ActivityIndicator /></View>)
    }
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <HTMLView
          value={message.body}
          stylesheet={styles}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  view: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: width,
  },
  content: {
    backgroundColor: '#fff',
  },
  span: {
    marginBottom: 0,
    marginTop: 0,
    width: width,
  },
  div: {
    marginBottom: 0,
    marginTop: 0,
    width: width,
  },
  p: {
    marginBottom: 0,
    marginTop: 0,
    width: width,
  },
});
