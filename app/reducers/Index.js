import * as tripReducer from './TripReducer'
import { combineReducers } from 'redux'

// export {
//   userReducer
// }

// export default reducer = combineReducers({
//     userReducer
// })

// const rootReducer = combineReducers({
//     userReducer
// });
// console.log("root reducer = ", rootReducer)
// export default rootReducer

export default combineReducers(Object.assign(
    tripReducer,   
))

// export default combineReducers({
//     tripReducer: tripReducer
// })

// const reducers = combineReducers({
// 	tripReducer: tripReducer
// });

// export default reducers

