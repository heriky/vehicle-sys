import React from 'react'
import {Route,IndexRoute} from 'react-router' ;
import App from './components/App'
import Home from  './components/Home'
import Monitor from './components/Monitor' ;

export default (
	<Route path='/' component = {App}>
		<IndexRoute component={Home}/>
		<Route path = 'monitor' component = {Monitor} />
	</Route>
)