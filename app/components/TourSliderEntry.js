import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, AsyncStorage, AppState } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ParallaxImage } from 'react-native-snap-carousel'
import styles from '../styles/TourSliderEntry.style'
import { viewTrip } from '../actions/TripAction'
import { Actions } from 'react-native-router-flux'

class SliderEntry extends Component {

    constructor(props) {
        super(props)
        this.ref = null
        this.state = {
            appState: AppState.currentState,
            history: [],
        }
        // this.handler = this.handler.bind(this)
    }

    componentDidMount = async () => {
        // AsyncStorage.setItem('test2', JSON.stringify({ ...this.props.data }))
        //     .then(console.log("save view success"))
        // AsyncStorage.setItem('test2', JSON.stringify([{ test: 123 }, { test: 456 }]))
        //     .then(json => console.log('success!'))
        //     .catch(error => console.log('error!'));
        // AsyncStorage.getItem('test2')
        //     .then(req => JSON.parse(req))
        //     .then(json => console.log(json))
        //     .catch(error => console.log('error!'));
        // AppState.addEventListener('change', this._handleAppStateChange)
        // const value = await AsyncStorage.getItem('test2')
        // console.log("VALUE ", value)
        // if (value !== null) {
        //     const test = JSON.parse(value)
        //     console.log("test ", test);
        // }
    }

    // componentWillUnmount = () => {
    //     console.log("UNMOUNT")
        
    //     AsyncStorage.getItem('test2')
    //         .then(req => JSON.parse(req))
    //         .then(json => console.log("willunmount ", json))
    //         .catch(error => console.log('error!'));
    //     AppState.removeEventListener('change', this._handleAppStateChange);
    // }

    // _handleAppStateChange = (nextAppState) => {
    //     if (this.state.appState.match("/background/")) {
    //         console.log('App has come to the foreground!')
    //     }
    //     this.setState({ appState: nextAppState })
    //     console.log("state ", this.state.appState)
    //     // AsyncStorage.getItem('test2')
    //     //     .then(req => JSON.parse(req))
    //     //     .then(json => console.log("change ", json))
    //     //     .catch(error => console.log('error!'));
    //      AsyncStorage.setItem('test2', JSON.stringify([{ test: 123 }, { test: 999 }]))
    //         .then(json => console.log('set success!'))
    //         .catch(error => console.log('error!'));
    // }

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    addViewHistory = () => {
        // let history = this.state.history
        // history.push(this.props.data)
        // await this.setState({
        //     history: [...this.state.history, this.props.data]
        // })
        //if it's top destination or rainy days
        //then not save in last viewd history
        if(this.props.data.tags[0] === 'top' || this.props.data.tags[0] === 'rainy') {
            return
        }
        //normal trips
        else {
            this.props.dispatchViewTrip(this.props.data)
            Actions.tripDetail()
        }
    }

    saveToStorage = async (label, data) => {
        console.log("save...", label, data)
        await AsyncStorage.setItem(label, JSON.stringify({ data }))
            .then(json => console.log('set success!'))
            .catch(error => console.log('error!'))
    }

    get image() {
        const { data: { image }, parallax, parallaxProps, even } = this.props;

        return parallax ? (
            <ParallaxImage
                source={{ uri: illustration }}
                containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
                style={styles.image}
                parallaxFactor={0.35}
                showSpinner={true}
                spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
                {...parallaxProps}
            />
        ) : (
                <Image
                    source={{ uri: image }}
                    style={styles.image}
                />
            );
    }

    render() {
        
        const { data: { title }, even } = this.props;
        const description = this.props.data.description || {}
        const uppercaseTitle = title ? (
            <Text
                style={[styles.title, even ? styles.titleEven : {}]}
                numberOfLines={2}
            >
                {title.toUpperCase()}
            </Text>
        ) : false;

        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.slideInnerContainer}
                onPress={this.addViewHistory}
            >
                <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                    {this.image}
                    <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
                </View>
                <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
                    {uppercaseTitle}
                    <Text
                        style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                        numberOfLines={2}
                    >
                        {description.duration}
                    </Text>
                    {description.price?  <Text
                        style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                        numberOfLines={2}
                    >
                        {description.price} ฿
                    </Text> : null}
                   
                </View>
            </TouchableOpacity>
        );
    }
}

const mapStateToProps = (state) => {
    console.log("mapStateToProps in TourSliderEntry ", state)
    return state
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchViewTrip: (trip) => dispatch(viewTrip(trip))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SliderEntry)