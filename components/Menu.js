import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native'

const styles = StyleSheet.create({
  menu: {
    backgroundColor: '#00b2cc',
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: 1,
    borderRadius: 10,
    marginTop: 3,
    marginBottom: 0,
    marginLeft: 25,
    marginRight: 25
  },
  logo: {
    width: 125,
    height: 50
  },
  menuImage: {
    width: 50,
    height: 50
  }
})

const logo = require('../assets/findMyCarLogo2.png')
const menuImage = require('../assets/menu-alt-512.png')
class Menu extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }  
  }

  render() {
    return (
      <View style={{height: 70, flexDirection: 'row', backgroundColor: "#000000" }}>
        <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: ""}}>
          <Image
            style={styles.logo}
            source={logo} 
          />
        </View>
        {/* <View style={{width: '30%', alignItems: 'center', justifyContent: 'center'}}>
          <Image
            style={styles.menuImage}
            source={menuImage} 
          />
        </View> */}
      </View>
    )
  }
}


export default Menu