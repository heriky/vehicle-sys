import fetch from 'isomorphic-fetch' ;
import {REQUEST_MONITOR,RECIEVE_MONITOR,NETWORK_ERROR} from './Constants' ;
import {REQUEST_DETAIL,RECIEVE_DETAIL} from './Constants' ;


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

// 异步请求预览信息info, 这里requestUrl写死了，因为infoAPI是针对特定的地址进行请求，不需要暴露参数
// 另外，写死的话有利于server rendering中的fetchDependentData进行操作。
const requestUrl = "http://localhost:3000/api/info" ; 
// 首屏向着渲染服务器请求数据，这里不能直接在客户端使用这个url，会发生跨域问题
export function infoAPI(params){ 
	console.log('当前负载params是：')
	console.log(params) ;
	return {
		types:[REQUEST_MONITOR,RECIEVE_MONITOR,NETWORK_ERROR],
		payload:{params,requestUrl},  // 这样的写法是很有讲究的，这是一个技巧性的问题，用于合并的时候非常有用
		shouldCallAPI:(state)=>true,
		API: ()=>fetch(requestUrl)
	}
}

