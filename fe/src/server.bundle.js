require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

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

	var _httpProxy = __webpack_require__(3);

	var _httpProxy2 = _interopRequireDefault(_httpProxy);

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(5);

	var _server = __webpack_require__(6);

	var _reactRedux = __webpack_require__(7);

	var _LocationUtils = __webpack_require__(8);

	var _routes = __webpack_require__(13);

	var _routes2 = _interopRequireDefault(_routes);

	var _configureStore = __webpack_require__(63);

	var _configureStore2 = _interopRequireDefault(_configureStore);

	var _renderPage = __webpack_require__(72);

	var _renderPage2 = _interopRequireDefault(_renderPage);

	var _fetchDependentData = __webpack_require__(73);

	var _fetchDependentData2 = _interopRequireDefault(_fetchDependentData);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//var mqttClient = require("./lib/mqttClient") ;
	// 用这个消除index.js.map 的恶心bug
	var mqtt = __webpack_require__(59);

	var app = (0, _express2.default)();
	var server = __webpack_require__(74).Server(app);
	var io = __webpack_require__(75)(server);

	var resourceDir = _path2.default.join(__dirname, '../../resources');
	app.use(_express2.default.static(resourceDir, { maxAge: '365d' }));

	/***********************************1. 代理费服务器*****************************/
	var proxy = _httpProxy2.default.createProxyServer({
		target: 'http://localhost:3000/api'
	});

	app.use('/api', function (req, res) {
		// 处理代理转发
		proxy.web(req, res);
	});

	proxy.on('error', function (error, req, res) {
		//proxy错误处理s
		var json = void 0;
		if (error.code !== 'ECONNRESET') {
			console.error('proxy error', error);
		}
		if (!res.headersSent) {
			res.writeHead(500, { 'content-type': 'application/json' });
		}

		json = { error: 'proxy_error', reason: error.message };
		res.end(JSON.stringify(json));
	});

	/**************************2.服务器端路由渲染**************************************/
	var memoryHistory = (0, _reactRouter.createMemoryHistory)();
	var store = (0, _configureStore2.default)();

	// 作为中间件使用
	app.use(function (req, res) {

		var location = (0, _LocationUtils.createLocation)(req.url);

		(0, _reactRouter.match)({ routes: _routes2.default, location: location }, function (err, redirect, renderProps) {
			// 传入一个对象和回调！！
			console.log('当前请求的url：' + req.url);

			if (err) {
				console.info(err);
				return res.status(500).send(err.message);
			} else if (redirect) {
				return res.status(302).redirect(redirect.pathname + redirect.search);
			} else if (!renderProps) {
				return res.status(404).send('Not Found');
			}
			// 处理完异常情况，接下来正式渲染页面
			// 服务器端同步渲染
			//服务器端，同步处理组件初始的依赖数据,依赖数据返回之前尽量不要renderToString，否则前后端渲染不一致
			(0, _fetchDependentData2.default)(store.dispatch, renderProps.components, renderProps.params).then(function () {
				// then 调用时，store状态已经发生了变化
				// 将app应用渲染成html字符串
				// renderToString()的时机最好放在依赖数据全部返回，store状态变化后，以此【避免前后端不一致问题】
				var appHtml = (0, _server.renderToString)(_react2.default.createElement(
					_reactRedux.Provider,
					{ store: store },
					_react2.default.createElement(_reactRouter.RouterContext, renderProps)
				));

				return (0, _renderPage2.default)(appHtml, store.getState()); // 内部promise执行完成后相当于dispatch了新动作，导致state更新了。！！
			}).then(function (html) {
				return res.status(200).end(html);
			}).catch(function (err) {
				console.log(err.message);
				res.status(500).send('抓取数据错误！！');
			});
		});
	});

	// 不直接用app，因为server里面包含着socket.io的服务
	server.listen(3001, function () {
		// 渲染服务器(api代理服务器)运行在3001端口
		console.log('Render(Proxy) Server is running on port 3001');
	});

	io.on('connection', function (socket) {
		console.log('成功连接至socket.io服务器');
		// socket.emit('news', { hello: 'world' });
		// socket.on('my other event', function (data) {
		//   console.log(data);
		// });
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

	module.exports = require("http-proxy");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("react-router");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("react-dom/server");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("react-redux");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.locationsAreEqual = exports.statesAreEqual = exports.createLocation = exports.createQuery = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _invariant = __webpack_require__(9);

	var _invariant2 = _interopRequireDefault(_invariant);

	var _PathUtils = __webpack_require__(10);

	var _Actions = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var createQuery = exports.createQuery = function createQuery(props) {
	  return _extends(Object.create(null), props);
	};

	var createLocation = exports.createLocation = function createLocation() {
	  var input = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];
	  var action = arguments.length <= 1 || arguments[1] === undefined ? _Actions.POP : arguments[1];
	  var key = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

	  var object = typeof input === 'string' ? (0, _PathUtils.parsePath)(input) : input;

	  var pathname = object.pathname || '/';
	  var search = object.search || '';
	  var hash = object.hash || '';
	  var state = object.state;

	  return {
	    pathname: pathname,
	    search: search,
	    hash: hash,
	    state: state,
	    action: action,
	    key: key
	  };
	};

	var isDate = function isDate(object) {
	  return Object.prototype.toString.call(object) === '[object Date]';
	};

	var statesAreEqual = exports.statesAreEqual = function statesAreEqual(a, b) {
	  if (a === b) return true;

	  var typeofA = typeof a === 'undefined' ? 'undefined' : _typeof(a);
	  var typeofB = typeof b === 'undefined' ? 'undefined' : _typeof(b);

	  if (typeofA !== typeofB) return false;

	  !(typeofA !== 'function') ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'You must not store functions in location state') : (0, _invariant2.default)(false) : void 0;

	  // Not the same object, but same type.
	  if (typeofA === 'object') {
	    !!(isDate(a) && isDate(b)) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'You must not store Date objects in location state') : (0, _invariant2.default)(false) : void 0;

	    if (!Array.isArray(a)) return Object.keys(a).every(function (key) {
	      return statesAreEqual(a[key], b[key]);
	    });

	    return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
	      return statesAreEqual(item, b[index]);
	    });
	  }

	  // All other serializable types (string, number, boolean)
	  // should be strict equal.
	  return false;
	};

	var locationsAreEqual = exports.locationsAreEqual = function locationsAreEqual(a, b) {
	  return a.key === b.key &&
	  // a.action === b.action && // Different action !== location change.
	  a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && statesAreEqual(a.state, b.state);
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("invariant");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createPath = exports.parsePath = exports.getQueryStringValueFromPath = exports.stripQueryStringValueFromPath = exports.addQueryStringValueToPath = exports.isAbsolutePath = undefined;

	var _warning = __webpack_require__(11);

	var _warning2 = _interopRequireDefault(_warning);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var isAbsolutePath = exports.isAbsolutePath = function isAbsolutePath(path) {
	  return typeof path === 'string' && path.charAt(0) === '/';
	};

	var addQueryStringValueToPath = exports.addQueryStringValueToPath = function addQueryStringValueToPath(path, key, value) {
	  var _parsePath = parsePath(path);

	  var pathname = _parsePath.pathname;
	  var search = _parsePath.search;
	  var hash = _parsePath.hash;


	  return createPath({
	    pathname: pathname,
	    search: search + (search.indexOf('?') === -1 ? '?' : '&') + key + '=' + value,
	    hash: hash
	  });
	};

	var stripQueryStringValueFromPath = exports.stripQueryStringValueFromPath = function stripQueryStringValueFromPath(path, key) {
	  var _parsePath2 = parsePath(path);

	  var pathname = _parsePath2.pathname;
	  var search = _parsePath2.search;
	  var hash = _parsePath2.hash;


	  return createPath({
	    pathname: pathname,
	    search: search.replace(new RegExp('([?&])' + key + '=[a-zA-Z0-9]+(&?)'), function (match, prefix, suffix) {
	      return prefix === '?' ? prefix : suffix;
	    }),
	    hash: hash
	  });
	};

	var getQueryStringValueFromPath = exports.getQueryStringValueFromPath = function getQueryStringValueFromPath(path, key) {
	  var _parsePath3 = parsePath(path);

	  var search = _parsePath3.search;

	  var match = search.match(new RegExp('[?&]' + key + '=([a-zA-Z0-9]+)'));
	  return match && match[1];
	};

	var extractPath = function extractPath(string) {
	  var match = string.match(/^(https?:)?\/\/[^\/]*/);
	  return match == null ? string : string.substring(match[0].length);
	};

	var parsePath = exports.parsePath = function parsePath(path) {
	  var pathname = extractPath(path);
	  var search = '';
	  var hash = '';

	  process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(path === pathname, 'A path must be pathname + search + hash only, not a full URL like "%s"', path) : void 0;

	  var hashIndex = pathname.indexOf('#');
	  if (hashIndex !== -1) {
	    hash = pathname.substring(hashIndex);
	    pathname = pathname.substring(0, hashIndex);
	  }

	  var searchIndex = pathname.indexOf('?');
	  if (searchIndex !== -1) {
	    search = pathname.substring(searchIndex);
	    pathname = pathname.substring(0, searchIndex);
	  }

	  if (pathname === '') pathname = '/';

	  return {
	    pathname: pathname,
	    search: search,
	    hash: hash
	  };
	};

	var createPath = exports.createPath = function createPath(location) {
	  if (location == null || typeof location === 'string') return location;

	  var basename = location.basename;
	  var pathname = location.pathname;
	  var search = location.search;
	  var hash = location.hash;

	  var path = (basename || '') + pathname;

	  if (search && search !== '?') path += search;

	  if (hash) path += hash;

	  return path;
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("warning");

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Indicates that navigation was caused by a call to history.push.
	 */
	var PUSH = exports.PUSH = 'PUSH';

	/**
	 * Indicates that navigation was caused by a call to history.replace.
	 */
	var REPLACE = exports.REPLACE = 'REPLACE';

	/**
	 * Indicates that navigation was caused by some other action such
	 * as using a browser's back/forward buttons and/or manually manipulating
	 * the URL in a browser's location bar. This is the default.
	 *
	 * See https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
	 * for more information.
	 */
	var POP = exports.POP = 'POP';

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(5);

	var _App = __webpack_require__(14);

	var _App2 = _interopRequireDefault(_App);

	var _Home = __webpack_require__(30);

	var _Home2 = _interopRequireDefault(_Home);

	var _Monitor = __webpack_require__(33);

	var _Monitor2 = _interopRequireDefault(_Monitor);

	var _Selector = __webpack_require__(60);

	var _Selector2 = _interopRequireDefault(_Selector);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createElement(
		_reactRouter.Route,
		{ path: '/', component: _App2.default },
		_react2.default.createElement(_reactRouter.IndexRoute, { component: _Home2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'monitor/:id', component: _Monitor2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'monitor', component: _Selector2.default })
	);

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
			value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _Navbar = __webpack_require__(15);

	var _Navbar2 = _interopRequireDefault(_Navbar);

	var _BreadCumb = __webpack_require__(26);

	var _BreadCumb2 = _interopRequireDefault(_BreadCumb);

	var _App = __webpack_require__(29);

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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _NavbarBrand = __webpack_require__(16);

	var _NavbarBrand2 = _interopRequireDefault(_NavbarBrand);

	var _NavbarMenu = __webpack_require__(18);

	var _NavbarMenu2 = _interopRequireDefault(_NavbarMenu);

	var _NavbarExtra = __webpack_require__(22);

	var _NavbarExtra2 = _interopRequireDefault(_NavbarExtra);

	var _Navbar = __webpack_require__(24);

	var _Navbar2 = _interopRequireDefault(_Navbar);

	var _classname = __webpack_require__(25);

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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _NavbarBrand = __webpack_require__(17);

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
/* 17 */
/***/ function(module, exports) {

	module.exports = {
		"root": "NavbarBrand__root-1nO-V"
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _NavLink = __webpack_require__(19);

	var _NavLink2 = _interopRequireDefault(_NavLink);

	var _NavbarMenu = __webpack_require__(20);

	var _NavbarMenu2 = _interopRequireDefault(_NavbarMenu);

	var _classnames = __webpack_require__(21);

	var _classnames2 = _interopRequireDefault(_classnames);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var NavbarMenu = function NavbarMenu(props) {
		return _react2.default.createElement(
			'div',
			null,
			_react2.default.createElement(
				'button',
				{ className: _NavbarMenu2.default.toggle },
				'|||'
			),
			_react2.default.createElement(
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
			)
		);
	};

	exports.default = NavbarMenu;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var NavLink = function NavLink(props) {
		var isIndex = props.isIndex || false;
		// NavLink处理两类事件：1.activeClassName /activeStyle  2.IndexLink
		return isIndex ? _react2.default.createElement(_reactRouter.IndexLink, _extends({ activeClassName: 'nav-active' }, props)) : _react2.default.createElement(_reactRouter.Link, _extends({ activeClassName: 'nav-active' }, props));
	};

	exports.default = NavLink;

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = {
		"toggle": "NavbarMenu__toggle-WrV5t",
		"root": "NavbarMenu__root-2Rbnr",
		"menu-item": "NavbarMenu__menu-item-1GUjF"
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("classnames");

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _NavbarExtra = __webpack_require__(23);

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
/* 23 */
/***/ function(module, exports) {

	module.exports = {
		"root": "NavbarExtra__root-2StMZ"
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = {
		"root": "Navbar__root-xqYn4"
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = require("classname");

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _BreadCumb = __webpack_require__(27);

	var _BreadCumb2 = _interopRequireDefault(_BreadCumb);

	var _lodash = __webpack_require__(28);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _reactRouter = __webpack_require__(5);

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
/* 27 */
/***/ function(module, exports) {

	module.exports = {
		"root": "BreadCumb__root-29alh",
		"bread-item": "BreadCumb__bread-item-23hg1"
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 29 */
/***/ function(module, exports) {

	

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _ProgressBar = __webpack_require__(31);

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
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _ProgressBar = __webpack_require__(32);

	var _ProgressBar2 = _interopRequireDefault(_ProgressBar);

	var _classnames = __webpack_require__(21);

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
/* 32 */
/***/ function(module, exports) {

	module.exports = {
		"root": "ProgressBar__root-32PKa",
		"r1": "ProgressBar__r1-26Cz0",
		"r2": "ProgressBar__r2-1Ug6d"
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _DataStatePreview = __webpack_require__(34);

	var _DataStatePreview2 = _interopRequireDefault(_DataStatePreview);

	var _DataParkingState = __webpack_require__(44);

	var _DataParkingState2 = _interopRequireDefault(_DataParkingState);

	var _Tips = __webpack_require__(52);

	var _Tips2 = _interopRequireDefault(_Tips);

	var _Monitor = __webpack_require__(54);

	var _Monitor2 = _interopRequireDefault(_Monitor);

	var _ProgressBar = __webpack_require__(31);

	var _ProgressBar2 = _interopRequireDefault(_ProgressBar);

	var _postActions = __webpack_require__(55);

	var _updateAction = __webpack_require__(57);

	var _reactRouter = __webpack_require__(5);

	var _reactRedux = __webpack_require__(7);

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
	    key: 'componentDidMount',
	    value: function componentDidMount(prevProps, prevState) {
	      var _this2 = this;

	      var info = this.props.info;

	      if (info.id.length == 24 || this.props.params.id && this.props.params.id.length == 24) {
	        var mqttClient;

	        (function () {
	          var id = info.id || _this2.props.params.id;
	          var dispatch = _this2.props.dispatch;

	          _this2.constructor.needs.forEach(function (need, index) {
	            return dispatch((0, _postActions.infoAPI)({ id: id })); // infoAPI接收的是一个带有id的对象！！这里不能直接传递id值，而应该传{id}
	          });

	          if (typeof window !== 'undefined') {
	            mqttClient = __webpack_require__(58);

	            mqttClient.subscribe(id);
	            mqttClient.onReceivedMsg(function (data) {
	              // sensorId,
	              // status,
	              // statusMsg
	              dispatch((0, _updateAction.receiveUpdateData)(data));
	            });
	          }
	        })();
	      } else {
	        _reactRouter.browserHistory.push('/monitor');
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var info = this.props.info;
	      return _react2.default.createElement(
	        'section',
	        { className: _Monitor2.default.main },
	        _react2.default.createElement(_DataStatePreview2.default, null),
	        _react2.default.createElement(_DataParkingState2.default, { vehicleId: this.props.params.id }),
	        _react2.default.createElement(_Tips2.default, null)
	      );
	    }
	  }]);

	  return Monitor;
	}(_react2.default.Component);

	Monitor.needs = [_postActions.infoAPI];
	exports.default = (0, _reactRedux.connect)(function (state) {
	  return state.monitor;
	})(Monitor);

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _StatePreview = __webpack_require__(35);

	var _StatePreview2 = _interopRequireDefault(_StatePreview);

	var _reactRedux = __webpack_require__(7);

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

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _Tab = __webpack_require__(36);

	var _Tab2 = _interopRequireDefault(_Tab);

	var _StatePreview = __webpack_require__(42);

	var _StatePreview2 = _interopRequireDefault(_StatePreview);

	var _StateIndicator = __webpack_require__(43);

	var _StateIndicator2 = _interopRequireDefault(_StateIndicator);

	var _ProgressBar = __webpack_require__(31);

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
						status == 1 ? '正常' : '停止'
					),
					_react2.default.createElement(
						'dt',
						{ className: _StatePreview2.default['state-title'] },
						'更新于:'
					),
					_react2.default.createElement(
						'dd',
						{ className: _StatePreview2.default['state-content'] },
						"时间容易造成前后端渲染不一致"
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
						location[2]
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
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _TabTitle = __webpack_require__(37);

	var _TabTitle2 = _interopRequireDefault(_TabTitle);

	var _TabContent = __webpack_require__(39);

	var _TabContent2 = _interopRequireDefault(_TabContent);

	var _Tab = __webpack_require__(41);

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
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _TabTitle = __webpack_require__(38);

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
/* 38 */
/***/ function(module, exports) {

	module.exports = {
		"root": "TabTitle__root-1dplc",
		"desc": "TabTitle__desc-2Bywm",
		"title-indicator": "TabTitle__title-indicator-EHIrv"
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _TabContent = __webpack_require__(40);

	var _TabContent2 = _interopRequireDefault(_TabContent);

	var _classnames = __webpack_require__(21);

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
/* 40 */
/***/ function(module, exports) {

	module.exports = {
		"root": "TabContent__root-iqB6C"
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = {
		"root": "Tab__root-17ZAJ"
	};

/***/ },
/* 42 */
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
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _StatePreview = __webpack_require__(42);

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
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _reactRedux = __webpack_require__(7);

	var _ParkingState = __webpack_require__(45);

	var _ParkingState2 = _interopRequireDefault(_ParkingState);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function mapStateToProps(state, ownProps) {
		var _state$monitor = state.monitor;
		var isFetching = _state$monitor.isFetching;
		var _state$monitor$distri = _state$monitor.distribute;
		var total = _state$monitor$distri.total;
		var parking = _state$monitor$distri.parking;

		return {
			total: total, parking: parking, isFetching: isFetching,
			vehicleId: ownProps.vehicleId
		};
	}

	exports.default = (0, _reactRedux.connect)(mapStateToProps)(_ParkingState2.default); // 注入dispatch

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _Tab = __webpack_require__(36);

	var _Tab2 = _interopRequireDefault(_Tab);

	var _ParkingState = __webpack_require__(46);

	var _ParkingState2 = _interopRequireDefault(_ParkingState);

	var _ParkingItem = __webpack_require__(47);

	var _ParkingItem2 = _interopRequireDefault(_ParkingItem);

	var _StateIndicator = __webpack_require__(43);

	var _StateIndicator2 = _interopRequireDefault(_StateIndicator);

	var _ProgressBar = __webpack_require__(31);

	var _ProgressBar2 = _interopRequireDefault(_ProgressBar);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 这里通过clearfix向Tab内部添加自定义的样式，按要求覆盖样式。
	var ParkingState = function ParkingState(_ref) {
		var total = _ref.total;
		var parking = _ref.parking;
		var isFetching = _ref.isFetching;
		var dispatch = _ref.dispatch;
		var vehicleId = _ref.vehicleId;
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
						_react2.default.createElement(_ParkingItem2.default, _extends({}, parking[index], { dispatch: dispatch, vehicleId: vehicleId }))
					);
				})
			)
		);
	};

	exports.default = ParkingState;

/***/ },
/* 46 */
/***/ function(module, exports) {

	module.exports = {
		"minHeight": "3rem",
		"root": "ParkingState__root-1MmCs",
		"wrapper": "ParkingState__wrapper-3nVlM",
		"indicator": "ParkingState__indicator-qOpGw"
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _ParkingItem = __webpack_require__(48);

	var _ParkingItem2 = _interopRequireDefault(_ParkingItem);

	var _classnames = __webpack_require__(21);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _userActions = __webpack_require__(49);

	var _ProgressBar = __webpack_require__(31);

	var _ProgressBar2 = _interopRequireDefault(_ProgressBar);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 合并样式


	var ParkingItem = function ParkingItem(_ref) {
		var dispatch = _ref.dispatch;
		var vehicleId = _ref.vehicleId;
		var id = _ref.id;
		var pos = _ref.pos;
		var currentStatus = _ref.currentStatus;
		var sensorFetching = _ref.sensorFetching;

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
			{ className: _ParkingItem2.default.extra, onClick: function onClick(e) {
					if (currentStatus === 'ordered') {
						alert('无效的操作，该车位已被预订!');
						e.stopPropagation();
						return;
					}
					dispatch((0, _userActions.userOrder)({ id: vehicleId, sensorId: id, statusMsg: currentStatus }));
				} },
			_react2.default.createElement(
				'div',
				{ className: finalStyle },
				_react2.default.createElement(
					'div',
					{ style: { display: 'inline-block', width: '100%', verticalAlign: 'middle' } },
					_react2.default.createElement(
						'span',
						null,
						'序号:',
						id
					),
					_react2.default.createElement(
						'span',
						null,
						'位置:',
						pos[0] + '/' + pos[1]
					)
				),
				_react2.default.createElement('i', { style: { display: 'inline-block', height: '100%', verticalAlign: 'middle' } })
			),
			_react2.default.createElement(
				'div',
				{ className: _ParkingItem2.default.backface },
				sensorFetching !== undefined && sensorFetching === true ? _react2.default.createElement(_ProgressBar2.default, null) : _react2.default.createElement(
					'span',
					null,
					'点击预订车位'
				)
			)
		);
	};

	/*
	{isOk !==undefined ? (isOk === true ? <span>预订成功</span> : <span>预订失败</span>): '' }
	 */

	exports.default = ParkingItem;

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = {
		"extra": "ParkingItem__extra-PYmRF",
		"root": "ParkingItem__root-3V4Ag",
		"backface": "ParkingItem__backface-3KKfs",
		"idle": "ParkingItem__idle-1ivjh",
		"busy": "ParkingItem__busy-VSf4x",
		"ordered": "ParkingItem__ordered-TT6_o"
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.userOrder = userOrder;

	var _Constants = __webpack_require__(50);

	var qs = __webpack_require__(51);

	var BASE_URL = typeof window === 'undefined' ? "http://localhost:3000" : "http://localhost:3001";

	function patch_ordered(sensorId) {
		return {
			type: _Constants.ORDERED_PATCH,
			sensorId: sensorId
		};
	}

	function received_oredered(sensorId) {
		return {
			type: _Constants.ORDERED_RECEIVE,
			sensorId: sensorId
		};
	}

	function userOrder(data) {
		// params: 停车场id， data:{id,sensorId,status}提交sensorid和当前状态字符串
		debugger;
		var requestUrl = BASE_URL + "/api/v1/vehicle/" + data.id + '&' + data.sensorId;
		return {
			types: [_Constants.ORDERED_PATCH, _Constants.ORDERED_RECEIVE, _Constants.NETWORK_ERROR],
			payload: { sensorId: data.sensorId, requestUrl: requestUrl },
			shouldCallAPI: function shouldCallAPI(state) {
				return true;
			},
			API: function API() {
				return fetch(requestUrl, { method: 'PATCH', body: qs.stringify(data) });
			} // 分离的好，把fetch分离出来，易于配置。

			// 问题记录： fetch这个api有点问题，无法提交额外的数据，针对post和patch都无法提交
		};
	}

/***/ },
/* 50 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	// 处理首屏数据拉去的网络操作
	var REQUEST_MONITOR = exports.REQUEST_MONITOR = "REQUEST_MONITOR"; // 发送请求开始时触发的事件
	var RECIEVE_MONITOR = exports.RECIEVE_MONITOR = "RECIEVE_MONITOR"; // 发送请求结束后
	var NETWORK_ERROR = exports.NETWORK_ERROR = "NETWORK_ERROR"; //promise请求网络异常

	// 通用网络异常
	var INVALIDATE_PREVIEW = exports.INVALIDATE_PREVIEW = "INVALIDATE_PREVIEW"; // 改变当前状态

	// 获取所有停车场的数据
	var REQUEST_ALL_VEHICLES = exports.REQUEST_ALL_VEHICLES = "request_all_vehicles_info";
	var RECIEVE_ALL_VEHICLES = exports.RECIEVE_ALL_VEHICLES = 'receive_all_vehicles_info';

	// 接受服务器推送，进行更新。

	var RECIEVE_UPDATE_DATA = exports.RECIEVE_UPDATE_DATA = 'receive_update_data';

	// 用户操作

	var ORDERED_PATCH = exports.ORDERED_PATCH = 'ordered_patch'; // 开始发送反向请求
	var ORDERED_RECEIVE = exports.ORDERED_RECEIVE = 'ordered_receive'; // 接收响应数据

/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = require("querystring");

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _Tips = __webpack_require__(53);

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
/* 53 */
/***/ function(module, exports) {

	module.exports = {
		"tips": "Tips__tips-2sJuZ",
		"btn": "Tips__btn-2CFyJ"
	};

/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = {
		"main": "Monitor__main-1sslL"
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.infoAPI = infoAPI;
	exports.selectorsAPI = selectorsAPI;

	var _isomorphicFetch = __webpack_require__(56);

	var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

	var _Constants = __webpack_require__(50);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var BASE_URL = typeof window === 'undefined' ? "http://localhost:3000" : "http://localhost:3001";

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

	// 如果仅仅是客户端调用那么requestUrl可以在使用的时候传入，但是这里是要配合server rendering自动完成数据
	// 提取的，因此必须在这里明确请求的url地址。
	function infoAPI(params) {
		var requestUrl = BASE_URL + "/api/v1/vehicle/";

		console.log('当前负载params.id是：' + params.id);
		requestUrl = requestUrl + (params.id || 0);
		console.log('当前请求的url是' + requestUrl);
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

	// callAPI 中间件中自动生成了action，因此这里不需要额外定义对应的同步action了。
	// 获取
	function selectorsAPI(params) {
		var requestUrl = BASE_URL + "/api/v1/vehicles";
		return {
			types: [_Constants.REQUEST_ALL_VEHICLES, _Constants.RECIEVE_ALL_VEHICLES, _Constants.NETWORK_ERROR],
			payload: { params: params, requestUrl: requestUrl },
			shouldCallAPI: function shouldCallAPI(state) {
				return true;
			},
			API: function API() {
				return (0, _isomorphicFetch2.default)(requestUrl);
			}
		};
	}

/***/ },
/* 56 */
/***/ function(module, exports) {

	module.exports = require("isomorphic-fetch");

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.receiveUpdateData = undefined;

	var _Constants = __webpack_require__(50);

	var receiveUpdateData = exports.receiveUpdateData = function receiveUpdateData(data) {
		return {
			type: _Constants.RECIEVE_UPDATE_DATA,
			data: data
		};
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var mqtt = __webpack_require__(59);
	var client = mqtt.connect('ws://localhost:8081');

	//

	exports.subscribe = function (id) {
		// 订阅传主题为:'传感器变化'的消息。
		client.on('connect', function () {
			console.log('连接mqtt代理成功！当前客户端id为:', client.id);

			client.subscribe('sensor_changed' + id, { qos: 0 }, function () {
				console.log('订阅消息成功，当前订阅的主题消息为:sensor_changed' + id);
			});
		});

		client.on('close', function () {
			console.log('mqtt连接关闭!');
		});
		client.on('reconnect', function () {
			console.log('mqtt重新连接');
		});
		client.on('error', function (e) {
			console.log('mqtt客户端发生错误:', e);
		});
	};

	exports.onReceivedMsg = function (cb) {
		client.on('message', function (topic, message, packet) {
			console.log('接收到消息。消息主题为:' + topic + ',消息主题为:' + message);
			cb(JSON.parse(message));
		});
	};

	exports.publish = function (topic, payload) {
		//client.publish('presence','Hello mqtt') ;
	};

/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = require("mqtt");

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _Selector = __webpack_require__(61);

	var _Selector2 = _interopRequireDefault(_Selector);

	var _classnames = __webpack_require__(21);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _connectSelector = __webpack_require__(62);

	var _connectSelector2 = _interopRequireDefault(_connectSelector);

	var _reactRedux = __webpack_require__(7);

	var _reactRouter = __webpack_require__(5);

	var _postActions = __webpack_require__(55);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	//  这里要变成注解的形式，用于包装高阶组件。
	// 

	var Selector = function (_React$Component) {
		_inherits(Selector, _React$Component);

		function Selector(props) {
			_classCallCheck(this, Selector);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Selector).call(this, props));

			_this.componentDidMount = function () {
				var dispatch = _this.props.dispatch;
				dispatch((0, _postActions.selectorsAPI)());
			};

			_this.displayName = 'Selector';
			return _this;
		}

		_createClass(Selector, [{
			key: 'render',
			value: function render() {
				var _props = this.props;
				var ids = _props.ids;
				var names = _props.names;

				return _react2.default.createElement(
					'ul',
					{ className: _Selector2.default["root"] },
					ids.map(function (id, index) {
						return _react2.default.createElement(
							'li',
							{ className: _Selector2.default["list-item"], key: index },
							_react2.default.createElement(
								_reactRouter.Link,
								{ to: '/monitor/' + id, className: _Selector2.default["item-name"]
								},
								names[index]
							),
							_react2.default.createElement(
								'span',
								{ className: _Selector2.default["item-status"] },
								'运行状态良好'
							)
						);
					})
				);
			}
		}]);

		return Selector;
	}(_react2.default.Component);

	Selector.nees = [_postActions.selectorsAPI];
	exports.default = (0, _reactRedux.connect)(function (state) {
		return {
			ids: state.selector.ids,
			names: state.selector.names
		};
	})(Selector);

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = {
		"root": "Selector__root-3Jr0A",
		"list-item": "Selector__list-item-1nLGw",
		"item-name": "Selector__item-name-1fIqq",
		"item-status": "Selector__item-status-1dEcN"
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _Selector = __webpack_require__(60);

	var _Selector2 = _interopRequireDefault(_Selector);

	var _postActions = __webpack_require__(55);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var connectSelector = function connectSelector(_ref) {
		var mapStateToProps = _ref.mapStateToProps;
		var dispatch = _ref.dispatch;
		return function (Compo) {
			return function (_React$Component) {
				_inherits(WrappedComponent, _React$Component);

				// 外部实际上操作的是这个组件

				function WrappedComponent(props) {
					_classCallCheck(this, WrappedComponent);

					var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WrappedComponent).call(this, props));

					_this.componentDidMount = function () {
						dispatch((0, _postActions.selectorsAPI)());
					};

					_this.render = function (ownProps) {
						// ownProps来自于高阶组件接收到的参数
						React.createElement(Compo, mapStateToProps(ownProps));
					};

					_this.displayName = 'WrappedComponent';
					return _this;
				}

				return WrappedComponent;
			}(React.Component);
		};
	};

	exports.default = connectSelector;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _redux = __webpack_require__(64);

	var _reduxThunk = __webpack_require__(65);

	var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

	var _reduxLogger = __webpack_require__(66);

	var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

	var _APIMiddleware = __webpack_require__(67);

	var _reducers = __webpack_require__(68);

	var _reducers2 = _interopRequireDefault(_reducers);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var loggerMiddleware = (0, _reduxLogger2.default)();

	exports.default = function (initialState) {
		return (0, _redux.createStore)(_reducers2.default, initialState, (0, _redux.applyMiddleware)(_APIMiddleware.callAPIMiddleware, _reduxThunk2.default, typeof window != 'undefined' ? loggerMiddleware : function (_ref) {
			var dispatch = _ref.dispatch;
			return function (next) {
				return function (action) {
					return next(action);
				};
			};
		}));
	};

/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = require("redux");

/***/ },
/* 65 */
/***/ function(module, exports) {

	module.exports = require("redux-thunk");

/***/ },
/* 66 */
/***/ function(module, exports) {

	module.exports = require("redux-logger");

/***/ },
/* 67 */
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
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _redux = __webpack_require__(64);

	var _monitorReducer = __webpack_require__(69);

	var _monitorReducer2 = _interopRequireDefault(_monitorReducer);

	var _selectorsReducer = __webpack_require__(71);

	var _selectorsReducer2 = _interopRequireDefault(_selectorsReducer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = (0, _redux.combineReducers)({
		monitor: _monitorReducer2.default, selector: _selectorsReducer2.default
	});

	// 这个文件至关重要，直接决定了整个应用的状态树顶层结构。

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _immutable = __webpack_require__(70);

	var _Constants = __webpack_require__(50);

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
		info: {
			id: 0,
			name: '',
			location: ["00.000", "00.000"],
			status: 0
		},
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
				// const {
				// 	info:{id,location,status},
				// 	detail:{total,busy,ordered,idle},
				// 	distribute
				// } = action.json;
				return (0, _immutable.fromJS)(state).merge(action.json).merge({
					isFetching: false
				}).toJS();
			case _Constants.NETWORK_ERROR:
				return {
					error: 'Network error occrued ,see the detail:' + action.error.toString()
				};
			case _Constants.RECIEVE_UPDATE_DATA:
				//sensorId,
				//status,
				//statusMsg
				//prevStatusMsg 这个字段可以优化，不需要从服务器传递过来
				//const { sensorId, statusMsg, prevStatusMsg } = action.data;  // 找出前一个，更新！			
				return updateSensor(state, action.data); // 如果这里出错了就改回来
			case _Constants.ORDERED_PATCH:
				var rs1 = updateSensorExtra(state, action.sensorId, true, false);
				debugger;
				return rs1;
			case _Constants.ORDERED_RECEIVE:
				// 返回的数据格式
				// {id,sensorId,isOk:true,prevStatusMsg}
				var sensorId = action.json.sensorId;

				var updatedState = updateSensor(state, { sensorId: sensorId, statusMsg: 'ordered' });
				var rs2 = updateSensorExtra(updatedState, sensorId, false);
				debugger;
				return rs2;
			default:
				return state;
		}
	};

	// 根据单个传感器的sensorId，来更新当前传感器的状态。


	function updateSensor(state, _ref) {
		var sensorId = _ref.sensorId;
		var statusMsg = _ref.statusMsg;
		var prevStatusMsg = _ref.prevStatusMsg;

		var cloned = (0, _immutable.fromJS)(state).toJS();

		// 更新分布图中的状态
		cloned.distribute.parking.forEach(function (item, index) {
			if (item.id == sensorId) {
				if (!prevStatusMsg) {
					prevStatusMsg = item.currentStatus;
				}
				item.currentStatus = statusMsg;
			}
		});

		// 更新预览图中的状态
		var detail = cloned.detail;
		detail[prevStatusMsg] -= 1;
		detail[statusMsg] += 1;

		return cloned;
	}

	function updateSensorExtra(state, sensorId, sensorFetching) {
		return (0, _immutable.fromJS)(state).updateIn(['distribute', 'parking'], function (items) {
			return items.map(function (item) {
				debugger;
				if (item.get('id') == sensorId) {
					item.set('sensorFetching', sensorFetching);
				}
				return item;
			});
		}).toJS();
	}

/***/ },
/* 70 */
/***/ function(module, exports) {

	module.exports = require("immutable");

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _immutable = __webpack_require__(70);

	var _Constants = __webpack_require__(50);

	var initialState = { ids: [], names: [] };

	exports.default = function () {
		var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
		var action = arguments[1];


		switch (action.type) {
			case _Constants.REQUEST_ALL_VEHICLES:
				return state;
			case _Constants.RECIEVE_ALL_VEHICLES:
				var rs = (0, _immutable.fromJS)(state).merge(action.json).toJS();
				return rs;
			default:
				return state;
		}
	};

/***/ },
/* 72 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (appHtml, initialState) {
		return "\n\t<!DOCTYPE html>\n\t<html lang=\"zh\">\n\t<head>\n\t    <!-- META 一般设置 -->\n\t    <meta charset=\"UTF-8\">\n\t    <meta http-equiv=\"Content-Type\" content=\"text/html;charset=UTF-8\">\n\t    <meta name=\"viewport\" content=\"width=device-width,initial-scale=1,maximun-scale=1,user-scalable=no\" >\n\t   \n\t    <!--设置IE浏览器有限使用edge渲染 -->\n\t    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">\n\t    <meta name=\"HandheldFriendly\" content=\"true\">\n\t    <title>Document</title>\n\n\t    <!-- link优化 -->\n\t    <link rel=\"shortcut icon\" href=\"/static/favicon.ico\">\n\t    <link rel=\"icon\" href=\"/static/favicon.ico\">\n\t    <link href=\"/static/dist/common.css\" rel = 'stylesheet'/>\n\t\t\t<link href=\"/static/dist/module.css\" rel = 'stylesheet'/>\n\n\t    <!-- 国内双核浏览器，特别是360，使用渲染引擎从左到右 -->\n\t    <meta name=\"renderer\" content=\"webkit|ie-comp|ie-stand\">\n\t    <!-- seo优化 -->\n\t    <meta name=\"author\" content=\"\">\n\t    <meta name=\"keywords\" content=\"\">\n\t\t\n\t    <!-- html shim -->\n\t    <!--[if lt IE 9]>\n\t      <script src=\"http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js\"></script>\n\t    <![endif]-->\n\t    <script src=\"http://cdn.bootcss.com/es5-shim/4.5.8/es5-shim.min.js\"></script>\n\t    <script src=\"/static/scripts/browserMqtt.js\"></script>\n\t</head>\n\t<body>\n\t    <div id=\"react-app\">" + appHtml + "</div>\n\t    <script>\n\t\t\t\twindow.__INITIAL_STATE__ = " + JSON.stringify(initialState) + "\n\t    </script>\n\t    <script src='/static/dist/bundle.js'></script>\n\t</body>\n\t</html>\n";
	};

/***/ },
/* 73 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (dispatch, components, params) {
		console.log(components);

		var needs = components.reduce(function (prev, current) {
			return (current.needs || []).
			// .concat((current.WrappedComponent ? current.WrappedComponent.needs : []) || []) //组件上的static属性会映射到包装他的高阶组件上去
			concat(prev);
		}, []);

		console.log('-----------------fetchDependentData中----------------');
		console.log(needs);
		var promises = needs.map(function (need) {
			return dispatch(need(params));
		}); // 备注二：要求该actionCreator返回promise类型
		return Promise.all(promises);
	};

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 75 */
/***/ function(module, exports) {

	module.exports = require("socket.io");

/***/ }
/******/ ]);