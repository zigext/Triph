import React, { Component } from 'react'
import { View, ScrollView, Text, TouchableHighlight } from 'react-native'
import { SearchBar, List, ListItem, Button } from 'react-native-elements'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import styles, { colors } from '../styles/index.style'
import { searchDestination } from '../actions/TripAction'

class SearchModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            // initialTrips: [],
            allDestinationsFiltered: this.props.allDestinationTitle,
            allDestinationsInitial: this.props.allDestinationTitle,

        }
    }
   
    filterSearch = (text) => {
        const filtered = this.state.allDestinationsInitial.filter(function (item) {
            const itemData = item.title.toLowerCase().replace(/\s/g, '')
            const textData = text.toLowerCase().replace(/\s/g, '')
            return itemData.indexOf(textData) > -1
        })
        this.setState({
            allDestinationsFiltered: filtered,
            search: text
        })
    }

    chooseDestination = (destination) => {
        this.props.callback(destination)
        Actions.pop({ refresh: { test: 123 } })
    }

    onReset = () => {
        console.log("reset")
        this.props.callbackReset()
        Actions.pop()
    }


    //                     icon={{ paddingVertical: 50 }}
    render() {

        return (
            <View style={styles.modal}>


                <ScrollView>

                    <SearchBar
                        round
                        containerStyle={[styles.searchBar, { opacity: 1, marginVertical: 50 }]}
                        inputStyle={{ fontSize: 18 }}
                        placeholder='Where to?'
                        placeholderTextColor={colors.blue}
                        icon={{color: colors.blue}}
                        onChangeText={this.filterSearch}
                    />



                    <View style={styles.modalContent}>

                   
                        <Button
                            raised
                            icon={{ name: 'cached' }}
                            title='Reset'
                            backgroundColor='#444649'
                            onPress={this.onReset}
                            containerViewStyle={{alignSelf: 'flex-end', marginTop: 10}} />


                        <List containerStyle={styles.modalList}>
                            {
                                this.state.allDestinationsFiltered.map((item, i) => (
                                    <ListItem
                                        key={i}
                                        title={item.title}
                                        hideChevron
                                        titleStyle={styles.modalTitleList}
                                        containerStyle={styles.modalListItem}
                                        onPress={() => this.chooseDestination(item)}
                                    />
                                ))

                            }
                        </List>

                        <Text style={styles.topic}>Popular destinations</Text>

                        <List containerStyle={styles.modalList}>
                            {
                                this.props.topDestinationTitle.map((item, i) => (
                                    <ListItem
                                        key={i}
                                        title={item.title}
                                        hideChevron
                                        titleStyle={styles.modalTitleList}
                                        containerStyle={styles.modalListItem}
                                        onPress={() => this.chooseDestination(item)}
                                    />
                                ))

                            }
                        </List>

                        <Text style={styles.topic}>Good for rainy days</Text>

                        <List containerStyle={styles.modalList}>
                            {
                                this.props.rainyTitle.map((item, i) => (
                                    <ListItem
                                        key={i}
                                        title={item.title}
                                        hideChevron
                                        titleStyle={styles.modalTitleList}
                                        containerStyle={styles.modalListItem}
                                        onPress={() => this.chooseDestination(item)}
                                    />
                                ))

                            }
                        </List>
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
        dispatchSearch: (destination) => dispatch(searchDestination(destination))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchModal)