import React, { Component } from 'react';
import { View, ScrollView, Text, StatusBar, TouchableHighlight } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../styles/TourSliderEntry.style';
import SliderEntry from './TourSliderEntry';
import styles, { colors } from '../styles/index.style';
import { ENTRIES1, ENTRIES2 } from './entries';

const SLIDER_1_FIRST_ITEM = 1;

export default class CarouselSlider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            slider1Ref: null,
        };
    }

    _renderItem({ item, index }) {
      let addViewHistory = this.addViewHistory
        return (
            <SliderEntry
                data={item}
                even={(index + 1) % 2 === 0}
                index={index}
            />
        );
    }

    _renderItemWithParallax({ item, index }, parallaxProps) {
        return (
            <SliderEntry
                data={item}
                even={(index + 1) % 2 === 0}
                parallax={true}
                parallaxProps={parallaxProps}
               
            />
        );
    }

    // get gradient() {
    //     return (
    //         <LinearGradient
    //             colors={[colors.background1, colors.background2]}
    //             start={{ x: 1, y: 0 }}
    //             end={{ x: 0, y: 1 }}
    //             style={styles.gradient}
    //         />
    //     );
    // }

    render() {
        return (
            <View style={styles.carouselContainer}>
                <Carousel
                    data={this.props.data}
                    renderItem={this._renderItem}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    inactiveSlideScale={0.94}
                    inactiveSlideOpacity={0.7}
                    enableMomentum={true}
                    activeSlideAlignment={'center'}
                    containerCustomStyle={styles.slider}
                    contentContainerCustomStyle={styles.sliderContentContainer}
                    removeClippedSubviews={false}
                />
            </View>
        );
    }
}