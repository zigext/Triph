import React, { Component } from 'react';
import { View, ScrollView, Text, Image, AsyncStorage } from 'react-native'
import firebase from 'react-native-firebase'
import styles, { colors } from '../styles/index.style'
import TourCarousel from '../components/TourCarousel'
import { connect } from 'react-redux'
import { sortBy, orderBy, difference } from 'lodash'





class Home extends Component {
    constructor(props) {
        super(props)
        this.ref = null
        this.state = {
            search: '',
            recentViewd: [],
            topDestination: [],
            rainy: [],
            history: [],
            recommends: [],
            promotions: [],
        }
    }


    componentDidMount = () => {
        this.fetchTopDestination()
        this.fetchRainy()
        this.fetchRecentlyViewd()
        this.fetchRecommends()
        this.fetchPromotions()
        console.log("DIF = ", difference(['abc', 'def'], ['abc', 'xyz']).length === 0)
        //  AsyncStorage.getItem('trip0')
        //     .then(req => console.log("read ", req))
            // .then(json => console.log("change ", json))
            // .catch(error => console.log('error!'));
    }

    // componentWillUnmount() {
    //     if (this.ref) {
    //         this.ref.off('value', this.handleProfileUpdate)
    //     }
    // }

    fetchTopDestination = () => {
        this.ref = firebase.database().ref(`top_destination`)
        this.ref.on('value', this.handleTopDestinationUpdate)
    }

    fetchRainy = () => {
        this.ref = firebase.database().ref(`rainy_days`)
        this.ref.on('value', this.handleRainyUpdate)
    }

    fetchRecentlyViewd = () => {
        console.log("fetch last viewd ", this.props.default.history)
        //remove the duplicate trips 
        //MUST ADD MORE CONDITION LATER
        //or can use
        // let history = this.props.default.history.filter((trip, index, self) =>
        // index === self.findIndex((t) => (
        //     t.description.duration === trip.description.duration && t.title === trip.title
        //     ))
        // )
        // let history = this.props.default.history.filter(
        //     (trip, index, self) => 
        //         self.findIndex(t => t.title === trip.title && t.description.duration === trip.description.duration && t.description.price === trip.description.price) === index)
        
        this.setState({
            history: this.props.default.history
        })
    }

    fetchRecommends = () => {
        this.ref = firebase.database().ref(`trips`)
        this.ref.on('value', (snapshot) => {
            let trips = snapshot.val() || {}
            let newTrips = this.calculateRating(trips)
            newTrips.sort(this.compare)
            this.setState({
                recommends: newTrips
            })
        })
    }

    fetchPromotions = () => {
        const tags = ['promotion']
        this.ref = firebase.database().ref(`trips`)
        this.ref.on('value', (snapshot) => {
            let trips = snapshot.val() || {}
            this.filterTripsByTags(trips, tags)
        })
    }

    filterTripsByTags = (trips, tagsSearch) => {
        let searchedArray = []
          trips.forEach((trip) => {
            if(trip.tags) {
                //check if the trip contains all tags in tagSearch  
                let isContained = difference(tagsSearch, trip.tags).length === 0 
                 if(isContained){
                     searchedArray.push(trip)
                 }
            }
        });
        console.log("search array = ", searchedArray)
    }

    calculateRating = (trips) => {
        trips.forEach((trip) => {
            let totalScore = 0
            let rating = 0
            //The trip already has been rated 
            if(trip.rating){
                 trip.rating.forEach((elementScore) => {
                    totalScore += elementScore
                })  
                let len =  trip.rating.length
                rating = totalScore/len //calculate rating to 5 stars
                trip.rates = rating //add new property to keep rating value
            }
            //No one rates the trip yet
            else {
                 trip.rates = 0 //default rate is 0
            }
        });
        return trips
    }

    // sortByRating = async (trips) => {
    //     let sortArr = orderBy(trips, ['rates','desc'])
    //     return sortArr
    // }

      //sort array by rates descending
    compare = (a, b) => {
        if (a.rates < b.rates)
            return 1
        if (a.rates > b.rates)
            return -1
        return 0
    }

    handleTopDestinationUpdate = (snapshot) => {
        let topDestination = snapshot.val() || {}
        console.log("key ", Object.keys(topDestination))
        this.setState({
            topDestination
        })

    }

    handleRainyUpdate = (snapshot) => {
        let rainy = snapshot.val() || {}
        // let topArray = Object.keys(top).map((k) => top[k])
        this.setState({
            rainy
        })
    }

    handlePromotionUpdate = (snapshot) => {
        const tags = ['promotion']
        let trips = snapshot.val() || {}
        this.filterTripsByTags(trips, tags)
    }

    recentViewd = () => {
    if(!this.state.history || this.props.default.state === 'initial')
        return null
    else{
        return (
            <View>
                <Text style={styles.titleHome}>Recently viewd</Text>
                <TourCarousel data={this.state.history}/>
            </View>
        )
    }
}

    addViewHistory = (newTrip) => {
        
        //  console.log(newTrip)
        // await this.setState({
        //     history: [...this.state.history, newTrip]
        // })
        // console.log("history ", this.state.history)
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'lightblue' }}>
                {/*{this.state.search ? <Text>Picture</Text> : <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/travel-tour-ea526.appspot.com/o/teaser.jpeg.jpg?alt=media&token=5a578eff-7a47-48e1-8167-92c297f177ec" }}
                    style={styles.imageHeader} resizeMode="cover"/>}*/}
                <ScrollView style={{ flex: 1, backgroundColor: 'pink' }}>
                    {this.state.search ? <Text>Picture</Text> : <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/travel-tour-ea526.appspot.com/o/teaser.jpeg.jpg?alt=media&token=5a578eff-7a47-48e1-8167-92c297f177ec" }}
                        style={styles.imageHeader} resizeMode="cover" />}
                    <View style={{ flex: 1, backgroundColor: 'yellow' }}>
                        {this.recentViewd()}
                        
                        <Text style={styles.titleHome}>Recommends</Text>
                        <TourCarousel data={this.state.recommends}/>
                        <Text style={styles.titleHome}>Top Destinations</Text>
                        <TourCarousel data={this.state.topDestination}/>
                        <Text style={styles.titleHome}>Promotions</Text>
                        <Text style={styles.titleHome}>Good for Rainy Days</Text>
                        <TourCarousel data={this.state.rainy}/>
                        <Text style={styles.titleHome}>Upcoming Holidays</Text>


                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    console.log("mapStateToProps in Home ", state)
    return state
}

const mapDispatchToProps = (dispatch) => {
    return {
        // dispatchStartActivity: () => dispatch(startActivity())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)