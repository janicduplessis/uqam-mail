import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, FlatList, ActivityIndicator, Button, Image } from 'react-native';
import SideMenu from 'react-native-side-menu';
import Menu from './Menu';

import ApiUtils from '../../api/ApiUtils';

export default class Inbox extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {setParams, state} = navigation;
    return {
      title: 'Vos messages',
      headerRight:
        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => setParams({ search: !state.params.search})}>
          <Image
            source={{uri: 'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/search-128.png'}}
            style={{ width: 28, height: 28}}
          />
        </TouchableOpacity>,
      headerLeft:
        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => setParams({ isSideMenuOpen: !state.params.isSideMenuOpen })}>
          <Image
            source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/220px-Hamburger_icon.svg.png'}}
            style={{ width: 28, height: 28}}
          />
        </TouchableOpacity>
      }
  };
  state = {
    emails: [],
    searchTerm: '',
    loading: false,
    isSideMenuOpen: false,
    startIndex: 0,
    firstSearch: true,
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
    this.props.navigation.setParams({ search: false, isSideMenuOpen: false, })
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
    this.setState({ loading: true });
    let token = await AsyncStorage.getItem('token');
    let res = await ApiUtils.getEmails(token, this.state.startIndex);
    let resText = await res.text();
    let obj = eval(resText.substring(10,resText.length));
    if (obj.length < 4) {
      // error
      this.setState({ loading: false });
    }
    let emails = obj[6].map((email) => {
      let seen = !(email[3] === 0 || email[3] === 32);
      this.setState({ loading: false });
      return { id: email[0], sender: email[4], title: email[5], seen }
    });
    this.setState({ emails, loading: false });
  }

  _renderSearchBar = () => {
    const { params } = this.props.navigation.state;
    if (params) {
      if (params.search) {
        if (this.state.firstSearch) {
          // just to download more email
          this.setState({ startIndex: 100, firstSearch: false },this._getEmails);
        }
        return <TextInput
          placeholder="Rechercher un courriel"
          style={styles.searchInput}
          value={this.state.searchTerm}
          onChangeText={(searchTerm) => this.setState({ searchTerm })}
          returnKeyType="done"
          autoCapitalize={"none"}
          underlineColorAndroid="transparent"
          autoFocus
          onEndEditing={() => this.props.navigation.setParams({ search: false })}
        />
      } else {
        if (this.state.searchTerm.length) {
          //setTimeout(() => { this.setState({ searchTerm: '' }); }, 20);
        }
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


  async _onPressDisconnect() {
    const { navigate } = this.props.navigation;
    await AsyncStorage.removeItem('token');
    navigate('Login');
  }

  _getMoreEmails = () => {
    let newStartIndex = this.state.startIndex;
    newStartIndex += 10;
    this.setState({ startIndex: newStartIndex }, this._getEmails);
  }

  _onPressAbout = () => {
    const { navigate, setParams } = this.props.navigation;
    setParams({ isSideMenuOpen: false });
    this.setState({ isSideMenuOpen: false });
    setTimeout(() => { navigate('About'); }, 100);
  }

  _onCloseSideMenu = (isOpen) => {
    if (isOpen === false) {
      setTimeout(() => { this.props.navigation.setParams({ isSideMenuOpen: false }); }, 500);
    }
  }


  render() {
    const { emails, isSideMenuOpen } = this.state;

    if (emails.length === 0) {
      return(<View style={styles.view}><ActivityIndicator /></View>)
    }
    const filteredEmail = this._filterEmails();
    return (
      <SideMenu
        menu={
          <Menu
            isOpen={this.props.navigation.state.params ? this.props.navigation.state.params.isSideMenuOpen : false}
            onPressDisconnect={() => this._onPressDisconnect()}
            onPressAbout={() => this._onPressAbout()}
        />}
        disableGestures
        isOpen={this.props.navigation.state.params ? this.props.navigation.state.params.isSideMenuOpen : false}
        onChange={(isOpen) => this._onCloseSideMenu(isOpen)}
      >
        <View>
          {
            this._renderSearchBar()
          }
          <FlatList
            data={filteredEmail}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            contentContainerStyle={styles.content}
            refreshing={this.state.loading}
            onRefresh={() => {
              this._getEmails();
              // too long request :
              setTimeout(() => { this.setState({ loading: false }); }, 8000);
            }}
            onEndReached={this._getMoreEmails}
            onEndReachedThreshold={0.50}
          />
      </View>
    </SideMenu>
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
