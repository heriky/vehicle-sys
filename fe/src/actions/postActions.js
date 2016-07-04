import fetch from 'isomorphic-fetch' ;
import {REQUEST_MONITOR,RECIEVE_MONITOR,NETWORK_ERROR} from './Constants' ;
import {REQUEST_ALL_VEHICLES, RECIEVE_ALL_VEHICLES } from './Constants' ;

const  BASE_URL =  typeof window === 'undefined' ? "http://localhost:3000" : "http://localhost:3001"

/// 通用Action
function networkError(error){
	return {
		type: NETWORK_ERROR ,
		error
	}
}


// 同步action,处理异步回调。异步Action处理非纯请求，并调用同步action发生动作
// 
// 1.info请求
function requestInfo(params){  // 发送请求之前
	return {
		type:REQUEST_MONITOR,
		params
	}
}

function receiveInfo(json,params){ // 发送请求返回之后
	return {
		type:RECIEVE_MONITOR,
		json,
		params
	}
}


// 异步action

// 如果仅仅是客户端调用那么requestUrl可以在使用的时候传入，但是这里是要配合server rendering自动完成数据
// 提取的，因此必须在这里明确请求的url地址。
export function infoAPI(params){ 
	let requestUrl = BASE_URL+"/api/v1/vehicle/" ; 

	console.log('当前负载params.id是：'+params.id) ;
	requestUrl = requestUrl + (params.id || 0 );
	console.log('当前请求的url是' +  requestUrl) ;
	return {
		types:[REQUEST_MONITOR,RECIEVE_MONITOR,NETWORK_ERROR],
		payload:{params,requestUrl},  // 这样的写法是很有讲究的，这是一个技巧性的问题，用于合并的时候非常有用
		shouldCallAPI:(state)=>true,
		API: ()=>fetch(requestUrl)
	}
}


// callAPI 中间件中自动生成了action，因此这里不需要额外定义对应的同步action了。
// 获取
export function selectorsAPI(params){
	let requestUrl = BASE_URL+"/api/v1/vehicles"
	return {
		types:[REQUEST_ALL_VEHICLES, RECIEVE_ALL_VEHICLES,NETWORK_ERROR],
		payload:{params,requestUrl},
		shouldCallAPI:(state)=>true,
		API: ()=> fetch(requestUrl)
	}
}

