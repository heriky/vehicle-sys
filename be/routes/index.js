var express = require('express') ;
var router = express.Router() ;

router.route('/')
	.get(function(res,req){
		res.send("测试成功！Hello world！")
	})