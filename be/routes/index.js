var express = require('express') ;
var router = express.Router() ;

var vehiclesC = require('../controllers/vehicleC') // 导入控制器

router.all('/',function(req,res){
	res.status(200).send('主页')
})

router.route('/api')
			.get(function(req,res){
				res.end("测试成功！Hello world！")
			});

router.route('/api/v1/vehicles')
		  .post(vehiclesC.save)            // 上位机使用, 初始化数据
		  .patch(vehiclesC.updateSensor)   // 上位机使用，传感器数据有更新
		  .get(vehiclesC.fetchAll) ;       // 客户端调用，获取所有停车场id,name

router.route('/api/v1/vehicle/:id') // 
			.get(vehiclesC.fetch)        // 客户端使用，获取单个停车场信息
			.patch(vehiclesC.order);       // 客户端使用，提交客户端操作(占用车位) id为停车场id


module.exports = router;