var express = require('express') ;
var path = require('path') ;
var bodyParser = require('body-parser') ;
//var multer = require('multeer');
var cookieParser = require('cookie-parser') ;
var session = require('express-session') ;
var mongoStore = require('connect-mongo')(session);
//var redisStore = require('connect-redis')(session);
var mongoose = require('mongoose') ;
var logger = require('morgan');

var app = express() ;

// 1.基本配置
app.set('env','dev') ;
app.set('views',path.resolve(__dirname,'views'));
app.set('view engine','ejs');

app.use(logger('dev'));
app.use(bodyParser.json()) ;
app.use(bodyParser.urlencoded({extended:true}));
//app.use(multer({dest:'/tmp'}).array('uploadFile'));
app.use(cookieParser) ;
app.use(session({
	secret: 'There is 128 chars recommended',
	cookie: {
	    maxAge: 1800 * 1000,
	    httpOnly: true
	},
	store: new mongoStore({
	    url: dbUrl,
	    collection: 'sessions'
	}),
	resave: true,
	saveUninitialized: false
}));


//2. 配置生产环境

if ('dev' === app.get('env')) {
    app.set('showStackError', true);
    app.use(logger(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

// 3. 路由总入口

var routes = require('./routes') ;
app.use(routes) ;

// 4.处理错误
// 500 错误
app.use(function(err,req,res,next){
	if (err) {
		console.log(err.stack) ;
		res.status(500).send('Server Internal Error:'+err.message)
		throw err;
	}else{
		next() ;
	}
})
// 404错误，前面路由全部不匹配的情况下，才会出现404
app.use(function(err,req,res,next){
	var err = new Error('404 NOT FOUND!') ;
	console.log(err.stack) ;
	res.status(404).send('404 NOT FOUND!')
})


// 5.开启监听
app.on('error',onError)
app.on('listening',function(){
	console.log('正在监听')
})

var port = process.env.PORT || 3000 ;
app.set('port',port) ;
app.listen(port,function(){   // 正在监听
	console.log('Server is running on port '+port)
})

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
