import express from 'express';
import path from 'path'

import React from 'react' ;
import {createMemoryHistory,RouterContext,match} from 'react-router'
import {renderToString} from 'react-dom/server'
import { Provider } from 'react-redux' ;

import routes from './routes'
import configureStore from  './store' ;
import renderPage from './lib/renderPage' ;
import fetchDependentData from './lib/fetchDependentData'

const app = express() ;
const resourceDir = path.join(__dirname, '../../resources');
app.use(express.static(resourceDir, {maxAge: '365d'}));

const memoryHistory = createMemoryHistory() ;
const store = configureStore() ;

// 作为中间件使用
app.use((req,res)=>{
	console.log('当前请求的url：')
	console.log(req.url)
	console.log('-------------')
	match({routes:routes,location:req.url},(err,redirect,renderProps)=>{ // 传入一个对象和回调！！
		if(err){
			console.info(err) ;
			return res.status(500).send(err.message) ;
		}else if(redirect){
			return res.status(302).redirect(redirect.pathname + redirect.search) ;
		}else if(!renderProps){
			console.log('当前的请求路径是:',req.url) ;
			return res.status(404).send('Not Found')
		}
		// 处理完异常情况，接下来正式渲染页面
		// 将app应用渲染成html字符串，插入到HTML模板中去
		const appHtml = renderToString(
			<Provider store = {store}>
				<RouterContext {...renderProps}/>
			</Provider>
		);
		console.log('renderProps到底是什么:') ;
		console.log(renderProps) ;
		//服务器端，同步处理组件初始的依赖数据
		fetchDependentData(store.dispatch,renderProps.components,renderProps.params)
			.then(()=>{
				return renderPage(appHtml,store.getState()) // 内部promise执行完成后相当于dispatch了新动作，导致state更新了。！！
			})
			.then(html=>{
				return res.status(200).end(html)
			})
			.catch(err=>{
				console.log(err) ;
				res.status(500).send('Internal Error!')
			})
	})
});


app.listen(3001,()=>{  // 渲染服务器(api代理服务器)运行在3001端口
	console.log('Render(Proxy) Server is running on port 3001') ;
})

