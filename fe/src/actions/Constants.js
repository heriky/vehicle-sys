
// 处理首屏数据拉去的网络操作
export const REQUEST_MONITOR = "REQUEST_MONITOR" ; // 发送请求开始时触发的事件
export const RECIEVE_MONITOR = "RECIEVE_MONITOR"  // 发送请求结束后
export const NETWORK_ERROR = "NETWORK_ERROR" ; //promise请求网络异常

// 通用网络异常
export const INVALIDATE_PREVIEW = "INVALIDATE_PREVIEW" ; // 改变当前状态


// 获取所有停车场的数据
export const REQUEST_ALL_VEHICLES = "request_all_vehicles_info"  ;
export const RECIEVE_ALL_VEHICLES = 'receive_all_vehicles_info'


// 接受服务器推送，进行更新。

export const RECIEVE_UPDATE_DATA = 'receive_update_data' ;

// 用户操作

export const ORDERED_PATCH = 'ordered_patch' ; // 开始发送反向请求
export const ORDERED_RECEIVE = 'ordered_receive' ; // 接收响应数据