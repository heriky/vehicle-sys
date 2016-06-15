require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';
	
	var _express = __webpack_require__(1);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _path = __webpack_require__(2);
	
	var _path2 = _interopRequireDefault(_path);
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(4);
	
	var _server = __webpack_require__(5);
	
	var _reactRedux = __webpack_require__(6);
	
	var _routes = __webpack_require__(7);
	
	var _routes2 = _interopRequireDefault(_routes);
	
	var _store = __webpack_require__(60);
	
	var _store2 = _interopRequireDefault(_store);
	
	var _renderPage = __webpack_require__(69);
	
	var _renderPage2 = _interopRequireDefault(_renderPage);
	
	var _fetchDependentData = __webpack_require__(70);
	
	var _fetchDependentData2 = _interopRequireDefault(_fetchDependentData);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var app = (0, _express2.default)();
	var resourceDir = _path2.default.join(__dirname, '../../resources');
	app.use(_express2.default.static(resourceDir, { maxAge: '365d' }));
	
	var memoryHistory = (0, _reactRouter.createMemoryHistory)();
	var store = (0, _store2.default)();
	
	// 作为中间件使用
	app.use(function (req, res) {
		console.log('当前请求的url：');
		console.log(req.url);
		console.log('-------------');
		(0, _reactRouter.match)({ routes: _routes2.default, location: req.url }, function (err, redirect, renderProps) {
			// 传入一个对象和回调！！
			if (err) {
				console.info(err);
				return res.status(500).send(err.message);
			} else if (redirect) {
				return res.status(302).redirect(redirect.pathname + redirect.search);
			} else if (!renderProps) {
				console.log('当前的请求路径是:', req.url);
				return res.status(404).send('Not Found');
			}
			// 处理完异常情况，接下来正式渲染页面
			// 将app应用渲染成html字符串，插入到HTML模板中去
			var appHtml = (0, _server.renderToString)(_react2.default.createElement(
				_reactRedux.Provider,
				{ store: store },
				_react2.default.createElement(_reactRouter.RouterContext, renderProps)
			));
			console.log('renderProps到底是什么:');
			console.log(renderProps);
			//服务器端，同步处理组件初始的依赖数据
			(0, _fetchDependentData2.default)(store.dispatch, renderProps.components, renderProps.params).then(function () {
				console.log('_______________initialState1111_________');
				console.log(store.getState());
				return (0, _renderPage2.default)(appHtml, store.getState()); // 一定要return返回
			}).then(function (html) {
				console.log('_______________initialState2222_________');
				console.log(store.getState());
				return res.status(200).end(html);
			}).catch(function (err) {
				console.log(err);
				res.status(500).send('Internal Error!');
			});
		});
	});
	
	app.listen(3001, function () {
		// 渲染服务器(api代理服务器)运行在3001端口
		console.log('Render(Proxy) Server is running on port 3001');
	});
	/* WEBPACK VAR INJECTION */}.call(exports, "fe\\src"))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("react-router");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("react-dom/server");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("react-redux");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(4);
	
	var _App = __webpack_require__(8);
	
	var _App2 = _interopRequireDefault(_App);
	
	var _Home = __webpack_require__(27);
	
	var _Home2 = _interopRequireDefault(_Home);
	
	var _Monitor = __webpack_require__(32);
	
	var _Monitor2 = _interopRequireDefault(_Monitor);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _react2.default.createElement(
		_reactRouter.Route,
		{ path: '/', component: _App2.default },
		_react2.default.createElement(_reactRouter.IndexRoute, { component: _Home2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'monitor', component: _Monitor2.default })
	);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _App = __webpack_require__(9);
	
	var _App2 = _interopRequireDefault(_App);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _App2.default;
	//export {App as default} from './App'

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
			value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Navbar = __webpack_require__(10);
	
	var _Navbar2 = _interopRequireDefault(_Navbar);
	
	var _BreadCumb = __webpack_require__(22);
	
	var _BreadCumb2 = _interopRequireDefault(_BreadCumb);
	
	var _App = __webpack_require__(26);
	
	var _App2 = _interopRequireDefault(_App);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// 需要注意的是App相当于布局容器不同的布局模式，例如双栏布局，三栏布局等模式都可以在这个文件中写。
	// App只是容器，不涉及具体的布局，因此如果在路由的时候需要变更布局的模式（两栏变三栏），则可以在App内部
	// 加载不同的布局模式，布局模式可以单独的写一系列文件处理。
	//
	// App是整个前端应用级的组件（后台应用需要构造不同的整体架构，不能直接套用这个App作为根了），对于这样应用级的组件可以写在App中，内部加载各个页面的内容组件就行。
	//
	// 这个页面也可以称为Layout，可以直接将应用级的组件都以dom的形式写在这里，并添加css样式，不用再以组件的方式写了，因为全局性的组件不会复用的，只使用一次！
	var App = function App(props) {
			return (// 这里放的都是应用级复用的组件，排版和布局也在这里进行，各自应用各自排版！例如Home组件是个容器，内部布局必须在Home内部做好
					_react2.default.createElement(
							'div',
							{ id: 'react-view' },
							_react2.default.createElement(
									'header',
									null,
									_react2.default.createElement(_Navbar2.default, null),
									props.location.pathname == '/' ? "" : _react2.default.createElement(_BreadCumb2.default, { location: props.location })
							),
							props.children,
							_react2.default.createElement('footer', null)
					)
			);
	};
	exports.default = App;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Navbar = __webpack_require__(11);
	
	var _Navbar2 = _interopRequireDefault(_Navbar);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _Navbar2.default; //export {Navbar as default } from './Navbar.js';

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _NavbarBrand = __webpack_require__(12);
	
	var _NavbarBrand2 = _interopRequireDefault(_NavbarBrand);
	
	var _NavbarMenu = __webpack_require__(14);
	
	var _NavbarMenu2 = _interopRequireDefault(_NavbarMenu);
	
	var _NavbarExtra = __webpack_require__(18);
	
	var _NavbarExtra2 = _interopRequireDefault(_NavbarExtra);
	
	var _Navbar = __webpack_require__(20);
	
	var _Navbar2 = _interopRequireDefault(_Navbar);
	
	var _classname = __webpack_require__(21);
	
	var _classname2 = _interopRequireDefault(_classname);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Navbar = function Navbar(props) {
		return _react2.default.createElement(
			'nav',
			{ className: _Navbar2.default.root },
			_react2.default.createElement(_NavbarBrand2.default, null),
			_react2.default.createElement(_NavbarMenu2.default, null),
			_react2.default.createElement(_NavbarExtra2.default, null)
		);
	};
	
	exports.default = Navbar;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _NavbarBrand = __webpack_require__(13);
	
	var _NavbarBrand2 = _interopRequireDefault(_NavbarBrand);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var NavbarBrand = function NavbarBrand(props) {
		return _react2.default.createElement(
			'h1',
			{ className: _NavbarBrand2.default.root },
			'Veichle'
		);
	};
	
	exports.default = NavbarBrand;

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = {
		"root": "NavbarBrand__root-1nO-V"
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _NavLink = __webpack_require__(15);
	
	var _NavLink2 = _interopRequireDefault(_NavLink);
	
	var _NavbarMenu = __webpack_require__(16);
	
	var _NavbarMenu2 = _interopRequireDefault(_NavbarMenu);
	
	var _classnames = __webpack_require__(17);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var NavbarMenu = function NavbarMenu(props) {
		var _classNames;
	
		var activeStyle = (0, _classnames2.default)((_classNames = {}, _defineProperty(_classNames, _NavbarMenu2.default['menu-item'], true), _defineProperty(_classNames, _NavbarMenu2.default.indicator, true), _classNames));
		return _react2.default.createElement(
			'ul',
			{ className: _NavbarMenu2.default.root },
			_react2.default.createElement(
				'li',
				{ className: _NavbarMenu2.default['menu-item'], key: '1', 'data-role': 'navlink' },
				_react2.default.createElement(
					_NavLink2.default,
					{ to: '/', isIndex: true },
					_react2.default.createElement(
						'i',
						{ className: 'iconfont' },
						''
					),
					' 首页'
				)
			),
			_react2.default.createElement(
				'li',
				{ className: _NavbarMenu2.default['menu-item'], key: '2', 'data-role': 'navlink' },
				_react2.default.createElement(
					_NavLink2.default,
					{ to: '/monitor' },
					_react2.default.createElement(
						'i',
						{ className: 'iconfont' },
						''
					),
					' 监控'
				)
			),
			_react2.default.createElement(
				'li',
				{ className: _NavbarMenu2.default['menu-item'], key: '3', 'data-role': 'navlink' },
				_react2.default.createElement(
					_NavLink2.default,
					{ to: '/recommend' },
					_react2.default.createElement(
						'i',
						{ className: 'iconfont' },
						''
					),
					' 推荐'
				)
			),
			_react2.default.createElement(
				'li',
				{ className: _NavbarMenu2.default['menu-item'], key: '4', 'data-role': 'navlink' },
				_react2.default.createElement(
					_NavLink2.default,
					{ to: '/api' },
					_react2.default.createElement(
						'i',
						{ className: 'iconfont' },
						''
					),
					' API'
				)
			),
			_react2.default.createElement(
				'li',
				{ className: _NavbarMenu2.default['menu-item'], key: '5', 'data-role': 'navlink' },
				_react2.default.createElement(
					_NavLink2.default,
					{ to: '/feedback' },
					_react2.default.createElement(
						'i',
						{ className: 'iconfont' },
						''
					),
					' 反馈'
				)
			)
		);
	};
	
	exports.default = NavbarMenu;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var NavLink = function NavLink(props) {
		var isIndex = props.isIndex || false;
		return isIndex ? _react2.default.createElement(_reactRouter.IndexLink, _extends({ activeClassName: 'nav-active' }, props)) : _react2.default.createElement(_reactRouter.Link, _extends({ activeClassName: 'nav-active' }, props));
	};
	
	exports.default = NavLink;

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = {
		"root": "NavbarMenu__root-2Rbnr",
		"menu-item": "NavbarMenu__menu-item-1GUjF"
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("classnames");

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _NavbarExtra = __webpack_require__(19);
	
	var _NavbarExtra2 = _interopRequireDefault(_NavbarExtra);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var NavbarExtra = function NavbarExtra(props) {
		return _react2.default.createElement(
			'div',
			{ className: _NavbarExtra2.default.root },
			'功能设置'
		);
	};
	
	exports.default = NavbarExtra;

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = {
		"root": "NavbarExtra__root-2StMZ"
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = {
		"root": "Navbar__root-xqYn4"
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("classname");

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _BreadCumb = __webpack_require__(23);
	
	var _BreadCumb2 = _interopRequireDefault(_BreadCumb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _BreadCumb2.default;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _BreadCumb = __webpack_require__(24);
	
	var _BreadCumb2 = _interopRequireDefault(_BreadCumb);
	
	var _lodash = __webpack_require__(25);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _reactRouter = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var BreadCumb = function BreadCumb(_ref) {
		var location = _ref.location;
	
		var crumbMap = _lodash2.default.zipObject(['home', 'monitor', 'recommend', 'api', 'feedback'], ['首页', '监控',, '推荐', 'API', '反馈']);
		var breadCrumbs = ['home'].concat(_toConsumableArray(_lodash2.default.compact(location.pathname.split('/'))));
		var activeStyle = { color: "#333", textDecoration: "none" };
		return _react2.default.createElement(
			'ul',
			{ className: _BreadCumb2.default.root },
			breadCrumbs.map(function (crumb, index) {
				return _react2.default.createElement(
					'li',
					{ key: index, className: _BreadCumb2.default["bread-item"] },
					crumb == 'home' ? _react2.default.createElement(
						_reactRouter.IndexLink,
						{ to: '/', activeStyle: activeStyle },
						crumbMap[crumb]
					) : _react2.default.createElement(
						_reactRouter.Link,
						{ to: '/' + crumb, activeStyle: activeStyle },
						crumbMap[crumb]
					)
				);
			})
		);
	};
	
	exports.default = BreadCumb;

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = {
		"root": "BreadCumb__root-29alh",
		"bread-item": "BreadCumb__bread-item-23hg1"
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 26 */
/***/ function(module, exports) {



/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Home = __webpack_require__(28);
	
	var _Home2 = _interopRequireDefault(_Home);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _Home2.default;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _ProgressBar = __webpack_require__(29);
	
	var _ProgressBar2 = _interopRequireDefault(_ProgressBar);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Home = function Home(props) {
		return _react2.default.createElement(
			'div',
			null,
			_react2.default.createElement(
				'h2',
				null,
				'这里是主页，暂时没有内容！'
			),
			_react2.default.createElement(_ProgressBar2.default, null)
		);
	};
	
	exports.default = Home;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _ProgressBar = __webpack_require__(30);
	
	var _ProgressBar2 = _interopRequireDefault(_ProgressBar);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _ProgressBar2.default;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _ProgressBar = __webpack_require__(31);
	
	var _ProgressBar2 = _interopRequireDefault(_ProgressBar);
	
	var _classnames = __webpack_require__(17);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var ctx = (0, _classnames2.default)(_ProgressBar2.default.root, 'circle-spinner');
	var ProgressBar = function ProgressBar(props) {
		return _react2.default.createElement(
			'div',
			{ className: ctx },
			_react2.default.createElement('i', null)
		);
	};
	
	exports.default = ProgressBar;

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = {
		"root": "ProgressBar__root-32PKa",
		"r1": "ProgressBar__r1-26Cz0",
		"r2": "ProgressBar__r2-1Ug6d"
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Monitor = __webpack_require__(33);
	
	var _Monitor2 = _interopRequireDefault(_Monitor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _Monitor2.default;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _DataStatePreview = __webpack_require__(34);
	
	var _DataStatePreview2 = _interopRequireDefault(_DataStatePreview);
	
	var _DataParkingState = __webpack_require__(46);
	
	var _DataParkingState2 = _interopRequireDefault(_DataParkingState);
	
	var _Tips = __webpack_require__(52);
	
	var _Tips2 = _interopRequireDefault(_Tips);
	
	var _Monitor = __webpack_require__(55);
	
	var _Monitor2 = _interopRequireDefault(_Monitor);
	
	var _ProgressBar = __webpack_require__(29);
	
	var _ProgressBar2 = _interopRequireDefault(_ProgressBar);
	
	var _connectCanvas = __webpack_require__(56);
	
	var _connectCanvas2 = _interopRequireDefault(_connectCanvas);
	
	var _postActions = __webpack_require__(57);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// 组件只是负责内部的样式，至于组件之间的布局和样式都应该放在这里写！！！！！不应该放在组件内部写！！
	// 从而达到复用的目的，
	// 应用级的组件直接写在App之中即可，例如导航条和Footer之类的！！
	
	var Monitor = function (_React$Component) {
	  _inherits(Monitor, _React$Component);
	
	  function Monitor(props) {
	    _classCallCheck(this, Monitor);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Monitor).call(this, props));
	
	    _this.displayName = 'Monitor';
	    return _this;
	  }
	
	  _createClass(Monitor, [{
	    key: 'render',
	    value: function render() {
	      console.log(_postActions.infoAPI);
	      return _react2.default.createElement(
	        'section',
	        { className: _Monitor2.default.main },
	        _react2.default.createElement(_DataStatePreview2.default, null),
	        _react2.default.createElement(_DataParkingState2.default, null),
	        _react2.default.createElement(_Tips2.default, null)
	      );
	    }
	  }]);
	
	  return Monitor;
	}(_react2.default.Component);
	
	Monitor.needs = [_postActions.infoAPI];
	exports.default = Monitor;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _StatePreview = __webpack_require__(35);
	
	var _StatePreview2 = _interopRequireDefault(_StatePreview);
	
	var _reactRedux = __webpack_require__(6);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function mapStateToProps(state, ownProps) {
		return {
			info: state.monitor.info,
			detail: state.monitor.detail,
			isFetching: state.monitor.isFetching
		};
	}
	
	function mapDispatchToProps(state, ownProps) {
		return {};
	}
	
	exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_StatePreview2.default);

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _StatePreview = __webpack_require__(36);
	
	var _StatePreview2 = _interopRequireDefault(_StatePreview);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _StatePreview2.default;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Tab = __webpack_require__(37);
	
	var _Tab2 = _interopRequireDefault(_Tab);
	
	var _StatePreview = __webpack_require__(44);
	
	var _StatePreview2 = _interopRequireDefault(_StatePreview);
	
	var _StateIndicator = __webpack_require__(45);
	
	var _StateIndicator2 = _interopRequireDefault(_StateIndicator);
	
	var _ProgressBar = __webpack_require__(29);
	
	var _ProgressBar2 = _interopRequireDefault(_ProgressBar);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var StatePreview = function StatePreview(_ref) {
		var info = _ref.info;
		var detail = _ref.detail;
		var isFetching = _ref.isFetching;
		var location = info.location;
		var status = info.status;
	
		return _react2.default.createElement(
			_Tab2.default,
			{ title: '状态预览' },
			_react2.default.createElement('div', null),
			isFetching ? _react2.default.createElement(
				'div',
				{ className: _StatePreview2.default.root },
				_react2.default.createElement(_ProgressBar2.default, null),
				_react2.default.createElement('v', { style: { height: _StatePreview2.default.minHeight } })
			) : _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					{ className: _StatePreview2.default["state-graphic"] },
					'图信息'
				),
				_react2.default.createElement(_StateIndicator2.default, _extends({ clazz: _StatePreview2.default['state-info'] }, detail)),
				_react2.default.createElement(
					'dl',
					{ className: _StatePreview2.default['state-run'] },
					_react2.default.createElement(
						'dt',
						{ className: _StatePreview2.default['state-title'] },
						'传感器运行状态：'
					),
					_react2.default.createElement(
						'dd',
						{ className: _StatePreview2.default['state-content'] },
						status ? '正常' : '停止'
					),
					_react2.default.createElement(
						'dt',
						{ className: _StatePreview2.default['state-title'] },
						'更新于:'
					),
					_react2.default.createElement(
						'dd',
						{ className: _StatePreview2.default['state-content'] },
						new Date().toLocaleString()
					),
					_react2.default.createElement('br', null),
					_react2.default.createElement(
						'dt',
						{ className: _StatePreview2.default['state-title'] },
						'经纬度:'
					),
					_react2.default.createElement(
						'dd',
						{ className: _StatePreview2.default['state-content'] },
						location[0] + ' / ' + location[1]
					),
					_react2.default.createElement(
						'dt',
						{ className: _StatePreview2.default['state-title'] },
						'当前位于:'
					),
					_react2.default.createElement(
						'dd',
						{ className: _StatePreview2.default['state-content'] },
						'内容生成4'
					)
				),
				_react2.default.createElement(
					'button',
					{ className: _StatePreview2.default['btn-stop'] },
					'停止监控'
				)
			)
		);
	};
	
	exports.default = StatePreview;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Tab = __webpack_require__(38);
	
	var _Tab2 = _interopRequireDefault(_Tab);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _Tab2.default;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _TabTitle = __webpack_require__(39);
	
	var _TabTitle2 = _interopRequireDefault(_TabTitle);
	
	var _TabContent = __webpack_require__(41);
	
	var _TabContent2 = _interopRequireDefault(_TabContent);
	
	var _Tab = __webpack_require__(43);
	
	var _Tab2 = _interopRequireDefault(_Tab);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Tab = function Tab(_ref) {
		var children = _ref.children;
		var title = _ref.title;
	
	
		return _react2.default.createElement(
			'div',
			{ className: _Tab2.default.root },
			_react2.default.createElement(
				_TabTitle2.default,
				{ title: title },
				children[0]
			),
			_react2.default.createElement(
				_TabContent2.default,
				null,
				children[1]
			)
		);
	};
	
	exports.default = Tab;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _TabTitle = __webpack_require__(40);
	
	var _TabTitle2 = _interopRequireDefault(_TabTitle);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var TabTitle = function TabTitle(_ref) {
		var title = _ref.title;
		var children = _ref.children;
		return _react2.default.createElement(
			'div',
			{ className: _TabTitle2.default.root },
			_react2.default.createElement(
				'h2',
				{ className: _TabTitle2.default.desc },
				title
			),
			_react2.default.createElement('div', { className: _TabTitle2.default["title-indicator"] }),
			children
		);
	};
	
	exports.default = TabTitle;

/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = {
		"root": "TabTitle__root-1dplc",
		"desc": "TabTitle__desc-2Bywm",
		"title-indicator": "TabTitle__title-indicator-EHIrv"
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _TabContent = __webpack_require__(42);
	
	var _TabContent2 = _interopRequireDefault(_TabContent);
	
	var _classnames = __webpack_require__(17);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var TabContent = function TabContent(props) {
		var ctx = (0, _classnames2.default)('clearfix', _TabContent2.default.root); // 清除浮动
		return _react2.default.createElement(
			'div',
			{ className: ctx },
			props.children
		);
	};
	
	exports.default = TabContent;

/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = {
		"root": "TabContent__root-iqB6C"
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = {
		"root": "Tab__root-17ZAJ"
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	module.exports = {
		"minHeight": "2.34rem",
		"root": "StatePreview__root-3gKXN",
		"state-graphic": "StatePreview__state-graphic-MNZZb",
		"state-info": "StatePreview__state-info-jVk_n",
		"state-run": "StatePreview__state-run-1ZRGg",
		"state-title": "StatePreview__state-title-3tF9L",
		"state-content": "StatePreview__state-content-1iG_u",
		"btn-stop": "StatePreview__btn-stop-q5oZf"
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _StatePreview = __webpack_require__(44);
	
	var _StatePreview2 = _interopRequireDefault(_StatePreview);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var StateIndicator = function StateIndicator(_ref) {
		var clazz = _ref.clazz;
		var total = _ref.total;
		var busy = _ref.busy;
		var idle = _ref.idle;
		var ordered = _ref.ordered;
		// 组件内容一样，只是样式不一样。
	
		return _react2.default.createElement(
			'ul',
			{ className: clazz },
			_react2.default.createElement(
				'li',
				null,
				_react2.default.createElement('i', { className: 'icon-state' }),
				_react2.default.createElement(
					'span',
					null,
					'  总车位:  ',
					total
				)
			),
			_react2.default.createElement(
				'li',
				null,
				_react2.default.createElement('i', { className: 'icon-state bg-red' }),
				_react2.default.createElement(
					'span',
					null,
					'  已占用:  ',
					busy
				)
			),
			_react2.default.createElement(
				'li',
				null,
				_react2.default.createElement('i', { className: 'icon-state bg-blue' }),
				_react2.default.createElement(
					'span',
					null,
					'  已预约:  ',
					ordered
				)
			),
			_react2.default.createElement(
				'li',
				null,
				_react2.default.createElement('i', { className: 'icon-state bg-green' }),
				_react2.default.createElement(
					'span',
					null,
					'  空闲位:  ',
					idle
				)
			)
		);
	};
	exports.default = StateIndicator;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _reactRedux = __webpack_require__(6);
	
	var _ParkingState = __webpack_require__(47);
	
	var _ParkingState2 = _interopRequireDefault(_ParkingState);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function mapStateToProps(state, ownProps) {
		var _state$monitor = state.monitor;
		var isFetching = _state$monitor.isFetching;
		var _state$monitor$distri = _state$monitor.distribute;
		var total = _state$monitor$distri.total;
		var parking = _state$monitor$distri.parking;
	
		return {
			total: total, parking: parking, isFetching: isFetching
		};
	}
	
	function mapDistpatchToProps(state, ownProps) {
		return {};
	}
	
	exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDistpatchToProps)(_ParkingState2.default);

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _ParkingState = __webpack_require__(48);
	
	var _ParkingState2 = _interopRequireDefault(_ParkingState);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _ParkingState2.default;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Tab = __webpack_require__(37);
	
	var _Tab2 = _interopRequireDefault(_Tab);
	
	var _ParkingState = __webpack_require__(49);
	
	var _ParkingState2 = _interopRequireDefault(_ParkingState);
	
	var _ParkingItem = __webpack_require__(50);
	
	var _ParkingItem2 = _interopRequireDefault(_ParkingItem);
	
	var _StateIndicator = __webpack_require__(45);
	
	var _StateIndicator2 = _interopRequireDefault(_StateIndicator);
	
	var _ProgressBar = __webpack_require__(29);
	
	var _ProgressBar2 = _interopRequireDefault(_ProgressBar);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// 这里通过clearfix向Tab内部添加自定义的样式，按要求覆盖样式。
	var ParkingState = function ParkingState(_ref) {
		var total = _ref.total;
		var parking = _ref.parking;
		var isFetching = _ref.isFetching;
		return _react2.default.createElement(
			_Tab2.default,
			{ title: '停车分布' },
			_react2.default.createElement(_StateIndicator2.default, { clazz: _ParkingState2.default.indicator }),
			isFetching ? _react2.default.createElement(
				'div',
				{ className: _ParkingState2.default.root },
				_react2.default.createElement(_ProgressBar2.default, null),
				_react2.default.createElement('v', { style: { height: _ParkingState2.default.minHeight } })
			) : _react2.default.createElement(
				'div',
				null,
				parking.map(function (item, index) {
					return _react2.default.createElement(
						'div',
						{ className: _ParkingState2.default.wrapper, key: index },
						_react2.default.createElement(_ParkingItem2.default, parking[index])
					);
				})
			)
		);
	};
	
	exports.default = ParkingState;

/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = {
		"minHeight": "3rem",
		"root": "ParkingState__root-1MmCs",
		"wrapper": "ParkingState__wrapper-3nVlM",
		"indicator": "ParkingState__indicator-qOpGw"
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _ParkingItem = __webpack_require__(51);
	
	var _ParkingItem2 = _interopRequireDefault(_ParkingItem);
	
	var _classnames = __webpack_require__(17);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// 合并样式
	
	var ParkingItem = function ParkingItem(_ref) {
		var id = _ref.id;
		var pos = _ref.pos;
		var currentStatus = _ref.currentStatus;
	
		var statusStyle = void 0;
		switch (currentStatus) {
			case 'busy':
				statusStyle = _ParkingItem2.default.busy;
				break;
			case 'ordered':
				statusStyle = _ParkingItem2.default.ordered;
				break;
			case 'idle':
				statusStyle = _ParkingItem2.default.idle;
				break;
			default:
				break;
		}
		var finalStyle = (0, _classnames2.default)(_ParkingItem2.default.root, statusStyle);
	
		return _react2.default.createElement(
			'div',
			{ className: finalStyle },
			_react2.default.createElement(
				'span',
				null,
				'序号:',
				id
			),
			_react2.default.createElement('br', null),
			_react2.default.createElement(
				'span',
				null,
				'位置:',
				pos
			)
		);
	};
	
	exports.default = ParkingItem;

/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = {
		"root": "ParkingItem__root-3V4Ag",
		"idle": "ParkingItem__idle-1ivjh",
		"busy": "ParkingItem__busy-VSf4x",
		"ordered": "ParkingItem__ordered-TT6_o"
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Tips = __webpack_require__(53);
	
	var _Tips2 = _interopRequireDefault(_Tips);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _Tips2.default;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Tips = __webpack_require__(54);
	
	var _Tips2 = _interopRequireDefault(_Tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Tips = function Tips() {
		return _react2.default.createElement(
			'div',
			{ className: _Tips2.default.tips },
			_react2.default.createElement(
				'span',
				null,
				'Tips:'
			),
			_react2.default.createElement(
				'p',
				null,
				'1.鼠标移动至圆圈，可进行车位预约或者查看信息.'
			),
			_react2.default.createElement(
				'p',
				null,
				'2.当没有合适车位时，点击推荐按钮试试吧!'
			),
			_react2.default.createElement(
				'div',
				{ className: _Tips2.default.btn },
				_react2.default.createElement(
					'button',
					null,
					'点击这里查看新的车位吧'
				)
			)
		);
	};
	
	exports.default = Tips;

/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = {
		"tips": "Tips__tips-2sJuZ",
		"btn": "Tips__btn-2CFyJ"
	};

/***/ },
/* 55 */
/***/ function(module, exports) {

	module.exports = {
		"main": "Monitor__main-1sslL"
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	exports.default = function (config) {
		return function (Compo) {
			return function (_React$Component) {
				_inherits(WrappedComponent, _React$Component);
	
				function WrappedComponent(props) {
					_classCallCheck(this, WrappedComponent);
	
					var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WrappedComponent).call(this, props));
	
					_this.displayName = 'WrappedComponent';
					return _this;
				}
	
				_createClass(WrappedComponent, [{
					key: 'componentDidMount',
					value: function componentDidMount() {
						console.log(document.getElementById("stateGraphic"));
					}
				}, {
					key: 'render',
					value: function render() {
						return _react2.default.createElement(Compo, null);
					}
				}]);
	
				return WrappedComponent;
			}(_react2.default.Component);
		};
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.infoAPI = infoAPI;
	
	var _isomorphicFetch = __webpack_require__(58);
	
	var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);
	
	var _Constants = __webpack_require__(59);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/// 通用Action
	function networkError(error) {
		return {
			type: _Constants.NETWORK_ERROR,
			error: error
		};
	}
	
	// 同步action,处理异步回调。异步Action处理非纯请求，并调用同步action发生动作
	//
	// 1.info请求
	function requestInfo(params) {
		// 发送请求之前
		return {
			type: _Constants.REQUEST_MONITOR,
			params: params
		};
	}
	
	function receiveInfo(json, params) {
		// 发送请求返回之后
		return {
			type: _Constants.RECIEVE_MONITOR,
			json: json,
			params: params
		};
	}
	
	// 异步action
	
	// 异步请求预览信息info, 这里requestUrl写死了，因为infoAPI是针对特定的地址进行请求，不需要暴露参数
	// 另外，写死的话有利于server rendering中的fetchDependentData进行操作。
	var requestUrl = "http://localhost:3000/api/info";
	// 首屏向着渲染服务器请求数据，这里不能直接在客户端使用这个url，会发生跨域问题
	function infoAPI(params) {
		console.log('当前负载params是：');
		console.log(params);
		return {
			types: [_Constants.REQUEST_MONITOR, _Constants.RECIEVE_MONITOR, _Constants.NETWORK_ERROR],
			payload: { params: params, requestUrl: requestUrl }, // 这样的写法是很有讲究的，这是一个技巧性的问题，用于合并的时候非常有用
			shouldCallAPI: function shouldCallAPI(state) {
				return true;
			},
			API: function API() {
				return (0, _isomorphicFetch2.default)(requestUrl);
			}
		};
	}

/***/ },
/* 58 */
/***/ function(module, exports) {

	module.exports = require("isomorphic-fetch");

/***/ },
/* 59 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	// 处理首屏数据拉去的网络操作
	var REQUEST_MONITOR = exports.REQUEST_MONITOR = "REQUEST_MONITOR"; // 发送请求开始时触发的事件
	var RECIEVE_MONITOR = exports.RECIEVE_MONITOR = "RECIEVE_MONITOR"; // 发送请求结束后
	var NETWORK_ERROR = exports.NETWORK_ERROR = "NETWORK_ERROR"; //promise请求网络异常
	
	// 处理首屏detail数据拉取
	var REQUEST_DETAIL = exports.REQUEST_DETAIL = 'REQUEST_DETAIL';
	var RECIEVE_DETAIL = exports.RECIEVE_DETAIL = 'RECIEVE_DETAIL';
	
	// 网络异常
	var INVALIDATE_PREVIEW = exports.INVALIDATE_PREVIEW = "INVALIDATE_PREVIEW"; // 改变当前状态

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _configureStore = __webpack_require__(61);
	
	var _configureStore2 = _interopRequireDefault(_configureStore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _configureStore2.default;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _redux = __webpack_require__(62);
	
	var _reduxThunk = __webpack_require__(63);
	
	var _reduxThunk2 = _interopRequireDefault(_reduxThunk);
	
	var _reduxLogger = __webpack_require__(64);
	
	var _reduxLogger2 = _interopRequireDefault(_reduxLogger);
	
	var _middlewares = __webpack_require__(65);
	
	var _reducers = __webpack_require__(66);
	
	var _reducers2 = _interopRequireDefault(_reducers);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var loggerMiddleware = (0, _reduxLogger2.default)();
	
	exports.default = function (initialState) {
		return (0, _redux.createStore)(_reducers2.default, initialState, (0, _redux.applyMiddleware)(_middlewares.callAPIMiddleware, _reduxThunk2.default, loggerMiddleware));
	};

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = require("redux");

/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = require("redux-thunk");

/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = require("redux-logger");

/***/ },
/* 65 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var callAPIMiddleware = exports.callAPIMiddleware = function callAPIMiddleware(_ref) {
		var dispatch = _ref.dispatch;
		var getState = _ref.getState;
		return function (next) {
			return function (action) {
				// 1.抽参数
				var types = action.types;
				var payload = action.payload;
				var _action$shouldCallAPI = action.shouldCallAPI;
				var shouldCallAPI = _action$shouldCallAPI === undefined ? function () {
					return true;
				} : _action$shouldCallAPI;
				var // 解构的时候可以添加默认值
				API = action.API;
	
				//2. 过滤类型
	
				if (!types) return next(action); //放行,必须return
	
				if (!Array.isArray(types) || types.length != 3 || types.some(function (it) {
					return typeof it != "string";
				})) {
					throw Error('Expected an array of three string types');
				}
				var requestUrl = payload.requestUrl;
	
				if (!requestUrl || typeof requestUrl != 'string') {
					throw Error('Expected an string of valid url');
				}
				if (typeof API != 'function') {
					throw new Error('Expected fetch to be a function.');
				}
	
				if (!shouldCallAPI(getState())) return;
	
				//3.开始异步调用，并生成同步action实例触发动作
	
				var _types = _slicedToArray(types, 3);
	
				var requestType = _types[0];
				var successType = _types[1];
				var errorType = _types[2];
	
				// 发送api请求之前触发的动作
	
				dispatch(Object.assign({}, payload, {
					type: requestType
				}));
	
				return API().then(function (res) {
					if (res.ok) {
						return res.json().then(function (json) {
							// 内部还是一个promise，需要返回给下一个表示等待，否则，下一个是不等待这个内部的promise完成的
							dispatch(Object.assign({}, payload, {
								type: successType,
								json: json
							}));
						});
					} else {
						console.log("Looks like the response wasn't perfect, got status", res.status);
						return res.status;
					}
				}, function (error) {
					dispatch(Object.assign({}, payload, {
						type: errorType,
						error: error
					}));
					return error;
				});
			};
		};
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _redux = __webpack_require__(62);
	
	var _monitorReducer = __webpack_require__(67);
	
	var _monitorReducer2 = _interopRequireDefault(_monitorReducer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = (0, _redux.combineReducers)({
		monitor: _monitorReducer2.default
	});

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _lodash = __webpack_require__(25);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _immutable = __webpack_require__(68);
	
	var _Constants = __webpack_require__(59);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// isFetching:false,
	// info:{
	// 	location:["",""],
	// 	status:1
	// },
	// detail:{
	// 	total:20,
	// 	busy:8,
	// 	ordered:5,
	// 	idle:7
	// },
	// distribute:{
	// }
	var initialState = {
		info: { location: ["00.000", "00.000"], status: 0 },
		isFetching: false,
		detail: {
			total: 0,
			busy: 0,
			ordered: 0,
			idle: 0
		},
		distribute: {
			total: 0,
			parking: []
		}
	};
	
	exports.default = function () {
		var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
		var action = arguments[1];
	
		switch (action.type) {
			case _Constants.REQUEST_MONITOR:
				return (0, _immutable.fromJS)(state).merge({
					isFetching: true
				}).toJS();
			case _Constants.RECIEVE_MONITOR:
				var _action$json = action.json;
				var _action$json$info = _action$json.info;
				var location = _action$json$info.location;
				var status = _action$json$info.status;
				var _action$json$detail = _action$json.detail;
				var total = _action$json$detail.total;
				var busy = _action$json$detail.busy;
				var ordered = _action$json$detail.ordered;
				var idle = _action$json$detail.idle;
				var distribute = _action$json.distribute;
	
				var rs = (0, _immutable.fromJS)(state).merge({
					isFetching: false,
					info: { location: location, status: status },
					detail: { total: total, busy: busy, ordered: ordered, idle: idle },
					distribute: distribute
				}).toJS();
				return rs;
			case _Constants.NETWORK_ERROR:
				return {
					error: 'Network error occrued ,see the detail:' + action.error.toString()
				};
			default:
				return state;
		}
	};

/***/ },
/* 68 */
/***/ function(module, exports) {

	module.exports = require("immutable");

/***/ },
/* 69 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (appHtml, initialState) {
		return "\n\t<!DOCTYPE html>\n\t<html lang=\"zh\">\n\t<head>\n\t    <!-- META 一般设置 -->\n\t    <meta charset=\"UTF-8\">\n\t    <meta http-equiv=\"Content-Type\" content=\"text/html;charset=UTF-8\">\n\t    <meta name=\"viewport\" content=\"width=device-width,initial-scale=1,maximun-scale=1,user-scalable=no\" >\n\t   \n\t    <!--设置IE浏览器有限使用edge渲染 -->\n\t    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">\n\t    <meta name=\"HandheldFriendly\" content=\"true\">\n\t    <title>Document</title>\n\n\t    <!-- link优化 -->\n\t    <link rel=\"shortcut icon\" href=\"/static/favicon.ico\">\n\t    <link rel=\"icon\" href=\"/static/favicon.ico\">\n\t    <link href=\"/static/dist/common.css\" rel = 'stylesheet'/>\n\t\t\t<link href=\"/static/dist/module.css\" rel = 'stylesheet'/>\n\n\t    <!-- 国内双核浏览器，特别是360，使用渲染引擎从左到右 -->\n\t    <meta name=\"renderer\" content=\"webkit|ie-comp|ie-stand\">\n\t    <!-- seo优化 -->\n\t    <meta name=\"author\" content=\"\">\n\t    <meta name=\"keywords\" content=\"\">\n\t\t\n\t    <!-- html shim -->\n\t    <!--[if lt IE 9]>\n\t      <script src=\"//cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js\"></script>\n\t    <![endif]-->\n\t    <script src=\"http://cdn.bootcss.com/es5-shim/4.5.8/es5-shim.min.js\"></script>\n\t</head>\n\t<body>\n\t    <div id=\"react-app\">" + appHtml + "</div>\n\t    <script>\n\t\t\t\twindow.__INITIAL_STATE__ = " + JSON.stringify(initialState) + "\n\t    </script>\n\t    <script src='/static/dist/bundle.js'></script>\n\t</body>\n\t<!-- <script type=\"text/javascript\" src='../scripts/canvas.js'></script>> -->\n\t</html>\n";
	};

/***/ },
/* 70 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (dispatch, components, params) {
		console.log(components);
		var needs = components.reduce(function (prev, current) {
			// 备注一：needs是actionCreator的一个数组
			return (current.needs || []).concat((current.WrappedComponent ? current.WrappedComponent.needs : []) || []).concat(prev);
		}, []);
		console.log('-----------------fetchDependentData中----------------');
	
		console.log(needs);
		var promises = needs.map(function (need) {
			return dispatch(need(params));
		}); // 备注二：要求该actionCreator返回promise类型
		return Promise.all(promises);
	};

/***/ }
/******/ ]);
//# sourceMappingURL=server.bundle.js.map