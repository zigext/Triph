import * as types from './actionTypes';

export const viewTrip = (trip) => {
    return {
        type: types.CLICK_TO_VIEW_DETAIL,
        payload: {
            ...trip
        }
    }
}

export const searchDestination = (destination) => {
    return {
        type: types.SEARCH,
        payload: {
            ...destination
        }
    }
}
