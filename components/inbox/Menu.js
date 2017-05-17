import React from 'react';
import { StyleSheet, Text, TouchableOpacity, AsyncStorage, View} from 'react-native';

import ApiUtils from '../../api/ApiUtils';

type Props = {
  onPressDisconnect: Function,
  isOpen: boolean,
}

export default class Menu extends React.Component {
  props: Props;
  state = {

  }



  render() {
    if (this.props.isOpen === false) {
      return null;
    }


    return (
      <View style={styles.outerContainer}>
        <TouchableOpacity onPress={this.props.onPressDisconnect}>
          <Text>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'white',
    flex: 1,
    borderRightWidth: 1,
    borderColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
