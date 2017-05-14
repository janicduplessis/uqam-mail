import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';

import ApiUtils from '../../api/ApiUtils';

export default class Inbox extends React.Component {
  static navigationOptions = {
    title: 'Vos messages',
  };
  state = {
    emails: [],
  }

  _keyExtractor = (item, index) => item.id;

  _renderItem = (data) => {
    const { navigate } = this.props.navigation;
    return(
    <TouchableOpacity
      key={data.index}
      onPress={() => navigate('ViewMessage', { message: data.item } )}
      style={styles.cell}
    >
      <Text style={styles.sender}>{data.item.sender}</Text>
      <Text style={styles.title}>{data.item.title}</Text>
    </TouchableOpacity>)
  }

  componentWillMount() {
    this._getEmails();
  }

  _getEmails = async () => {
    let token = await AsyncStorage.getItem('token');
    let res = await ApiUtils.getEmails(token);
    let resText = await res.text();
    let obj = eval(resText.substring(10,resText.length));
    let emails = obj[6].map((email) => {return { id: email[0], sender: email[4], title: email[5] }});
    this.setState({ emails })
  }

  render() {
    const { emails } = this.state;
    return (
      <FlatList
        data={emails}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        contentContainerStyle={styles.content}
      />
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
  cell: {
    height: 100,
    justifyContent: 'center',
    paddingLeft: 25,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 14,
  },
  sender: {
    fontWeight: 'bold',
    fontSize: 18,
  }
});