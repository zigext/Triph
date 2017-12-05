import React, { Component } from 'react';
import { View, ScrollView, Text} from 'react-native';

export default class Detail extends Component {
    constructor(props) {
        super(props)
    }

    render () {
        return (
            <View>
              <Text>{this.props.trip.title}</Text>
            </View>
        );
    }
}