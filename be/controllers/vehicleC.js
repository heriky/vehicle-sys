var Vehicle = require('../models/vehicleM'); // 导入模型
var TriggerDistance = 2 ; // 触发停车事件的距离

const mqttConst = require('../plugins/mqtt-constants') ;
const USER_OPERATE = mqttConst.userOperate ;
const SENSOR_CHANGED = mqttConst.sensorChanged ;
var mqttServer = require('../plugins/mqttPlugin').mqttServer ;


/**
 * 【上位机调用】
 * 验证上位机id是否合法.
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.validateId = function(req,res){
	var vehicleObj = req.body ;
	var id = vehicleObj.id;
	
	Vehicle.findById(id,function(err,vehicle){
		if (err) {
			console.log(err.message) ;
			throw Error(err) ;
		}
		if (vehicle == null) {
			res.status(401).send(Object.assign({},null,{
				errMsg:'未找到的id值，请重新配置软件！'
			}))
		}
	})
}

/**【上位机调用】
 * 处理停车场初始化数据的存储，并返回唯一_id。当一个新的应用部署时，需要初始化停车场数据，以获取当前停车场
 * 的位置信息（定位使用）、名称、传感器初始状态等信息。数据被存储入数据库之后会生成唯一的_id，
 * 将该_id返回，作为停车场之后数据提交的凭证。初始化过后，如果某个传感器的数据变化要提交服务器时，
 * 则使用该_id作为凭证更新sensors中的数据。
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.save = function(req,res){
	var vehicleObj = req.body ;
	
	var requiredInfo = Object.assign({},vehicleObj,{
		sensors:vehicleObj.sensors.map(function(sensor,index){
			var currentDistance = parseInt(sensor.distance) ;
			return {
				sensorId: 	sensor.sensorId,
				loc: 		  	sensor.loc,
				status :  	currentDistance > 2 ? 0 : 1,
				statusMsg : currentDistance > 2 ? "idle" : "busy" ,
				distance: 	currentDistance,
			} ;
		})
	});

	if (vehicleObj.id) {
		requiredInfo._id = vehicleObj.id; // 如果当前id已经存在，则save自动变成update,防止用户多次初始化造成的冗余_id	
	}

	var _vehicle = new Vehicle(requiredInfo);

	_vehicle.save()
		.then(function(vehicle){
			return res.status(201).send(JSON.stringify(vehicle)) ;
		})
		.catch(function(){
				console.log(err.statck);
				return res.status(500).json({err:{code:-1,msg:err.message}}) ;
		}) ;


}

/**【上位机调用】
 * 传感器数据发生了变化，更新相关传感器数据。依据停车场唯一_id和sensorId,可以准确查询到相关sensor的值，并更新
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.updateSensor = function(req,res){
	var patchData = req.body;
	
	var id = patchData.id; 
	var patchedSensor = patchData.patchedSensor ;

	var sensorId = patchedSensor.sensorId;
	var distance = patchedSensor.distance ;
	var loc = patchedSensor.loc;
	var status = distance > 2 ? 0 : 1;
	var statusMsg = distance > 2 ? "idle" : "busy" ;

	var prevStatusMsg ;

	Vehicle.findById(id,function(err,vehicle){
		if (vehicle) {
			var sensors = vehicle.sensors ;

			sensors.forEach(function(sensor,index){
				if (sensor.sensorId === sensorId) {
					prevStatusMsg = sensor.statusMsg ; //  这里便于客户端更新消息,找出原始的状态

					Object.assign(sensor,{
						distance: distance,
						loc: 			loc,
						status: 	status,
						statusMsg:statusMsg
					});
					return ; // 找到后终止
				}
			}) ; 

			vehicle.save(function(err,_vehicle){  // vehicle 加下划线只是为了与vehicle， _vehicle 和 vehicle
				if(err){
					console.log("更新失败")
					return res.status(500).end(err.message);
				}

				if (_vehicle) {
					console.log('更新成功') ; 

					// 更新成功后同时当前broker推送sensor_changed 主题的mqtt消息到各个订阅的客户端，以便使用。
					var message = {
						topic:mqttConst.sensorChanged+id, // 当前停车场的id标志
						payload:JSON.stringify({
							sensorId,
							status,
							statusMsg,
							prevStatusMsg,
						}),		// 当前停车场的所有数据
						qos:0,
						retain:false
					};
					mqttServer.publish(message,function(){
						console.log(`主题消息${mqttConst.sensorChanged+id}成功发送！`) ;
					})

					res.status(201).send(JSON.stringify(_vehicle)) ;
				}else{
					console.log('无任何更新') ; 
					res.status(201).send(JSON.stringify(vehicle)) ;
				}
			})

		}else{
			res.status(422).end('无效的停车场id');
			throw err;
		}
	})	
}

/**
 * 【客户端调用】
 * 客户端获取当前数据库中所有停车场列表。引导用户进一步点击选择。
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.fetchAll = (req,res)=>{
	Vehicle.fetchAll(function(err,vehicles){
		if(err){
			console.log(err.message) ;
			res.status(500).send("Internal Errror by hk") ;
		}
		res.json({
			ids: vehicles.map((vehicle,index)=> vehicle._id)  ,
			names: vehicles.map((vehicle,index)=> vehicle.name)   // 只提供id值和name值
		})
	})
}

/**
 * 【客户端调用】
 * 获取特定停车场的车位信息。 调用url格式为 /api/v1/vehicles/fjlasdfjladfj2100ulsdfljkjl (最后面为id值)
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.fetch = (req,res)=>{
	var id = req.params.id ;
	console.log('当前id为:'+id) ;

	if (id && id.length!==24) {   // 防止index.js.map又来骚扰
		return res.end('无效的id');
	}

	Vehicle.findById(id,function(err,vehicle){ // 当前停车场
		if (err) {
			console.log(err.message) ;
			return res.status(500).send('Internal Error by hk') ;
		}
		
		if(!vehicle){   // 防止无效恶意id值
			console.log('无效的停车场id'); 
			throw Error("无效的停车场id")} ;
		
		const sensors = vehicle.sensors ; // 当前停车场的传感器们
		var information = {
			info:{
				id:vehicle._id,
				name:vehicle.name,
				location: vehicle.location,
				status: 1,
			},
			detail:{
				total: sensors.length,
				busy: sensors.filter(sensor=> sensor.status === 1).length,
				ordered: sensors.filter(sensor => sensor.status === 2).length,
				idle: sensors.filter(sensor => sensor.status === 0).length
			},
			distribute:{
				total: sensors.length,
				parking: sensors.map((sensor,index)=>{
					return {
						id:sensor.sensorId,
						pos:[998,998],
						currentStatus:sensor.statusMsg 
					}
				})
			}
		};
		
		res.json(information) ;
	})
}

/**
 * 【客户端调用】
 * 预定车位时调用次方法，将数据库中车位状态改变为"ordered"
 * @param  {RequestStream} req  请求对象
 * @param  {ReponseStream} res  相应对象
 * @return {null}          null
 */
exports.order = (req,res)=>{
	  // 停车场的唯一id
	// var patchData = req.body ; //  提交json:{ sesorId, statusMsg} 提交sensorId和原始的状态
	// var id = patchData.id;
	// var sensorId = patchData.sensorId ;
	// var prevStatusMsg = patchData.statusMsg ;
	
	var combinedId = req.params.id;
	combinedId = combinedId.split('&') ;
	var id = combinedId[0] ;									// id 表示上位机的id值
	var sensorId = parseInt(combinedId[1]) ;  // sensorId是传感器的id值

	Vehicle.findById(id,function(err,vehicle){
		if (err) {
			console.log(err.message) ;
			return res.status(404).send("无效的ID，无相应的页面")
		}
		
		if(!vehicle){   // 防止无效恶意id值
			console.log('无效的停车场id'); 
			throw Error("无效的停车场id")} ;
		
		const sensors = vehicle.sensors ;

		sensors.forEach(function(sensor,index){
			if (sensor.sensorId === sensorId) {  // 找到相应的id值，将其变成"预订状态",状态值为2
				sensor.status = 2 ;
				sensor.statusMsg = 'ordered' ;
			}
		}) ; 
		
		vehicle.save(function(err,_vehicle){ 
			if (err) {
				console.log('Internal error by hk') ;
				throw err;
			}
			
			if(!_vehicle){console.log("用户控制无更新，错误的id值引起！"); throw err;} ;
			
			console.log('用户预定车位操作成功！发送mqtt消息！') ;

			mqttServer.publish({
				topic: USER_OPERATE+id, 
				payload: JSON.stringify({
					id:id,
					sensorId:sensorId,
					currentStatusMsg:'ordered'
				})
			});
			
			console.log('当前sensorId为:'+sensorId)
			

			// 以上操作保证了车位被占用时，数据库中相应的数据发生了变化，将"占用状态"持久化了。
			// 当多个客户端被打开时，一个用户占用了车位，其他用户界面上的状态也应该自动发生变化，为了保证此变化
			// 这里发送一个"伪sensor_changed消息"，因为不是真正发生了sensor_changed事件，而是为了利用sensor_changed事件能主动更新
			// 界面的特性，所示是"伪sensor_changed消息"
			
			var message = {
				topic:mqttConst.sensorChanged+id, // 当前停车场的id标志
				payload:JSON.stringify({
					sensorId,
					status: 2,
					statusMsg: 'ordered',
					prevStatusMsg: 'idle',
				}),		// 当前停车场的所有数据
				qos:0,
				retain:false
			};
			mqttServer.publish(message,function(){
				console.log(`伪sensor_changed消息：${mqttConst.sensorChanged+id}成功发送！共享占用状态`) ;
			});


			// 最后返回状态码
			
			return res.status(201).json({
				isOK:true,
				id:id,
				sensorId:sensorId
			});

		})
	})
}

