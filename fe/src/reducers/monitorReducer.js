import {fromJS,toJS,merge,mergeDeep} from 'immutable' ;
import {
	REQUEST_MONITOR,
	RECIEVE_MONITOR,
	NETWORK_ERROR,
	RECIEVE_UPDATE_DATA,
	ORDERED_PATCH,
	ORDERED_RECEIVE
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
  },
 
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
			return fromJS(state).merge(action.json).merge({
				isFetching:false
			})
			.toJS()
		case NETWORK_ERROR:
			return {
				error:'Network error occrued ,see the detail:'+ action.error.toString()
			}
		case RECIEVE_UPDATE_DATA:
							//sensorId,
							//status,
							//statusMsg
							//prevStatusMsg 这个字段可以优化，不需要从服务器传递过来
			//const { sensorId, statusMsg, prevStatusMsg } = action.data;  // 找出前一个，更新！			
			return updateSensor(state,action.data) ;        // 如果这里出错了就改回来
		case ORDERED_PATCH:
			const rs1 = updateSensorExtra(state,action.sensorId,true,false) ;
			debugger ;
			return rs1;
		case ORDERED_RECEIVE:
			// 返回的数据格式
			// {id,sensorId,isOk:true,prevStatusMsg}
			const {sensorId} = action.json;
			const updatedState =  updateSensor(state,{sensorId,statusMsg:'ordered'});
			const rs2 = updateSensorExtra(updatedState,sensorId,false) ;
			debugger ;
			return rs2;
		default:
			return state;
	}
}

// 根据单个传感器的sensorId，来更新当前传感器的状态。
function updateSensor(state,{sensorId, statusMsg, prevStatusMsg}){
	var cloned = fromJS(state).toJS() ;
	
	// 更新分布图中的状态
	cloned.distribute.parking.forEach((item,index)=>{
		if (item.id == sensorId) {
			if(!prevStatusMsg){
				prevStatusMsg = item.currentStatus ;
			}
			item.currentStatus = statusMsg
		}
	})

	// 更新预览图中的状态
	var detail = cloned.detail ;
	detail[prevStatusMsg] -= 1;
	detail[statusMsg] += 1;

	return cloned ;
}

function updateSensorExtra(state,sensorId,sensorFetching){
	return fromJS(state).updateIn(['distribute', 'parking'],items=>{
		return items.map((item)=>{
			debugger ;
			if (item.get('id') == sensorId) {
				item.set('sensorFetching',sensorFetching);
			}
			return item;
		})
	}).toJS()
}