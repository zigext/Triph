import React, { Component } from 'react'
import { View, ScrollView, Text } from 'react-native'
import { SearchBar, List, ListItem, Divider } from 'react-native-elements'
import styles, { colors } from '../styles/index.style'
export default class SearchModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            initialTrips: []
        }
    }
    // https://codepen.io/mtclmn/pen/QyPVJp
    filterList = (text) => {
        console.log(text)
        // var updatedList = this.state.initialItems;
        // updatedList = updatedList.filter(function (item) {
        //     return item.toLowerCase().search(
        //         event.target.value.toLowerCase()) !== -1;
        // });
        // this.setState({ items: updatedList });
    }

    render() {
        
        return (
            <View style={styles.modal}>
                <SearchBar
                    round
                    containerStyle={[styles.searchBar, { opacity: 1, paddingVertical: 50 }]}
                    inputStyle={{ fontSize: 18 }}
                    icon={{ paddingVertical: 50 }}
                    placeholder='Where to?'
                    onChangeText={this.filterList} />

                <View style={styles.modalContent}>
                    <Text style={styles.topic}>Popular destinations</Text>
                    <List containerStyle={styles.modalList}>
                        {
                            this.props.topDestinationName.map((item, i) => (
                                <ListItem
                                    key={i}
                                    title={item.title}
                                    hideChevron
                                    titleStyle={styles.modalTitleList}
                                />
                            ))

                        }
                    </List>
                </View>
            </View>
        );
    }
}