import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, AsyncStorage, AppState } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ParallaxImage } from 'react-native-snap-carousel'
import styles from '../styles/TourSliderEntry.style'
import { viewTrip } from '../actions/TripAction'
import { Actions } from 'react-native-router-flux'

class TourSliderEntry extends Component {

    constructor(props) {
        super(props)
        this.ref = null
        this.state = {
            appState: AppState.currentState,
            history: [],
        }
    }

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    onPressTrip = () => {
        //if it's top destination or rainy days
        //then not save in last viewd history
        if(this.props.data.tags[0] === 'top' || this.props.data.tags[0] === 'rainy') {
            Actions.tabbar({search: this.props.data})
        }
        //normal trips
        else {
            this.props.dispatchViewTrip(this.props.data)
            Actions.tripDetail({trip: this.props.data})
        }
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
                onPress={this.onPressTrip}
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
    return state
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchViewTrip: (trip) => dispatch(viewTrip(trip))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TourSliderEntry)