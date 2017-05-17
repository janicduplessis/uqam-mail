import React from 'react';
import { StyleSheet, Text, TouchableOpacity, AsyncStorage, View} from 'react-native';

type Props = {

}

export default class About extends React.Component {
  props: Props;
  state = {

  }



  render() {
    return (
      <View style={styles.outerContainer}>
        <Text style={styles.text}>
          {"Client Mobile crée à l'aide de React Native"}
        </Text>
        <Text style={styles.text}>
          {"Par Vincent de Lafontaine"}
        </Text>
        <Text style={styles.text}>
          {"Version 0.0.1"}
        </Text>
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
    backgroundColor: '#0195df',
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  }
});
