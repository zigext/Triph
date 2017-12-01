import { StyleSheet } from 'react-native';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD',
    blue: '#3498DB',
    underlay: '#d4d7d8',
};

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background1
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    scrollview: {
        flex: 1,
        paddingTop: 50
    },
    scrollviewContentContainer: {
        paddingBottom: 50
    },
    exampleContainer: {
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
    titleHome: {
        paddingHorizontal: 25,
        fontSize: 16,
        fontWeight: 'bold',
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
        // top: 0,
        // bottom: 0,
        // left: 0,
        // right: 0,
        // position: 'absolute',
        flex: 1,
        height: null,
        width: null,
        // alignSelf: 'stretch'
    },
    seeAllButton: {
      
    },
    seeAllText: {
        paddingHorizontal: 25,
    },
    category: {
        flexDirection: 'row', 
        justifyContent: 'space-between'
    }
});