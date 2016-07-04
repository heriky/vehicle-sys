import {applyMiddleware,createStore} from 'redux' 
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import {callAPIMiddleware} from '../middlewares/APIMiddleware' ;
import rootReducer from '../reducers'

const loggerMiddleware = createLogger() ;
export default (initialState)=>{
	return createStore(
		rootReducer,
		initialState,
		applyMiddleware(
			callAPIMiddleware,
			thunkMiddleware,
			typeof window != 'undefined' ? loggerMiddleware :({dispatch})=>next=>action=>{return next(action)} 
	))
}