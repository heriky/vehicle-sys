
// 处理首屏数据拉去的网络操作
export const REQUEST_MONITOR = "REQUEST_MONITOR" ; // 发送请求开始时触发的事件
export const RECIEVE_MONITOR = "RECIEVE_MONITOR"  // 发送请求结束后
export const NETWORK_ERROR = "NETWORK_ERROR" ; //promise请求网络异常

// 处理首屏detail数据拉取
export const REQUEST_DETAIL = 'REQUEST_DETAIL'
export const RECIEVE_DETAIL = 'RECIEVE_DETAIL'



// 网络异常
export const INVALIDATE_PREVIEW = "INVALIDATE_PREVIEW" ; // 改变当前状态


// 获取全部停车场的数据
export const REQUEST_ALL_VEHICLES = "request_all_vehicles_info"  ;
export const RECIEVE_ALL_VEHICLES = 'receive_all_vehicles_info'