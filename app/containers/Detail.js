import React, { Component } from 'react'
import { View, ScrollView, Text, Image, StyleSheet } from 'react-native'
import { Divider, Icon, Rating, Button } from 'react-native-elements'
import styles, { colors } from '../styles/index.style'


export default class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rating: 0
        }
    }

    componentWillMount = () => {
        this.calculateRating(this.props.trip)
    }

    calculateRating = (trip) => {
        let totalScore = 0
        let rating = 0
        //The trip already has been rated 
        if (trip.rating) {
            trip.rating.forEach((elementScore) => {
                totalScore += elementScore
            })
            let len = trip.rating.length
            rating = totalScore / len //calculate rating to 5 stars
            this.setState({
                rating
            })
        }
    }

    render() {
        console.log(this.props.trip)
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Image source={{ uri: this.props.trip.image }} style={styles.imageTripDetail} resizeMode="cover" />
                    <View style={styles.detailContent}>
                        <Text style={styles.titleDetail}>{this.props.trip.title}</Text>
                        <Text style={[styles.detailText, { marginBottom: 30 }]}>by {this.props.trip.description.company}</Text>
                        <Divider />

                        <View style={{ marginVertical: 30 }}>
                            <Text style={[styles.subHeader, { marginBottom: 30 }]}>About the trip</Text>
                            <Text style={{ lineHeight: 25, letterSpacing: 2, marginBottom: 30, fontSize: 16 }}>{this.props.trip.description.info}</Text>
                            <Divider />
                            <Text style={styles.subHeader}>Highlights</Text>
                            <Text style={styles.subHeader}>What we'll provide</Text>


                            <Rating

                                type="star"
                                fractions={1}
                                startingValue={this.state.rating}
                                readonly
                                imageSize={20}
                                style={{ paddingVertical: 10 }}
                            />


                        </View>

                    </View>

                </ScrollView>

                <View style={_styles.footer}>
                    <Text>{this.props.trip.description.price} ฿</Text>
                    <Text>Rating</Text>
                    <Button
                        title='Book'
                        buttonStyle={{backgroundColor: colors.blue}} />
                </View>

            </View>
        );
    }
}


const _styles = StyleSheet.create({
    detail: {
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 25,
    },
    footer: {
        borderTopWidth: 0.5,
        borderColor: colors.lightGray,
    }
});