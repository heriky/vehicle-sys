import express from 'express';
import path from 'path'
import httpProxy from 'http-proxy';

import React from 'react' ;
import {createMemoryHistory,RouterContext,match} from 'react-router'
import {renderToString} from 'react-dom/server'
import { Provider } from 'react-redux' ;


import {createLocation} from 'history/lib/LocationUtils'; // 用这个消除index.js.map 的恶心bug
import routes from './routes'
import configureStore from  './store/configureStore' ;
import renderPage from './lib/renderPage' ;
import fetchDependentData from './lib/fetchDependentData'

const app = express() ;
const resourceDir = path.join(__dirname, '../../resources');
app.use(express.static(resourceDir, {maxAge: '365d'}));


/***********************************2. 代理费服务器*****************************/
const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:3000/api',
});

app.use('/api',(req,res)=>{
	proxy.web(req,res) ;
})
proxy.on('error', (error, req, res) => {  //proxy错误处理s
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});



/**************************3.服务器端路由渲染**************************************/
const memoryHistory = createMemoryHistory() ;
const store = configureStore() ;

// 作为中间件使用
app.use((req,res)=>{

	const location = createLocation(req.url);

	match({routes,location},(err,redirect,renderProps)=>{ // 传入一个对象和回调！！
		console.log('当前请求的url：' + req.url)

		if(err){
			console.info(err) ;
			return res.status(500).send(err.message) ;
		}else if(redirect){
			return res.status(302).redirect(redirect.pathname + redirect.search) ;
		}else if(!renderProps){
			return res.status(404).send('Not Found')
		}
		// 处理完异常情况，接下来正式渲染页面
		// 服务器端同步渲染
		//服务器端，同步处理组件初始的依赖数据,依赖数据返回之前尽量不要renderToString，否则前后端渲染不一致
		fetchDependentData(store.dispatch,renderProps.components,renderProps.params)
			.then(()=>{ // then 调用时，store状态已经发生了变化
				// 将app应用渲染成html字符串
				// renderToString()的时机最好放在依赖数据全部返回，store状态变化后，以此【避免前后端不一致问题】
				const appHtml = renderToString(
					<Provider store = {store}>
						<RouterContext {...renderProps}/>
					</Provider>
				);
				
				return renderPage(appHtml,store.getState()) // 内部promise执行完成后相当于dispatch了新动作，导致state更新了。！！
			})
			.then(html=>{
				return res.status(200).end(html)
			})
			.catch(err=>{
				console.log(err.message) ;
				res.status(500).send('抓取数据错误！！')
			})
	})
});


app.listen(3001,()=>{  // 渲染服务器(api代理服务器)运行在3001端口
	console.log('Render(Proxy) Server is running on port 3001') ;
})

