import { AsyncStorage } from 'react-native'
import CreateLogger from 'redux-logger'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { autoRehydrate, persistCombineReducers } from 'redux-persist'
// import storage from 'redux-persist/es/storage' // default: localStorage if web, AsyncStorage if react-native

import reducers from '../reducers/Index'
import TripReducer from '../reducers/TripReducer'

// const config = {
//     key: 'root',
//     storage: AsyncStorage
// }
// const reducer = persistCombineReducers(config, {TripReducer})

const store = createStore(
    reducers,
    undefined,
    compose(
        applyMiddleware(CreateLogger),
        autoRehydrate()
    )
)
export default store