import React, { Component } from 'react';
import { View, ScrollView, Text, Image, AsyncStorage, TouchableHighlight, Keyboard } from 'react-native'
import firebase from 'react-native-firebase'
import styles, { colors } from '../styles/index.style'
import TourCarousel from '../components/TourCarousel'
import { connect } from 'react-redux'
import { SearchBar } from 'react-native-elements'
import { Actions } from 'react-native-router-flux'
import { sortBy, orderBy, difference, uniqBy, map, uniq, maxBy } from 'lodash'
import moment from 'moment'


class Home extends Component {
    constructor(props) {
        super(props)
        this.ref = null
        this.state = {
            search: '',
            country: '',
            recentViewd: [],
            topDestination: [],
            topDestinationTitle: [],
            rainy: [],
            rainyTitle: [],
            history: [],
            recommends: [],
            promotions: [],
            holidays: [],
            tripsByHoliday: [],
            recommendsAll: [],
            promotionsAll: [],
            allDestinationTitle: [],

        }
    }




    componentDidMount = async () => {
        Keyboard.dismiss()
        await this.fetchCountry()
        this.fetchTopDestination()
        this.fetchRainy()
        this.fetchRecentlyViewd()
        this.fetchRecommends()
        this.fetchPromotions()
        await this.fetchHolidays()
        let comingHoliday = this.findComingHoliday()
        this.fetchTripsByHoliday(comingHoliday)
        this.fetchAllTDestinations()
    }

    componentWillReceiveProps = (nextProps) => {
        console.log("RECEIVE ", nextProps.default.search)
    }

    fetchCountry = async () => {
        let url = 'https://freegeoip.net/json/'
        await fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                this.setState({
                    country: responseJson.country_name.toLowerCase()
                    // regionName: responseJson.region_name
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }

    // componentWillUnmount() {
    //     if (this.ref) {
    //         this.ref.off('value', this.handleProfileUpdate)
    //     }
    // }

    fetchTopDestination = () => {
        this.ref = firebase.database().ref(`top_destination`)
        console.log("TOP")
        this.ref.once('value', (snapshot) => {
            let topDestination = snapshot.val() || {}
            let topDestinationTitle = snapshot.val() || {}
            topDestinationTitle.forEach((o) => {
                delete o.tags
            })
            this.setState({
                topDestination,
                topDestinationTitle
            })
        })
    }

    fetchRainy = () => {
        this.ref = firebase.database().ref(`rainy_days`)
        this.ref.once('value', (snapshot) => {
            let rainy = snapshot.val() || {}
            let rainyTitle = snapshot.val() || {}
            rainyTitle.forEach((o) => {
                delete o.tags
            })
            this.setState({
                rainy,
                rainyTitle
            })
        })
    }

    fetchAllTDestinations = () => {
        this.ref = firebase.database().ref(`destinations`)
        this.ref.once('value', (snapshot) => {
            let allDestinationTitle = snapshot.val() || {}
            this.setState({
                allDestinationTitle
            })
        })
    }

    fetchRecentlyViewd = () => {
        console.log("fetch last viewd ", this.props.default.history)
        let removeDuplicated = this.removeDuplicatedTrip(this.props.default.history)
        this.setState({
            history: removeDuplicated
        })
    }

    fetchRecommends = () => {
        this.ref = firebase.database().ref(`trips`)
        this.ref.on('value', (snapshot) => {
            let trips = snapshot.val() || {}
            let newTrips = this.calculateRating(trips)
            newTrips.sort(this.compare)
            let slice = newTrips.slice(0, 7) //show only 6
            this.setState({
                recommends: slice,
                recommendsAll: newTrips
            })
        })
    }


    fetchHolidays = async () => {
        this.ref = firebase.database().ref(`holidays/${this.state.country}`)
        await this.ref.once('value', async (snapshot) => {
            let holidays = snapshot.val() || {}
            await this.setState({
                holidays
            })
        })
    }

    findComingHoliday = () => {
        let now = moment.utc()
        let year = now.year()
        let holidays = this.state.holidays
        let splitDate = []
        let startDay
        let startMonth
        let date
        let nextYear
        let diff

        holidays.forEach((holiday) => {
            splitDate = holiday.startedDate.split('-')
            startDay = splitDate[1] //day
            startMonth = splitDate[0] //month
            //create Date by adding current year, and
            //add new property
            holiday.date = new Date(`${year}-${startMonth}-${startDay}`)
            //difference between now and startDate of holiday
            diff = now.diff(holiday.date)

            //if now is eariler , diff will be negative
            //if the holiday is already passed then calculate diff between now and the holiday next year
            //e.g. now is Dec 31, then it can calculate holiday of Jan 1
            if (diff > 0) {
                nextYear = year + 1
                holiday.date = new Date(`${nextYear}-${startMonth}-${startDay}`)
                diff = now.diff(holiday.date)
            }
            holiday.diffFromNow = diff
        })

        //find upcoming holiday
        //diff are negative values, so maximum diff is the nearest holiday
        let comingHoliday = maxBy(holidays, 'diffFromNow')
        return comingHoliday
    }

    fetchTripsByHoliday = (holiday) => {
        this.ref = firebase.database().ref(`trips`)
        this.ref.on('value', (snapshot) => {
            let trips = snapshot.val() || {}
            let tripsByHoliday = this.filterTripsByHolidayDate(trips, holiday)
            this.setState({
                tripsByHoliday
            })

        })
    }

    filterTripsByHolidayDate = (trips, holiday) => {
        let filtered = []
        let now = moment.utc()
        let year = now.year()
        let startedHoliday = `${year}-`.concat(holiday.startedDate)
        let finishedHoliday = `${year}-`.concat(holiday.finishedDate)
        let diff = moment(startedHoliday).diff(finishedHoliday)
        //if finish date of holiday is before start date
        //then finish date is in the next year
        //e.g. 2017-12-31 to 2018-01-02
        if (diff > 0) {
            finishedHoliday = `${year + 1}-`.concat(holiday.finishedDate)
        }

        trips.forEach((trip) => {
            if (trip.description.startedDate) {
                //check if trip's started date is between holiday duration 
                let isBetween = moment(trip.description.startedDate).isBetween(startedHoliday, finishedHoliday, null, '[]')
                if (isBetween) {
                    filtered.push(trip)
                }
                console.log("IS BETWEEN ", isBetween)
            }
        })
        return filtered
    }

    fetchPromotions = () => {
        const tags = ['promotion']
        this.ref = firebase.database().ref(`trips`)
        this.ref.on('value', (snapshot) => {
            let trips = snapshot.val() || {}
            let promotionsAll = this.filterTripsByTags(trips, tags)
            let promotions = promotionsAll.slice(0, 7) //show only 6
            this.setState({
                promotions,
                promotionsAll
            })
        })
    }

    filterTripsByTags = (trips, tagsSearch) => {
        let searchedArray = []
        trips.forEach((trip) => {
            if (trip.tags) {
                //check if the trip contains all tags in tagSearch  
                let isContained = difference(tagsSearch, trip.tags).length === 0
                if (isContained) {
                    searchedArray.push(trip)
                }
            }
        });
        console.log("search array = ", searchedArray)
        return searchedArray
    }

    calculateRating = (trips) => {
        trips.forEach((trip) => {
            let totalScore = 0
            let rating = 0
            //The trip already has been rated 
            if (trip.rating) {
                trip.rating.forEach((elementScore) => {
                    totalScore += elementScore
                })
                let len = trip.rating.length
                rating = totalScore / len //calculate rating to 5 stars
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

    removeDuplicatedTrip = (arr) => {
        return uniqBy(arr, 'id')
    }

    // handleTopDestinationUpdate = (snapshot) => {
    //     let topDestination = snapshot.val() || {}
    //     this.setState({
    //         topDestination
    //     })

    // }

    // handleRainyUpdate = (snapshot) => {
    //     let rainy = snapshot.val() || {}
    //     // let topArray = Object.keys(top).map((k) => top[k])
    //     this.setState({
    //         rainy
    //     })
    // }

    handlePromotionUpdate = (snapshot) => {
        const tags = ['promotion']
        let trips = snapshot.val() || {}
        let promotions = this.filterTripsByTags(trips, tags)
        this.setState({
            promotions
        })
    }

    recentViewd = () => {
        if (this.props.default.state === 'initial' || this.state.history == 0)
            return null
        else {
            return (
                <View>
                    <Text style={styles.titleHome}>Recently viewd</Text>
                    <TourCarousel data={this.state.history} />
                </View>
            )
        }
    }

    onChangeText = () => {

    }

    onClearText = () => {

    }

    onSearchBarFocus = () => {
        Actions.searchModal({ topDestinationTitle: this.state.topDestinationTitle, 
                              allDestinationTitle: this.state.allDestinationTitle,
                              rainyTitle: this.state.rainyTitle
                            })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'lightblue' }}>
                {/*{this.state.search ? <Text>Picture</Text> : <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/travel-tour-ea526.appspot.com/o/teaser.jpeg.jpg?alt=media&token=5a578eff-7a47-48e1-8167-92c297f177ec" }}
                    style={styles.imageHeader} resizeMode="cover"/>}*/}
                <ScrollView style={{ flex: 1, backgroundColor: 'pink' }}>
                    {this.state.search ? <Text>Picture</Text> : <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/travel-tour-ea526.appspot.com/o/teaser.jpeg.jpg?alt=media&token=5a578eff-7a47-48e1-8167-92c297f177ec" }}
                        style={styles.imageHeader} resizeMode="cover" />}

                    <SearchBar
                        round
                        lightTheme
                        onFocus={this.onSearchBarFocus}
                        containerStyle={styles.searchBar}
                        placeholder='Type Here...' />

                    <View style={{ flex: 1, backgroundColor: 'white', paddingVertical: 30 }}>

                        {this.recentViewd()}
                        <Text style={styles.titleHome}>Recommends</Text>
                        <TourCarousel data={this.state.recommends} />
                        <Text style={styles.titleHome}>Top Destinations</Text>
                        <TourCarousel data={this.state.topDestination} />
                        <View style={styles.category}>
                            <Text style={styles.titleHome}>Promotions</Text>
                            <TouchableHighlight underlayColor={colors.underlay} onPress={() => console.log("see all")}>
                                <Text style={styles.seeAllText}>See all</Text>
                            </TouchableHighlight>
                        </View>
                        <TourCarousel data={this.state.promotions} />
                        <Text style={styles.titleHome}>Good for Rainy Days</Text>
                        <TourCarousel data={this.state.rainy} />
                        <Text style={styles.titleHome}>Upcoming Holidays</Text>
                        <TourCarousel data={this.state.tripsByHoliday} />

                        

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