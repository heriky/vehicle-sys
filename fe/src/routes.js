import React from 'react'
import {Route,IndexRoute} from 'react-router' ;
import App from './components/App/App'
import Home from  './components/Home/Home'
import Monitor from './components/Monitor/Monitor' ;

export default (
	<Route path='/' component = {App}>
		<IndexRoute component={Home}/>
		<Route path = 'monitor/:id' component = {Monitor} />
		<Route path = 'monitor' component = {Monitor} />
		
	</Route>
)