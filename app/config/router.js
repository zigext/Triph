import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Home from '../containers/Home';
import MyTrips from '../containers/MyTrips';
import Likes from '../containers/Likes';
import Detail from '../containers/Detail';

// export const HomeStack = StackNavigator({
//     Home: {
//         screen: Home,
//     },
//     Details: {
//         screen: Detail,
//     },
// });


export const Tabs = TabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            tabBarLabel: 'Home',
            tabBarIcon: ({ tintColor }) => <Icon name="list" size={35} color={tintColor} />
        },
    },
    Likes: {
        screen: Likes,
    },
    MyTrips: {
        screen: MyTrips,
    },
});