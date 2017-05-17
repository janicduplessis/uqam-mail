import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, FlatList, ActivityIndicator, Button, Image } from 'react-native';

import ApiUtils from '../../api/ApiUtils';

export default class Inbox extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {setParams, state} = navigation;
    return {
      title: 'Vos messages',
      headerRight:
        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => setParams({ search: state.params ? !state.params.search : true })}>
          <Image
            source={{uri: 'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/search-128.png'}}
            style={{ width: 28, height: 28}}
          />
        </TouchableOpacity>
      }
  };
  state = {
    emails: [],
    searchTerm: '',
  }

  _keyExtractor = (item, index) => item.id;

  _renderItem = (data) => {
    return(
    <TouchableOpacity
      key={data.index}
      onPress={() => this._emailClicked(data)}
      style={[styles.cell, data.item.seen ? {} : {backgroundColor: '#fcf9ae'}]}
    >
      <Text style={styles.sender}>{data.item.sender}</Text>
      <Text style={styles.title}>{data.item.title}</Text>
    </TouchableOpacity>)
  }

  componentWillMount() {
    this._getEmails();
  }

  _emailClicked = (data) => {
    const { navigate } = this.props.navigation;
    let newEmails = this.state.emails.slice();
    newEmails[data.index].seen = true;
    this.setState({ emails: newEmails });
    navigate('ViewMessage', { message: data.item } );
    // this._getEmails();
  }

  _getEmails = async () => {
    let token = await AsyncStorage.getItem('token');
    let res = await ApiUtils.getEmails(token);
    let resText = await res.text();
    let obj = eval(resText.substring(10,resText.length));
    let emails = obj[6].map((email) => {
      let seen = !(email[3] === 0 || email[3] === 32);
      return { id: email[0], sender: email[4], title: email[5], seen }
    });
    this.setState({ emails })
  }

  _renderSearchBar = () => {
    const { params } = this.props.navigation.state;
    if (params) {
      if (params.search) {
        return <TextInput
          placeholder="Rechercher un courriel"
          style={styles.searchInput}
          value={this.state.searchTerm}
          onChangeText={(searchTerm) => this.setState({ searchTerm })}
          returnKeyType="done"
          autoCapitalize={"none"}
          underlineColorAndroid="transparent"
          autoFocus
        />
      }
    }
    return null;
  }

  _filterEmails = () => {
    const { searchTerm, emails } = this.state;
    if (searchTerm.length) {
      let filteredEmail = [];
      for (let i = 0; i < emails.length; i += 1) {
        if (emails[i].sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emails[i].title.toLowerCase().includes(searchTerm.toLowerCase())) {
          filteredEmail.push(emails[i]);
        }
      }
      return filteredEmail;
    } else {
      return emails;
    }
  }

  render() {
    const { emails } = this.state;


    if (emails.length === 0) {
      return(<View style={styles.view}><ActivityIndicator /></View>)
    }

    const filteredEmail = this._filterEmails();

    return (
      <View>
        {
          this._renderSearchBar()
        }
        <FlatList
          data={filteredEmail}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          contentContainerStyle={styles.content}
        />
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
  view: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
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
  },
  search: {
    width: 14,
    height: 14,
  },
  searchInput: {
    height: 30,
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgray',

  }
});
