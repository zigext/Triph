import React, { Component } from 'react'
import { View, ScrollView, Text, Image, StyleSheet } from 'react-native'
import { Divider, Icon, Rating, Button, List, ListItem } from 'react-native-elements'
import styles, { colors } from '../styles/index.style'
import moment from 'moment'

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

    renderAccommodation = () => {
        return Object.keys(this.props.trip.accommodation).map(key => {
            return <Text style={[_styles.text, { margin: 10 }]}>{this.props.trip.accommodation[key]}</Text>
        })
    }

    renderIconAccommodation = () => {
        return Object.keys(this.props.trip.accommodation).map(key => {
            switch (key) {
                case 'food':
                    return <Icon name='food' type='material-community' containerStyle={{ margin: 5 }} />
                case 'transport':
                    return <Icon name='car' type='material-community' containerStyle={_styles.icon} />
                case 'stay':
                    return <Icon name='home' type='entypo' containerStyle={_styles.icon} />
                case 'language':
                    return <Icon name='ios-chatbubbles' type='ionicon' containerStyle={_styles.icon} />
                case 'insurance':
                    return <Icon name='file-document' type='material-community' containerStyle={_styles.icon} />
                case 'snorkelling':
                    return <Icon name='life-ring' type='font-awesome' containerStyle={_styles.icon} />
            }
        })

    }

    renderSchedule = (day) => {
        return (
            <List
                containerStyle={_styles.list}>
                {
                    this.props.trip.schedule[day].map((item, i) => (
                        <ListItem
                            key={i}

                            title={
                                <View style={_styles.row}>
                                    <Text style={_styles.scheduleTime}>{item.time}</Text>
                                    <Text style={_styles.scheduleActivity} numberOfLines={3}>{item.activity}</Text>
                                </View>
                            }

                            rightTitleNumberOfLines={4}
                            hideChevron
                            containerStyle={_styles.list}
                        />
                    ))
                }
            </List>
        )
    }

    renderDate = () => {
        if(this.props.trip.description.duration === 'Full day' || this.props.trip.description.duration === 'Half day'){
            return (
                <Text style={_styles.detailText}>{moment(this.props.trip.description.startedDate).format('MMM DD')}</Text>
            )
        }
        else{
            return (
                 <Text style={_styles.detailText}>{moment(this.props.trip.description.startedDate).format('MMM DD')} - {moment(this.props.trip.description.finishedDate).format('MMM DD')}</Text>
            )
        }
    }


    render() {


        console.log(this.props.trip)
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Image source={{ uri: this.props.trip.image }} style={_styles.image} resizeMode="cover" />
                    <View style={_styles.detailContent}>
                        <Text style={_styles.titleDetail}>{this.props.trip.title}</Text>
                        <Text style={[_styles.detailText, { marginBottom: 10 }]}>{this.props.trip.description.duration}</Text>
                        {this.props.trip.description.startedDate ? this.renderDate() : null }
                        <Text style={[_styles.detailText, { marginBottom: 20 }]}>by {this.props.trip.description.company}</Text>
                        <Divider style={_styles.divider} />

                        <View >
                            <Text style={[_styles.topic, { marginBottom: 30 }]}>About the trip</Text>
                            <Text style={[_styles.text, { lineHeight: 25 }]}>{this.props.trip.description.info}</Text>
                            <Divider style={_styles.divider} />

                            <Text style={[_styles.topic,]}>What we'll provide</Text>
                            <View style={_styles.row}>
                                <View style={{ marginTop: 15 }}>
                                    {this.renderIconAccommodation()}
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    {this.renderAccommodation()}
                                </View>
                            </View>
                            <Divider style={_styles.divider} />
                            {this.props.trip.schedule ? <Text style={[_styles.topic, { marginBottom: 20 }]}>What we'll do</Text> : null}
                            {this.props.trip.schedule ? (this.props.trip.schedule['day 1'] ? <Text style={_styles.scheduleDay}>Day 1</Text> : null) : null}
                            {this.props.trip.schedule ? (this.props.trip.schedule['day 1'] ? this.renderSchedule('day 1') : null) : null}
                            {this.props.trip.schedule ? (this.props.trip.schedule['day 2'] ? <Text style={_styles.scheduleDay}>Day 2</Text> : null) : null}
                            {this.props.trip.schedule ? (this.props.trip.schedule['day 2'] ? this.renderSchedule('day 2') : null) : null}
                            {this.props.trip.schedule ? (this.props.trip.schedule['day 3'] ? <Text style={_styles.scheduleDay}>Day 3</Text> : null) : null}
                            {this.props.trip.schedule ? (this.props.trip.schedule['day 3'] ? this.renderSchedule('day 3') : null) : null}
                            {this.props.trip.schedule ? <Divider style={_styles.divider} /> : null}
                        </View>

                        <View style={_styles.row}>
                            <Text style={[_styles.text, { fontWeight: 'bold' }]}>{this.props.trip.description.price} ฿</Text>
                            <Text style={[_styles.text, { marginHorizontal: 10 }]}>per person</Text>
                        </View>

                        <View style={[_styles.row, { justifyContent: 'space-between' }]}>
                            <Rating
                                type="star"
                                fractions={1}
                                startingValue={this.state.rating}
                                readonly
                                imageSize={20}
                                style={{ paddingVertical: 10 }}
                            />
                            <Button
                                title='Book'
                                buttonStyle={[_styles.button]}
                            />
                        </View>

                    </View>

                </ScrollView>

                {/*<View style={_styles.footer}>
                    <Text>{this.props.trip.description.price} ฿</Text>
                    <Rating
                        type="star"
                        fractions={1}
                        startingValue={this.state.rating}
                        readonly
                        imageSize={20}
                        style={{ paddingVertical: 10 }}
                    />
                    <Button
                        title='Book'
                        buttonStyle={{ backgroundColor: colors.blue }}
                        containerViewStyle={{ alignSelf: 'flex-end' }} />
                </View>*/}

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
    detailContent: {
        margin: 25,
    },
    titleDetail: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    topic: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scheduleDay: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    scheduleTime: {
        fontSize: 16,
    },
    scheduleActivity: {
        fontSize: 16,
        // numberOfLines: 3,
        marginLeft: 25
    },
    detailText: {
        fontSize: 16,
    },
    text: {
        fontSize: 16,
        letterSpacing: 2,
    },
    icon: {
        margin: 10
    },
    footer: {
        borderTopWidth: 0.5,
        borderColor: colors.lightGray,
    },
    list: {
        borderTopWidth: 0,
        borderBottomWidth: 0
    },
    listItem: {
        borderBottomWidth: 0
    },
    divider: {
        marginVertical: 30,
    },
    image: {
        height: 500,
        width: 'auto',
    },
    button: {
        borderRadius: 10,
        backgroundColor: colors.blue,
    },
    row: {
        flexDirection: 'row',
        flex: 1,
    },
});