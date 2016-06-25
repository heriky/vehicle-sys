import {fromJS,toJS,merge,mergeDeep} from 'immutable' ;
import {
	REQUEST_MONITOR,
	RECIEVE_MONITOR,
	NETWORK_ERROR,
	} from '../actions/Constants' ;
// isFetching:false,
// info:{
// 	location:["",""],
// 	status:1
// },
// detail:{
// 	total:20,
// 	busy:8,
// 	ordered:5,
// 	idle:7
// },
// distribute:{
// }
const initialState = {
	info:{
		id:0,
		name:'',
		location:["00.000","00.000"],
		status:0
	},
	isFetching:false,
  detail:{
		total:0,
		busy:0,
		ordered:0,
		idle:0,
  },
  distribute:{
  	total:0,
  	parking:[]
  }
} ;
export default (state=initialState,action)=>{
	switch(action.type){
		case REQUEST_MONITOR:
			return fromJS(state).merge({
				isFetching:true
			}).toJS();
		case RECIEVE_MONITOR:
			// const {
			// 	info:{id,location,status},
			// 	detail:{total,busy,ordered,idle},
			// 	distribute
			// } = action.json;
			const rs = fromJS(state).merge({
				isFetching:false
			})
			.merge(action.json)
			.toJS()
			return rs;
		case NETWORK_ERROR:
			return {
				error:'Network error occrued ,see the detail:'+ action.error.toString()
			}
		default:
			return state;
	}
}