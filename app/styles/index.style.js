import { StyleSheet, Dimensions } from 'react-native';
// import { Dimensions } from 'Dimensions'

const { width, height } = Dimensions.get('window')

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD',
    blue: '#3498DB',
    underlay: '#d4d7d8',
    modalBackground: '#424242',
    lightGray: '#757575',
};

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        // justifyContent: 'center',

        // backgroundColor: colors.background1
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    scrollview: {
        flex: 1,
        paddingTop: 50,
    },
    // scrollviewContentContainer: {
    //     paddingBottom: 50
    // },
    // scrollviewContent: {
    //     padding: 25,
    // },
    exampleContainer: {
        marginBottom: 30
    },
    carouselContainer: {
        marginBottom: 30
    },
    title: {
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    subHeader: {
        // marginHorizontal: 25,
        fontSize: 16,
        fontWeight: 'bold',
    },
    titleSearch: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 25,
    },
    titleDetail: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        marginTop: 5,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    detailContent: {
        margin: 25,
    },
    detailText: {
        fontSize: 16,
    },
    slider: {
        marginTop: 25
    },
    sliderContentContainer: {
    },
    paginationContainer: {
        paddingVertical: 8
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 8
    },
    imageHeader: {
        height: 200,
        width: 'auto',
    },
    imageTripDetail: {
        height: 500,
        width: 'auto',
    },
    seeAllButton: {

    },
    seeAllText: {
        // paddingHorizontal: 25,
    },
    category: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    searchBar: {
        flex: 1,
        opacity: 0.5,
        position: 'absolute',
        left: 0,
        top: 0,
        width: width,
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
    },
    topic: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 15,
        paddingHorizontal: 21,
        color: 'white',
    },
    modal: {
        backgroundColor: colors.modalBackground,
        flex: 1,
    },
    modalContent: {
        flex: 1,
        paddingVertical: 50,
        paddingTop: 100,

    },
    modalTitleList: {
        color: 'white',

        // fontSize: 16,
    },
    modalList: {
        borderBottomColor: colors.lightGray,
        backgroundColor: colors.modalBackground,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        marginHorizontal: 10,
        marginBottom: 25,

    },

    modalListItem: {
        borderBottomColor: colors.lightGray,
        borderBottomWidth: 0.5,


    }
});