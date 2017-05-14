import React from 'react';
import { StyleSheet, Text, View, ScrollView, AsyncStorage } from 'react-native';

import ApiUtils from '../../api/ApiUtils';

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
    this.setState(
      {
        message: {
          body: obj[8][1][6],
        }
      }
    )
    console.log(obj[8][1][6]);
  }

  render() {
    const { message } = this.state;
    if (!message) {
      return(<View />)
    }
    return (
      <ScrollView>
        <Text>{message.body}</Text>
      </ScrollView>
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
