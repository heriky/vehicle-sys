import { ORDERED_PATCH, ORDERED_RECEIVE,NETWORK_ERROR } from './Constants' ;
var qs = require('querystring') ;

const  BASE_URL =  typeof window === 'undefined' ? "http://localhost:3000" : "http://localhost:3001"

function patch_ordered(sensorId){
	return {
		type: ORDERED_PATCH,
		sensorId,
	}
}

function received_oredered(sensorId){
	return {
		type: ORDERED_RECEIVE,
		sensorId,
	}
}



export function userOrder(data){  // params: 停车场id， data:{id,sensorId,status}提交sensorid和当前状态字符串
	debugger ;
	const requestUrl = BASE_URL +"/api/v1/vehicle/"+ data.id+'&'+data.sensorId ;
	return {
		types:[ORDERED_PATCH, ORDERED_RECEIVE,NETWORK_ERROR],
		payload:{sensorId:data.sensorId, requestUrl},
		shouldCallAPI:(state)=>true,
		API: ()=> fetch(requestUrl,{method:'PATCH',body:qs.stringify(data)})  // 分离的好，把fetch分离出来，易于配置。

		// 问题记录： fetch这个api有点问题，无法提交额外的数据，针对post和patch都无法提交
	}
	
}
