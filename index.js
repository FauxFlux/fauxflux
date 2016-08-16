(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("mobx"));
	else if(typeof define === 'function' && define.amd)
		define(["mobx"], factory);
	else if(typeof exports === 'object')
		exports["fauxflux"] = factory(require("mobx"));
	else
		root["fauxflux"] = factory(root["mobx"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
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

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _mobx = __webpack_require__(2);

	var _mobx2 = _interopRequireDefault(_mobx);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var FauxFlux = function () {
	  function FauxFlux(store, actions) {
	    var _this = this;

	    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    _classCallCheck(this, FauxFlux);

	    /*
	     * Using the awesome Mobx library for our observables
	     * https://github.com/mobxjs/mobx (v2.2.1 or greater)
	     */
	    this.mobx = _mobx2.default;

	    /* ------------------ Options ------------------*/

	    // Default to useStrict mode.
	    if (options.useStrict != false) {
	      // In strict mode, MobX will throw an exception on any attempt to modify state outside a MobX action.
	      this.mobx.useStrict(true);
	    }

	    if ('production' !== process.env.NODE_ENV && options.debug) {
	      (function () {
	        // Cool gist for logging mobx actions - https://gist.github.com/mmazzarolo/8d321f01f749d3470f0314e773114a95

	        /* --- BEGIN DEV DEBUGGING ------------*/

	        var DEFAULT_STYLE = 'color: #006d92; font-weight:bold;';

	        // Just call this function after MobX initialization
	        // As argument you can pass an object with:
	        // - collapsed: true   -> shows the log collapsed
	        // - style             -> the style applied to the action description
	        var startLogging = function startLogging() {
	          var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	          var collapsed = _ref.collapsed;
	          var style = _ref.style;

	          _this.mobx.spy(function (event) {
	            if (event.type === 'action') {
	              if (collapsed) {
	                console.groupCollapsed('Action @ ' + formatTime(new Date()) + ' ' + event.name);
	              } else {
	                console.group('Action @ ' + formatTime(new Date()) + ' ' + event.name);
	              }
	              console.log('%cType: ', style || DEFAULT_STYLE, event.type);
	              console.log('%cName: ', style || DEFAULT_STYLE, event.name);
	              console.log('%cTarget: ', style || DEFAULT_STYLE, event.target);
	              console.log('%cArguments: ', style || DEFAULT_STYLE, event.arguments);
	              console.groupEnd();
	            }
	          });
	        };

	        // Utilities
	        var repeat = function repeat(str, times) {
	          return new Array(times + 1).join(str);
	        };
	        var pad = function pad(num, maxLength) {
	          return repeat('0', maxLength - num.toString().length) + num;
	        };
	        var formatTime = function formatTime(time) {
	          return pad(time.getHours(), 2) + ':' + pad(time.getMinutes(), 2) + ':' + pad(time.getSeconds(), 2) + '.' + pad(time.getMilliseconds(), 3);
	        };

	        startLogging({ collapsed: true });

	        /* --- END DEV DEBUGGING ------------*/
	      })();
	    }

	    /* ------------------ /Options ------------------*/

	    /* ------------------ Errors ------------------*/

	    // Make sure that a store and actions are passed in.
	    if ('production' !== process.env.NODE_ENV) {
	      if (!store) {
	        throw new Error('A store object should be passed as the first argument to the FauxFlux instance -- Example: new FauxFlux(store: {}, actions: [])');
	      }
	      if (!Array.isArray(actions)) {
	        throw new Error('An array of actions should be passed as the second argument to the FauxFlux instance -- Example: new FauxFlux(store: {}, actions: [])');
	      }
	    }

	    /* ------------------ /Errors ------------------*/

	    /* ------------------ Setup ------------------*/

	    // Set up the store as a Mobx Observable if it is not one already.
	    this.store = !this.mobx.isObservable(store) ? this.mobx.observable(store) : store;
	    // Get the actions object ready to add actions to in the registerActions method below.
	    this.actions = {};
	    // Autobind methods
	    this.registerActions = this.registerActions.bind(this);
	    this.dispatch = this.dispatch.bind(this);
	    // Register the actions that are passed in when initilizing.
	    this.registerActions(actions);

	    /* ------------------ /Setup ------------------*/
	  }

	  _createClass(FauxFlux, [{
	    key: 'registerActions',
	    value: function registerActions(actions) {
	      var _this2 = this;

	      actions.forEach(function (_ref2) {
	        var name = _ref2.name;
	        var action = _ref2.action;

	        // Check for multiple actions with the same name being defined.
	        if ('production' !== process.env.NODE_ENV) {
	          if (_this2.actions[name]) {
	            throw new Error('The action [' + name + '], has been created more than once! Please rename one of these actions.');
	          }
	        }
	        // Set the action as a method on this instance's actions object.
	        // Wrap it in a MobX action to allow the action we pass to modify the state.
	        _this2.actions[name] = _this2.mobx.action('FauxFlux action - ' + name, action);
	      });
	    }
	  }, {
	    key: 'dispatch',
	    value: function dispatch(action, payload) {
	      // Check to make sure the action we are calling has been registered.
	      if ('production' !== process.env.NODE_ENV) {
	        if (!this.actions[action]) {
	          throw new Error('The action [' + action + '], is not a registered action. Please make sure you have spelled the action name correctly and it is in the actions available.');
	        }
	      }

	      return Promise.resolve(this.actions[action]({ store: this.store, dispatch: this.dispatch, mobx: this.mobx }, payload));
	    }
	  }]);

	  return FauxFlux;
	}();

	module.exports = FauxFlux;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }
/******/ ])
});
;