
import {fromJS,toJS,merge,mergeDeep} from 'immutable' ;
import { REQUEST_ALL_VEHICLES, RECIEVE_ALL_VEHICLES } from '../actions/Constants' ;

const initialState = { ids:[],names:[] };
export default (state = initialState,action)=>{
	
	switch (action.type) {
		case REQUEST_ALL_VEHICLES:
			return state;
		case RECIEVE_ALL_VEHICLES:
			const rs =  fromJS(state).merge(action.json).toJS() ;
			return rs;
		default:
			return state;
	}
}

