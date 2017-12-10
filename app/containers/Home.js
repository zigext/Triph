import React, { Component } from 'react';
import { View, ScrollView, Text, Image, AsyncStorage, TouchableHighlight, Keyboard, StyleSheet } from 'react-native'
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
            search: null,
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
            allTrips: [],
            halfDay: [],
            fullDay: [],
            twoDay: [],
            threeDay: [],
            reset: false,

        }
        //not nescessary
        this.onSearchDone = this.onSearchDone.bind(this)
        this.onResetSearch = this.onResetSearch.bind(this)
    }




    componentWillMount = async () => {

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

        if (this.props.search) {
            console.log("mounted again")
            await this.onSearchDone(this.props.search)
        }

    }

    componentWillReceiveProps = (nextProps) => {
        console.log("RECEIVE ", nextProps)

    }

    fetchCountry = async () => {
        //url for fetching country and region name
        let url = 'https://freegeoip.net/json/'
        await fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    country: responseJson.country_name.toLowerCase()
                    // regionName: responseJson.region_name
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }

    onSearchDone = async (destination) => {
        console.log("ON SEARCH DONE ", destination)
        await this.setState({
            search: destination
        })
        console.log("STATE SEARCH ", this.state.search)
        let desStr = this.state.search.title.toLowerCase().replace(/\s/g, '')
        this.fetchRecommends(desStr)
        this.FetchTripsByDuration("halfday", desStr)
        this.FetchTripsByDuration("fullday", desStr)
        this.FetchTripsByDuration("2days", desStr)
        this.FetchTripsByDuration("3days", desStr)
        // Actions.refresh()
    }

    //show default home scene
    onResetSearch = async () => {
        console.log("callback")
        await this.setState({
            search: null
        })
        this.fetchRecommends()
        // this.renderBeforeSearch()
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

    fetchAllTrips = () => {
        this.ref = firebase.database().ref(`trips`)
        this.ref.on('value', (snapshot) => {
            let allTrips = snapshot.val() || {}
            this.setState({
                allTrips
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

    //fetch by rating
    fetchRecommends = (destination = null) => {
        this.ref = firebase.database().ref(`trips`)
        this.ref.on('value', (snapshot) => {
            let trips = snapshot.val() || {}
            if (destination) {
                console.log("IF")
                trips = this.filterTripsByTags(trips, [destination])
                console.log("IF ", trips)
                console.log("IF ", [destination])
            }
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

    FetchTripsByDuration = (duration, destination) => {
        //to lower case and replace all whitespaces

        let tags = [duration, destination]
        this.ref = firebase.database().ref(`trips`)
        this.ref.on('value', (snapshot) => {
            let trips = snapshot.val() || {}
            let filtered = this.filterTripsByTags(trips, tags)
            console.log("filter ", filtered)
            switch (duration) {
                case "halfday":
                    this.setState({
                        halfDay: filtered
                    })
                    break
                case "fullday":
                    this.setState({
                        fullDay: filtered
                    })
                    break
                case "2days":
                    this.setState({
                        twoDay: filtered
                    })
                    break
                case "3days":
                    this.setState({
                        threeDay: filtered
                    })
                    break
                default:
                    return
            }
            // let promotions = promotionsAll.slice(0, 7) //show only 6
            // this.setState({
            //     promotions,
            //     promotionsAll
            // })
        })
    }

    recentViewd = () => {
        if (this.props.default.state === 'initial' || this.state.history == 0)
            return null
        else {
            return (
                <View>
                    <Text style={styles.subHeader}>Recently viewd</Text>
                    <TourCarousel data={this.state.history} />
                </View>
            )
        }
    }

    onSearchBarFocus = () => {
        Actions.searchModal({
            topDestinationTitle: this.state.topDestinationTitle,
            allDestinationTitle: this.state.allDestinationTitle,
            rainyTitle: this.state.rainyTitle,
            callback: this.onSearchDone,
            callbackReset: this.onResetSearch,
        })
    }

    onPressSeeAll = () => {
        //go to list of all trips that match the tags
    }

    renderBeforeSearch = () => {

        return (
            <View style={styles.detailContent}>
                {this.recentViewd()}
                <View style={_styles.category}>
                    <Text style={styles.subHeader}>Recommends</Text>
                    <TouchableHighlight underlayColor={colors.underlay} onPress={this.onPressSeeAll}>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableHighlight>
                </View>
                <TourCarousel data={this.state.recommends} />

                <Text style={styles.subHeader}>Top Destinations</Text>
                <TourCarousel data={this.state.topDestination} />

                <View style={_styles.category}>
                    <Text style={styles.subHeader}>Promotions</Text>
                    <TouchableHighlight underlayColor={colors.underlay} onPress={this.onPressSeeAll}>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableHighlight>
                </View>
                <TourCarousel data={this.state.promotions} />

                <Text style={styles.subHeader}>Good for Rainy Days</Text>
                <TourCarousel data={this.state.rainy} />

                <Text style={styles.subHeader}>Upcoming Holidays</Text>
                <TourCarousel data={this.state.tripsByHoliday} />

            </View>
        )
    }

    renderAfterSearch = () => {


        return (
            <View style={styles.detailContent}>

                <Text style={styles.titleSearch}>{this.state.search.title}</Text>

                <View style={styles.category}>
                    <Text style={styles.subHeader}>Recommends</Text>
                    <TouchableHighlight underlayColor={colors.underlay} onPress={this.onPressSeeAll}>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableHighlight>
                </View>
                <TourCarousel data={this.state.recommends} />

                <View style={_styles.category}>
                    <Text style={styles.subHeader}>Half day</Text>
                    <TouchableHighlight underlayColor={colors.underlay} onPress={this.onPressSeeAll}>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableHighlight>
                </View>

                {(this.state.halfDay.length > 0) ? <TourCarousel data={this.state.halfDay} /> : <Text style={_styles.noTripText}>No trips</Text>}

                <View style={_styles.category}>
                    <Text style={styles.subHeader}>Full day</Text>
                    <TouchableHighlight underlayColor={colors.underlay} onPress={this.onPressSeeAll}>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableHighlight>
                </View>
                {(this.state.fullDay.length > 0) ? <TourCarousel data={this.state.fullDay} /> : <Text style={_styles.noTripText}>No trips</Text>}

                <View style={_styles.category}>
                    <Text style={styles.subHeader}>2 Days 1 Night</Text>
                    <TouchableHighlight underlayColor={colors.underlay} onPress={this.onPressSeeAll}>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableHighlight>
                </View>
                {(this.state.twoDay.length > 0) ? <TourCarousel data={this.state.twoDay} /> : <Text style={_styles.noTripText}>No trips</Text>}

                <View style={_styles.category}>
                    <Text style={styles.subHeader}>3 Days 2 Nights</Text>
                    <TouchableHighlight underlayColor={colors.underlay} onPress={this.onPressSeeAll}>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableHighlight>
                </View>
                {(this.state.threeDay.length > 0) ? <TourCarousel data={this.state.threeDay} /> : <Text style={_styles.noTripText}>No trips</Text>}

            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>

                <ScrollView style={styles.container}>
                    {this.state.search ? <Image source={{ uri: this.state.search.image }}
                        style={styles.imageHeader} resizeMode="cover" /> :
                        <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/travel-tour-ea526.appspot.com/o/teaser.jpeg.jpg?alt=media&token=5a578eff-7a47-48e1-8167-92c297f177ec" }}
                            style={styles.imageHeader} resizeMode="cover" />}

                    <SearchBar
                        round
                        lightTheme
                        onFocus={this.onSearchBarFocus}
                        containerStyle={styles.searchBar}
                        inputStyle={{ fontSize: 18 }}
                        placeholder='Where to?' />

                    <View style={[{ marginVertical: 30 }]}>

                        {this.state.search ? this.renderAfterSearch() : this.renderBeforeSearch()}

                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return state
}

const mapDispatchToProps = (dispatch) => {
    return {
        // dispatchStartActivity: () => dispatch(startActivity())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

const _styles = StyleSheet.create({
    noTripText: {
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 25,
    },
    category: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

});