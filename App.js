/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList
} from 'react-native';
// import firebase from 'app/config/Firebase'
import firebase from 'react-native-firebase'
import { Icon } from 'react-native-elements'
// import DeviceInfo from 'react-native-device-info'
import Carousel from './app/components/Carousel'
import Home from './app/containers/Home'
import MyTrips from './app/containers/MyTrips'
import Saved from './app/containers/Saved'
import Detail from './app/containers/Detail'
import SearchModal from './app/containers/SearchModal'
import { colors } from './app/styles/index.style'
import { Card } from "react-native-elements"
import { Router, Scene, Tabs, Modal, Overlay, Actions } from 'react-native-router-flux'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator'
import { Provider } from 'react-redux'
import { AsyncStorage } from 'react-native';
import { persistStore } from 'redux-persist'
import store from './app/config/Store'


const TabIcon = ({ title, focused }) => {
  let color
  let icon
  let type

  switch (title) {
    case 'EXPLORE': {
      color = focused ? colors.blue : 'black'
      icon = 'search'
      type = 'feather'
      break
    }
    case 'SAVED': {
      color = focused ? colors.blue : 'black'
      icon = 'heart'
      type = 'feather'
      break
    }
    case 'TRIPS': {
      color = focused ? colors.blue : 'black'
      icon = 'card-travel'
      break
    }
  }
  return (<Icon name={icon} type={type} color={color} />)
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.ref = null
    this.state = {
      countryName: '',
      regionName: '',
      isReady: false
    }
  }
  // componentDidMount() {
  //   // this.ref = firebase.database().ref("profile")
  //   // console.log(DeviceInfo.getTimezone())
  //   console.log(firebase.database().ref('profile').child('name'))
  //   this.ref = firebase.database().ref(`profile`)
  //   this.ref.on('value', this.handleProfileUpdate)
  //   var url = 'https://freegeoip.net/json/';
  //   fetch(url)
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       //console.log(responseJson);
  //       this.setState({
  //         countryName: responseJson.country_name,
  //         regionName: responseJson.region_name
  //       });
  //     })
  //     .catch((error) => {
  //       //console.error(error);
  //     });
  //   // this.writeToFirebase()

  // }
  // componentWillUnmount() {
  //   if (this.ref) {
  //     this.ref.off('value', this.handleProfileUpdate)
  //   }
  // }

  componentDidMount() {
    persistStore(
      store,
      {
        storage: AsyncStorage,

      },
      () => {
        this.setState({
          isReady: true
        })
      }
    ) //purge here
  }

  render() {
    if (!this.state.isReady) {
      return (
        <Text>Loading...</Text>
      )
    }

    return (
      <Provider store={store}>
        <Router>
          <Overlay>
            <Modal key="modal"

              transitionConfig={() => ({ screenInterpolator: CardStackStyleInterpolator.forFadeFromBottomAndroid })}>

              <Scene key="root">

                <Tabs
                  key="tabbar"
                  swipeEnabled
                  showLabel={true}
                  tabBarStyle={styles.tabBarStyle}
                  labelStyle={styles.labelStyle}
                  tabBarPosition="bottom"
                  activeBackgroundColor="#eee"
                  inactiveBackgroundColor="#FDFEFE"
                  activeTintColor={colors.blue}
                >
                  <Scene
                    key="Home"
                    component={Home}
                    title="EXPLORE"
                    icon={TabIcon}
                    hideNavBar

                  />
                  <Scene
                    key="Saved"
                    component={Saved}
                    title="SAVED"
                    icon={TabIcon}
                    hideNavBar
                  />
                  <Scene
                    key="MyTrips"
                    component={MyTrips}
                    title="TRIPS"
                    icon={TabIcon}
                    hideNavBar
                  />
                </Tabs>
                <Scene key='tripDetail' component={Detail} hideNavBar />
              </Scene>

              <Scene key="searchModal"
                component={SearchModal}
                onExit={() => console.log('onExit')}
                onLeft={Actions.pop}
                panHandlers={null}
                duration={1}
                back
                backButtonTintColor='white'
                navTransparent

              />
              {/*navigationBarStyle={{backgroundColor: colors.modalBackground}}*/}
            </Modal>
          </Overlay>
        </Router>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  tabBarStyle: {
    backgroundColor: '#E5E7E9',
  },
  tabBarSelectedItemStyle: {
    backgroundColor: '#ddd',
  },
  labelStyle: {
    fontWeight: 'bold',
  }
});
