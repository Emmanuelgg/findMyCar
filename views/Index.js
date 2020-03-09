import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import Menu from '../components/Menu'
import Map from '../components/Map'

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }  
  }
  render() {
    return (
      <View style={{ width: '100%', height: "100%", flexDirection: 'column', backgroundColor: "#212121"}}>
        <Menu/>
        <Map/>
      </View>
    )
  }
}


export default Index