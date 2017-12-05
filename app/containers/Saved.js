import React, { Component } from 'react'
import { View, ScrollView, Text} from 'react-native'
import styles, { colors } from '../styles/index.style'

export default class Saved extends Component {

    render () {
        return (
            <View style={styles.container}>
              <Text style={styles.topic}>Saved</Text>
              <Text>When you see something you like, tap on the heart to save it.</Text>
            </View>
        );
    }
}