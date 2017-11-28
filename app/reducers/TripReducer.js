import * as types from '../actions/actionTypes'

const initialState = {
    state: "initial",
    history: [],
}

export default function TripReducer(state = initialState, action = {}) {
    console.log('TripReducer was called with state', state, 'and action', action)
    switch (action.type) {
        case types.CLICK_TO_VIEW_DETAIL: 
            if(state.history.length > 5){ //only save 6 recently viewd trips 
                console.log("HISTORY FULL")
                console.log("HISTORY length before ", state.history.length)
                state.history.shift() //remove first element from array
            }
            console.log("HISTORY length after ", state.history.length)
            return {
                ...state,
                state: 'used',
                history: [...state.history, action.payload]
            }
        
        case types.GET_PROFILE:
            return {
                ...state,
                user: Object.assign(state.user, action.payload)
            }

        default:
            return state
    }
}