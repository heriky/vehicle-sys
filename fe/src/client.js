require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');      // 兼容IE8

// react / redux /react-router
import React from 'react' ;
import {render} from 'react-dom' ;
import {Router,browserHistory} from 'react-router'
import routes from './routes' ;

// components
import App from './components/App' ;
import '../../resources/static/styles/base.scss';

// redux
import {Provider} from 'react-redux'
import createStore from './store' ;
import {infoAPI,detailAPI} from './actions/postActions' ;
import fetch from 'isomorphic-fetch' ;

const initialState = window.__INITIAL_STATE__ ;
const store = createStore(initialState) ;

render(
	<Provider store = {store}>
		<Router history={browserHistory} routes = {routes} />
	</Provider>
	,
	document.getElementById('react-app')) ;

