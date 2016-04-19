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

	'use strict';

	var _index = __webpack_require__(1);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _IncrementalDOM = IncrementalDOM;
	var patch = _IncrementalDOM.patch;
	var eO = _IncrementalDOM.elementOpen;
	var eC = _IncrementalDOM.elementClose;
	var eV = _IncrementalDOM.elementVoid;
	var tX = _IncrementalDOM.text;


	var FILTER_ALL = 'all';
	var FILTER_ACTIVE = 'active';
	var FILTER_COMPLETED = 'completed';
	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	// Todo app state
	var store = {
	  newTodoText: '',
	  todos: [],
	  editing: null,
	  filter: FILTER_ALL,
	  activeTodoCount: function activeTodoCount() {
	    return store.todos.reduce(function (accum, todo) {
	      return todo.completed ? accum : accum + 1;
	    }, 0);
	  },
	  completedCount: function completedCount() {
	    return store.todos.length - store.activeTodoCount;
	  }
	};
	// Todo app actions.
	var actions = [{
	  name: 'hash_has_changed',
	  action: function action(_ref, payload) {
	    var store = _ref.store;

	    var filter = window.location.hash.substr(2);
	    if (!filter) {
	      filter = FILTER_ALL;
	    }
	    store.filter = filter;
	  }
	}, {
	  name: 'update_new_todo_text',
	  action: function action(_ref2, text) {
	    var store = _ref2.store;

	    store.newTodoText = text;
	  }
	}, {
	  name: 'add_new_todo',
	  action: function action(_ref3, payload) {
	    var store = _ref3.store;

	    var title = store.newTodoText.trim();

	    if (title) {
	      store.todos.push({ id: uuid(), completed: false, title: title, editingText: '' });
	      store.newTodoText = '';
	    }
	  }
	}, {
	  name: 'set_edit_id',
	  action: function action(_ref4, id) {
	    var store = _ref4.store;

	    store.editing = id;
	  }
	}, {
	  name: 'toggle_completed',
	  action: function action(_ref5, todoToToggle) {
	    var store = _ref5.store;

	    todoToToggle.completed = !todoToToggle.completed;
	  }
	},, {
	  name: 'toggle_all_completed',
	  action: function action(_ref6, checked) {
	    var store = _ref6.store;
	    var mobx = _ref6.mobx;

	    mobx.transaction(function () {
	      store.todos.forEach(function (todo) {
	        todo.completed = checked;
	      });
	    });
	  }
	}, {
	  name: 'edit_todo_title',
	  action: function action(_ref7, _ref8) {
	    var store = _ref7.store;
	    var todoToEdit = _ref8.todoToEdit;
	    var title = _ref8.title;

	    todoToEdit.title = title;
	  }
	}, {
	  name: 'edit_todo_editingText',
	  action: function action(_ref9, _ref10) {
	    var store = _ref9.store;
	    var todoToEdit = _ref10.todoToEdit;
	    var editingText = _ref10.editingText;

	    todoToEdit.editingText = editingText;
	  }
	}, {
	  name: 'delete_todo',
	  action: function action(_ref11, todoToDelete) {
	    var store = _ref11.store;

	    store.todos.remove(todoToDelete);
	  }
	}, {
	  name: 'clear_completed',
	  action: function action(_ref12, payload) {
	    var store = _ref12.store;

	    store.todos = store.todos.filter(function (todo) {
	      return !todo.completed;
	    });
	  }
	}];
	// Create our FauxFlux instance.
	var FF = new _index2.default(store, actions);

	////////////////////////// localStorage

	// localStorage key
	var key = 'todos-app';
	// actions used to initilize and set the todos
	var localStorageActions = [{
	  name: 'localStorage_init_todos',
	  action: function action(_ref13, key) {
	    var store = _ref13.store;
	    var mobx = _ref13.mobx;

	    var jsonTodos = localStorage.getItem(key);
	    if (jsonTodos) {
	      mobx.extendObservable(store, { todos: JSON.parse(jsonTodos) });
	    }
	  }
	}, {
	  name: 'localStorage_set_todos',
	  action: function action(_ref14, key) {
	    var store = _ref14.store;
	    var mobx = _ref14.mobx;

	    var todos = mobx.toJSON(store.todos);
	    localStorage.setItem(key, JSON.stringify(todos));
	  }
	}];
	// Register our actions so we can call them with dispatch().
	FF.registerActions(localStorageActions);
	// Make sure to check for todos in the localStorage before autorunning our localStorage_set_todos dispatch function.
	FF.dispatch('localStorage_init_todos', key).then(function () {
	  // Run the localStorage_set_todos action anytime an observable inside that action changes.
	  // In this case the todos array. --- let todos = mobx.toJSON(store.todos);
	  FF.mobx.autorun(function () {
	    return FF.dispatch('localStorage_set_todos', key);
	  });
	});

	// Listen for haschange so we can update our filter.
	window.addEventListener('hashchange', function () {
	  FF.dispatch('hash_has_changed');
	}, false);
	// set the filter, which is based off the hash, on the inital render.
	FF.dispatch('hash_has_changed');

	var headerElement = document.getElementById('header');
	// Put our views in mobx.autorun so they will call patch anytime an observable in the autorun function changes.
	// Self patching views!!!!
	var HeaderView = FF.mobx.autorun(function () {
	  var store = FF.store;
	  var dispatch = FF.dispatch;

	  new Promise(function (resolve, reject) {
	    patch(headerElement, function () {
	      eO('header');
	      eO('h1');tX('todos');eC('h1');
	      eV('input', null, null, 'type', 'text', 'id', 'newTodoText', 'value', store.newTodoText, 'onkeydown', function (e) {
	        if (e.keyCode == ENTER_KEY) {
	          e.preventDefault();
	          dispatch('add_new_todo');
	        }
	      }, 'onkeyup', function (e) {
	        dispatch('update_new_todo_text', e.target.value);
	      }, 'class', 'new-todo', 'placeholder', 'What needs to be done?');
	      eC('header');
	      // Resolve our promise - end of patch.
	      resolve();
	    });
	  }).then(function () {
	    // Keep input elements consistent on state change.
	    document.getElementById('newTodoText').value = store.newTodoText;
	  });
	});

	var mainElement = document.getElementById('main');
	var MainView = FF.mobx.autorun(function () {
	  var store = FF.store;
	  var dispatch = FF.dispatch;

	  new Promise(function (resolve, reject) {
	    patch(mainElement, function () {
	      eO('section', null, null, 'class', 'main', 'style', { display: store.todos.length ? 'block' : 'none' });
	      eV('input', null, null, 'type', 'checkbox', 'id', 'toggleAll', 'class', 'toggle-all', 'onclick', function (e) {
	        dispatch('toggle_all_completed', e.target.checked);
	      }, 'data-checked', store.activeTodoCount == 0);
	      // TODO ITEMS
	      eO('ul', null, null, 'class', 'todo-list');
	      var shownTodos = store.todos.filter(function (todo) {
	        switch (store.filter) {
	          case FILTER_ACTIVE:
	            return !todo.completed;
	          case FILTER_COMPLETED:
	            return todo.completed;
	          default:
	            return true;
	        }
	      });
	      shownTodos.forEach(function (todo) {
	        eO('li', todo.id, null, 'class', todoClassNames(todo));
	        eO('div', null, null, 'class', 'view');
	        eV('input', null, null, 'type', 'checkbox', 'class', 'toggle', 'onclick', function (e) {
	          dispatch('toggle_completed', todo);
	        }, 'data-checked', todo.completed);
	        eO('label', null, null, 'ondblclick', function (e) {
	          dispatch('edit_todo_editingText', { todoToEdit: todo, editingText: todo.title }).then(function () {
	            dispatch('set_edit_id', todo.id).then(function () {
	              var node = document.getElementById('edit' + todo.id);
	              node.focus();
	              node.setSelectionRange(node.value.length, node.value.length);
	            });
	          });
	        });
	        tX(todo.title);
	        eC('label');
	        eV('button', null, null, 'class', 'destroy', 'onclick', function (e) {
	          e.preventDefault();dispatch('delete_todo', todo);
	        });
	        eC('div');
	        eV('input', null, null, 'type', 'input', 'data-value', todo.editingText, 'id', 'edit' + todo.id, 'class', 'edit', 'onblur', function (e) {
	          dispatch('set_edit_id', null);
	        }, 'oninput', function (e) {
	          dispatch('edit_todo_editingText', { todoToEdit: todo, editingText: e.target.value });
	        }, 'onkeydown', function (e) {
	          // If the escape key is pressed, just exit edit mode.
	          if (e.which === ESCAPE_KEY) {
	            e.preventDefault();
	            dispatch('set_edit_id', null);
	            // If the enter key is pressed ---
	          } else if (e.which === ENTER_KEY) {
	              e.preventDefault();
	              // Delete the todo if no length in the edit title
	              if (!todo.editingText.length) {
	                dispatch('delete_todo', todo);
	                // Otherwise, set the title to the edit title and exit edit mode.
	              } else {
	                  dispatch('edit_todo_title', {
	                    todoToEdit: todo,
	                    title: todo.editingText
	                  }).then(function () {
	                    dispatch('set_edit_id', null);
	                  });
	                }
	            }
	        });
	        eC('li');
	      });
	      eC('ul');
	      // END TODO ITEMS
	      eC('section');
	      // Resolve our promise - end of patch.
	      resolve();
	    });
	  }).then(function () {
	    // Keep input elements consistent on state change.
	    document.getElementById('toggleAll').checked = store.activeTodoCount == 0;
	    var inputs = document.querySelectorAll('.toggle'),
	        i = void 0;
	    for (i = 0; i < inputs.length; ++i) {
	      inputs[i].checked = inputs[i].getAttribute('data-checked') == 'true' ? true : false;
	    }
	    if (store.editing) {
	      var editing = document.getElementById('edit' + store.editing);
	      editing.value = editing.getAttribute('data-value');
	    }
	  });
	});

	var footerElement = document.getElementById('footer');
	var FooterView = FF.mobx.autorun(function () {
	  var store = FF.store;
	  var dispatch = FF.dispatch;

	  patch(footerElement, function () {
	    eO('footer', null, null, 'class', 'footer', 'style', { display: store.todos.length ? 'block' : 'none' });
	    eO('span', null, null, 'class', 'todo-count');
	    eO('strong');tX(store.activeTodoCount);eC('strong');
	    tX(' item' + (store.activeTodoCount == 1 ? '' : 's') + ' left');
	    eC('span');
	    eO('ul', null, null, 'class', 'filters');
	    eO('li');
	    eO('a', null, null, 'href', '#/', 'class', filterIsSelected(FILTER_ALL, store.filter));tX('All');eC('a');
	    eC('li');
	    eO('li');
	    eO('a', null, null, 'href', '#/active', 'class', filterIsSelected(FILTER_ACTIVE, store.filter));tX('Active');eC('a');
	    eC('li');
	    eO('li');
	    eO('a', null, null, 'href', '#/completed', 'class', filterIsSelected(FILTER_COMPLETED, store.filter));tX('Completed');eC('a');
	    eC('li');
	    eC('ul');
	    if (store.completedCount) {
	      eO('button', null, null, 'class', 'clear-completed', 'onclick', function (e) {
	        dispatch('clear_completed');
	      });
	      tX('Clear Completed');
	      eC('button');
	    }
	    eC('footer');
	  });
	});

	////////////////////////// Utility Functions

	function uuid() {
	  var i = void 0,
	      random = void 0;
	  var uuid = '';

	  for (i = 0; i < 32; i++) {
	    random = Math.random() * 16 | 0;
	    if (i === 8 || i === 12 || i === 16 || i === 20) {
	      uuid += '-';
	    }
	    uuid += (i === 12 ? 4 : i === 16 ? random & 3 | 8 : random).toString(16);
	  }

	  return uuid;
	}

	function todoClassNames(todo) {
	  var classes = [];
	  if (todo.completed) {
	    classes.push('completed');
	  }
	  if (store.editing == todo.id) {
	    classes.push('editing');
	  }
	  return classes.join(' ');
	}

	function filterIsSelected(filter, current) {
	  if (filter == current) {
	    return 'selected';
	  }
	  return '';
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	(function webpackUniversalModuleDefinition(root, factory) {
		if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') module.exports = factory(__webpack_require__(3));else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') exports["fauxflux"] = factory(require("mobx"));else root["fauxflux"] = factory(root["mobx"]);
	})(undefined, function (__WEBPACK_EXTERNAL_MODULE_2__) {
		return (/******/function (modules) {
				// webpackBootstrap
				/******/ // The module cache
				/******/var installedModules = {};

				/******/ // The require function
				/******/function __webpack_require__(moduleId) {

					/******/ // Check if module is in cache
					/******/if (installedModules[moduleId])
						/******/return installedModules[moduleId].exports;

					/******/ // Create a new module (and put it into the cache)
					/******/var module = installedModules[moduleId] = {
						/******/exports: {},
						/******/id: moduleId,
						/******/loaded: false
						/******/ };

					/******/ // Execute the module function
					/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

					/******/ // Flag the module as loaded
					/******/module.loaded = true;

					/******/ // Return the exports of the module
					/******/return module.exports;
					/******/
				}

				/******/ // expose the modules object (__webpack_modules__)
				/******/__webpack_require__.m = modules;

				/******/ // expose the module cache
				/******/__webpack_require__.c = installedModules;

				/******/ // __webpack_public_path__
				/******/__webpack_require__.p = "";

				/******/ // Load entry module and return exports
				/******/return __webpack_require__(0);
				/******/
			}(
			/************************************************************************/
			/******/[
			/* 0 */
			/***/function (module, exports, __webpack_require__) {

				/* WEBPACK VAR INJECTION */(function (process) {
					'use strict';

					Object.defineProperty(exports, "__esModule", {
						value: true
					});
					exports.default = undefined;

					var _createClass = function () {
						function defineProperties(target, props) {
							for (var i = 0; i < props.length; i++) {
								var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
							}
						}return function (Constructor, protoProps, staticProps) {
							if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
						};
					}();

					var _mobx = __webpack_require__(2);

					var _mobx2 = _interopRequireDefault(_mobx);

					function _interopRequireDefault(obj) {
						return obj && obj.__esModule ? obj : { default: obj };
					}

					function _classCallCheck(instance, Constructor) {
						if (!(instance instanceof Constructor)) {
							throw new TypeError("Cannot call a class as a function");
						}
					}

					var FauxFlux = function () {
						function FauxFlux(store, actions) {
							_classCallCheck(this, FauxFlux);

							// Make sure that a store and actions are passed in.
							if (process.env.NODE_ENV !== 'production') {
								if (!store) {
									throw new Error('A store object should be passed as the first argument to the FauxFlux instance -- Example: new FauxFlux(store: {}, actions: [])');
								}
								if (!Array.isArray(actions)) {
									throw new Error('An array of actions should be passed as the second argument to the FauxFlux instance -- Example: new FauxFlux(store: {}, actions: [])');
								}
							}

							// Set up mobx. https://github.com/mobxjs/mobx
							this.mobx = _mobx2.default;
							// Set up the store as a Mobx Observable if it is not one already.
							this.store = !this.mobx.isObservable(store) ? this.mobx.observable(store) : store;
							// Get the actions object ready to add actions to in the registerActions method below.
							this.actions = {};
							// Autobind methods
							this.registerActions = this.registerActions.bind(this);
							this.dispatch = this.dispatch.bind(this);
							// Register the actions that are passed in when initilizing.
							this.registerActions(actions);
						}

						_createClass(FauxFlux, [{
							key: 'registerActions',
							value: function registerActions(actions) {
								var _this = this;

								actions.forEach(function (_ref) {
									var name = _ref.name;
									var action = _ref.action;

									// Check for multiple actions with the same name being defined.
									if (process.env.NODE_ENV !== 'production') {
										if (_this.actions[name]) {
											throw new Error('The action [' + name + '], has been created more than once! Please rename one of these actions.');
										}
									}
									// Set the action as a method on this instance's actions object.
									_this.actions[name] = action;
								});
							}
						}, {
							key: 'dispatch',
							value: function dispatch(action, payload) {
								// Check to make sure the action we are calling has been registered.
								if (process.env.NODE_ENV !== 'production') {
									if (!this.actions[action]) {
										throw new Error('The action [' + action + '], is not a registered action. Please make sure you have spelled the action name correctly and it is in the actions available.');
									}
								}

								return Promise.resolve(this.actions[action]({ store: this.store, dispatch: this.dispatch, mobx: this.mobx }, payload));
							}
						}]);

						return FauxFlux;
					}();

					exports.default = FauxFlux;
					/* WEBPACK VAR INJECTION */
				}).call(exports, __webpack_require__(1));

				/***/
			},
			/* 1 */
			/***/function (module, exports) {

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
					while (len) {
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

				process.cwd = function () {
					return '/';
				};
				process.chdir = function (dir) {
					throw new Error('process.chdir is not supported');
				};
				process.umask = function () {
					return 0;
				};

				/***/
			},
			/* 2 */
			/***/function (module, exports) {

				module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

				/***/
			}
			/******/])
		);
	});
	;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	registerGlobals();
	exports._ = {
	    quickDiff: quickDiff,
	    resetGlobalState: resetGlobalState
	};
	exports.extras = {
	    allowStateChanges: allowStateChanges,
	    getDependencyTree: getDependencyTree,
	    getObserverTree: getObserverTree,
	    isComputingDerivation: isComputingDerivation,
	    resetGlobalState: resetGlobalState,
	    trackTransitions: trackTransitions
	};
	function autorun(view, scope) {
	    assertUnwrapped(view, "autorun methods cannot have modifiers");
	    invariant(typeof view === "function", "autorun expects a function");
	    invariant(view.length === 0, "autorun expects a function without arguments");
	    if (scope)
	        view = view.bind(scope);
	    var reaction = new Reaction(view.name || "Autorun", function () {
	        this.track(view);
	    });
	    reaction.schedule();
	    return reaction.getDisposer();
	}
	exports.autorun = autorun;
	function when(predicate, effect, scope) {
	    var disposeImmediately = false;
	    var disposer = autorun(function () {
	        if (predicate.call(scope)) {
	            if (disposer)
	                disposer();
	            else
	                disposeImmediately = true;
	            effect.call(scope);
	        }
	    });
	    if (disposeImmediately)
	        disposer();
	    return disposer;
	}
	exports.when = when;
	function autorunUntil(predicate, effect, scope) {
	    deprecated("`autorunUntil` is deprecated, please use `when`.");
	    return when.apply(null, arguments);
	}
	exports.autorunUntil = autorunUntil;
	function autorunAsync(func, delay, scope) {
	    if (delay === void 0) { delay = 1; }
	    if (scope)
	        func = func.bind(scope);
	    var isScheduled = false;
	    var r = new Reaction(func.name || "AutorunAsync", function () {
	        if (!isScheduled) {
	            isScheduled = true;
	            setTimeout(function () {
	                isScheduled = false;
	                if (!r.isDisposed)
	                    r.track(func);
	            }, delay);
	        }
	    });
	    r.schedule();
	    return r.getDisposer();
	}
	exports.autorunAsync = autorunAsync;
	function computed(targetOrExpr, keyOrScope, baseDescriptor, options) {
	    if (arguments.length < 3 && typeof targetOrExpr === "function")
	        return computedExpr(targetOrExpr, keyOrScope);
	    return computedDecorator.apply(null, arguments);
	}
	exports.computed = computed;
	function computedExpr(expr, scope) {
	    var _a = getValueModeFromValue(expr, ValueMode.Recursive), mode = _a[0], value = _a[1];
	    return new ComputedValue(value, scope, mode === ValueMode.Structure, value.name || "ComputedValue");
	}
	function computedDecorator(target, key, baseDescriptor, options) {
	    if (arguments.length === 1) {
	        var options_1 = target;
	        return function (target, key, baseDescriptor) { return computedDecorator.call(null, target, key, baseDescriptor, options_1); };
	    }
	    invariant(baseDescriptor && baseDescriptor.hasOwnProperty("get"), "@computed can only be used on getter functions, like: '@computed get myProps() { return ...; }'");
	    assertPropertyConfigurable(target, key);
	    var descriptor = {};
	    var getter = baseDescriptor.get;
	    invariant(typeof target === "object", "The @observable decorator can only be used on objects", key);
	    invariant(typeof getter === "function", "@observable expects a getter function if used on a property.", key);
	    invariant(!baseDescriptor.set, "@observable properties cannot have a setter.", key);
	    invariant(getter.length === 0, "@observable getter functions should not take arguments.", key);
	    descriptor.configurable = true;
	    descriptor.enumerable = false;
	    descriptor.get = function () {
	        setObservableObjectProperty(asObservableObject(this, undefined, ValueMode.Recursive), key, options && options.asStructure === true ? asStructure(getter) : getter);
	        return this[key];
	    };
	    descriptor.set = throwingComputedValueSetter;
	    if (!baseDescriptor) {
	        Object.defineProperty(target, key, descriptor);
	    }
	    else {
	        return descriptor;
	    }
	}
	function throwingComputedValueSetter() {
	    throw new Error("[ComputedValue] It is not allowed to assign new values to computed properties.");
	}
	function createTransformer(transformer, onCleanup) {
	    invariant(typeof transformer === "function" && transformer.length === 1, "createTransformer expects a function that accepts one argument");
	    var objectCache = {};
	    var resetId = globalState.resetId;
	    var Transformer = (function (_super) {
	        __extends(Transformer, _super);
	        function Transformer(sourceIdentifier, sourceObject) {
	            _super.call(this, function () { return transformer(sourceObject); }, null, false, "Transformer-" + transformer.name + "-" + sourceIdentifier);
	            this.sourceIdentifier = sourceIdentifier;
	            this.sourceObject = sourceObject;
	        }
	        Transformer.prototype.onBecomeUnobserved = function () {
	            var lastValue = this.value;
	            _super.prototype.onBecomeUnobserved.call(this);
	            delete objectCache[this.sourceIdentifier];
	            if (onCleanup)
	                onCleanup(lastValue, this.sourceObject);
	        };
	        return Transformer;
	    })(ComputedValue);
	    return function (object) {
	        if (resetId !== globalState.resetId) {
	            objectCache = {};
	            resetId = globalState.resetId;
	        }
	        var identifier = getMemoizationId(object);
	        var reactiveTransformer = objectCache[identifier];
	        if (reactiveTransformer)
	            return reactiveTransformer.get();
	        reactiveTransformer = objectCache[identifier] = new Transformer(identifier, object);
	        return reactiveTransformer.get();
	    };
	}
	exports.createTransformer = createTransformer;
	function getMemoizationId(object) {
	    if (object === null || typeof object !== "object")
	        throw new Error("[mobx] transform expected some kind of object, got: " + object);
	    var tid = object.$transformId;
	    if (tid === undefined) {
	        tid = getNextId();
	        Object.defineProperty(object, '$transformId', {
	            configurable: true,
	            writable: true,
	            enumerable: false,
	            value: tid
	        });
	    }
	    return tid;
	}
	function expr(expr, scope) {
	    if (!isComputingDerivation())
	        console.warn("[mobx.expr] 'expr' should only be used inside other reactive functions.");
	    return computed(expr, scope).get();
	}
	exports.expr = expr;
	function extendObservable(target) {
	    var properties = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        properties[_i - 1] = arguments[_i];
	    }
	    invariant(arguments.length >= 2, "extendObservable expected 2 or more arguments");
	    invariant(typeof target === "object", "extendObservable expects an object as first argument");
	    invariant(!(target instanceof ObservableMap), "extendObservable should not be used on maps, use map.merge instead");
	    properties.forEach(function (propSet) {
	        invariant(typeof propSet === "object", "all arguments of extendObservable should be objects");
	        extendObservableHelper(target, propSet, ValueMode.Recursive, null);
	    });
	    return target;
	}
	exports.extendObservable = extendObservable;
	function extendObservableHelper(target, properties, mode, name) {
	    var adm = asObservableObject(target, name, mode);
	    for (var key in properties)
	        if (properties.hasOwnProperty(key)) {
	            if (target === properties && !isPropertyConfigurable(target, key))
	                continue;
	            setObservableObjectProperty(adm, key, properties[key]);
	        }
	    return target;
	}
	function allowStateChanges(allowStateChanges, func) {
	    var prev = globalState.allowStateChanges;
	    globalState.allowStateChanges = allowStateChanges;
	    var res = func();
	    globalState.allowStateChanges = prev;
	    return res;
	}
	var transitionTracker = null;
	function reportTransition(node, state, changed) {
	    if (changed === void 0) { changed = false; }
	    if (transitionTracker)
	        transitionTracker.emit({
	            id: node.id,
	            name: node.name + "@" + node.id,
	            node: node, state: state, changed: changed
	        });
	}
	function getDependencyTree(thing) {
	    return nodeToDependencyTree(thing);
	}
	function nodeToDependencyTree(node) {
	    var result = {
	        id: node.id,
	        name: node.name + "@" + node.id
	    };
	    if (node.observing && node.observing.length)
	        result.dependencies = unique(node.observing).map(nodeToDependencyTree);
	    return result;
	}
	function getObserverTree(thing) {
	    return nodeToObserverTree(thing);
	}
	function nodeToObserverTree(node) {
	    var result = {
	        id: node.id,
	        name: node.name + "@" + node.id
	    };
	    if (node.observers && node.observers.length)
	        result.observers = unique(node.observers).map(nodeToObserverTree);
	    return result;
	}
	function createConsoleReporter(extensive) {
	    var lines = [];
	    var scheduled = false;
	    return function (line) {
	        if (extensive || line.changed)
	            lines.push(line);
	        if (!scheduled) {
	            scheduled = true;
	            setTimeout(function () {
	                console[console["table"] ? "table" : "dir"](lines);
	                lines = [];
	                scheduled = false;
	            }, 1);
	        }
	    };
	}
	function trackTransitions(extensive, onReport) {
	    if (extensive === void 0) { extensive = false; }
	    if (!transitionTracker)
	        transitionTracker = new SimpleEventEmitter();
	    var reporter = onReport
	        ? function (line) {
	            if (extensive || line.changed)
	                onReport(line);
	        }
	        : createConsoleReporter(extensive);
	    var disposer = transitionTracker.on(reporter);
	    return once(function () {
	        disposer();
	        if (transitionTracker.listeners.length === 0)
	            transitionTracker = null;
	    });
	}
	function isObservable(value, property) {
	    if (value === null || value === undefined)
	        return false;
	    if (property !== undefined) {
	        if (value instanceof ObservableMap || value instanceof ObservableArray)
	            throw new Error("[mobx.isObservable] isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.");
	        else if (isObservableObject(value)) {
	            var o = value.$mobx;
	            return o.values && !!o.values[property];
	        }
	        return false;
	    }
	    return !!value.$mobx || value instanceof Atom || value instanceof Reaction || value instanceof ComputedValue;
	}
	exports.isObservable = isObservable;
	function observableDecorator(target, key, baseDescriptor) {
	    invariant(arguments.length >= 2 && arguments.length <= 3, "Illegal decorator config", key);
	    assertPropertyConfigurable(target, key);
	    if (baseDescriptor && baseDescriptor.hasOwnProperty("get")) {
	        deprecated("Using @observable on computed values is deprecated. Use @computed instead.");
	        return computed.apply(null, arguments);
	    }
	    var descriptor = {};
	    invariant(typeof target === "object", "The @observable decorator can only be used on objects", key);
	    descriptor.configurable = true;
	    descriptor.enumerable = true;
	    descriptor.get = function () {
	        var _this = this;
	        var baseValue = undefined;
	        if (baseDescriptor) {
	            if (baseDescriptor.hasOwnProperty("value"))
	                baseValue = baseDescriptor.value;
	            else if (baseDescriptor.initializer) {
	                baseValue = baseDescriptor.initializer();
	                if (typeof baseValue === "function")
	                    baseValue = asReference(baseValue);
	            }
	        }
	        allowStateChanges(true, function () {
	            setObservableObjectProperty(asObservableObject(_this, undefined, ValueMode.Recursive), key, baseValue);
	        });
	        return this[key];
	    };
	    descriptor.set = function (value) {
	        setObservableObjectProperty(asObservableObject(this, undefined, ValueMode.Recursive), key, typeof value === "function" ? asReference(value) : value);
	    };
	    if (!baseDescriptor) {
	        Object.defineProperty(target, key, descriptor);
	    }
	    else {
	        return descriptor;
	    }
	}
	function observable(v, keyOrScope) {
	    if (typeof arguments[1] === "string")
	        return observableDecorator.apply(null, arguments);
	    invariant(arguments.length === 1 || arguments.length === 2, "observable expects one or two arguments");
	    if (isObservable(v))
	        return v;
	    var _a = getValueModeFromValue(v, ValueMode.Recursive), mode = _a[0], value = _a[1];
	    var sourceType = mode === ValueMode.Reference ? ValueType.Reference : getTypeOfValue(value);
	    switch (sourceType) {
	        case ValueType.Array:
	        case ValueType.PlainObject:
	            return makeChildObservable(value, mode);
	        case ValueType.Reference:
	        case ValueType.ComplexObject:
	            return new ObservableValue(value, mode);
	        case ValueType.ComplexFunction:
	            throw new Error("[mobx.observable] To be able to make a function reactive it should not have arguments. If you need an observable reference to a function, use `observable(asReference(f))`");
	        case ValueType.ViewFunction:
	            deprecated("Use `computed(expr)` instead of `observable(expr)`");
	            return computed(v, keyOrScope);
	    }
	    invariant(false, "Illegal State");
	}
	exports.observable = observable;
	var ValueType;
	(function (ValueType) {
	    ValueType[ValueType["Reference"] = 0] = "Reference";
	    ValueType[ValueType["PlainObject"] = 1] = "PlainObject";
	    ValueType[ValueType["ComplexObject"] = 2] = "ComplexObject";
	    ValueType[ValueType["Array"] = 3] = "Array";
	    ValueType[ValueType["ViewFunction"] = 4] = "ViewFunction";
	    ValueType[ValueType["ComplexFunction"] = 5] = "ComplexFunction";
	})(ValueType || (ValueType = {}));
	function getTypeOfValue(value) {
	    if (value === null || value === undefined)
	        return ValueType.Reference;
	    if (typeof value === "function")
	        return value.length ? ValueType.ComplexFunction : ValueType.ViewFunction;
	    if (Array.isArray(value) || value instanceof ObservableArray)
	        return ValueType.Array;
	    if (typeof value === "object")
	        return isPlainObject(value) ? ValueType.PlainObject : ValueType.ComplexObject;
	    return ValueType.Reference;
	}
	function observe(thing, propOrCb, cbOrFire, fireImmediately) {
	    if (typeof cbOrFire === "function")
	        return observeObservableProperty(thing, propOrCb, cbOrFire, fireImmediately);
	    else
	        return observeObservable(thing, propOrCb, cbOrFire);
	}
	exports.observe = observe;
	function observeObservable(thing, listener, fireImmediately) {
	    if (isObservableArray(thing))
	        return thing.observe(listener);
	    if (isObservableMap(thing))
	        return thing.observe(listener);
	    if (isObservableObject(thing))
	        return observeObservableObject(thing, listener, fireImmediately);
	    if (thing instanceof ObservableValue || thing instanceof ComputedValue)
	        return thing.observe(listener, fireImmediately);
	    if (isPlainObject(thing))
	        return observeObservable(observable(thing), listener, fireImmediately);
	    invariant(false, "first argument of observe should be some observable value or plain object");
	}
	function observeObservableProperty(thing, property, listener, fireImmediately) {
	    var propError = "[mobx.observe] the provided observable map has no key with name: " + property;
	    if (isObservableMap(thing)) {
	        if (!thing._has(property))
	            throw new Error(propError);
	        return observe(thing._data[property], listener);
	    }
	    if (isObservableObject(thing)) {
	        if (!isObservable(thing, property))
	            throw new Error(propError);
	        return observe(thing.$mobx.values[property], listener, fireImmediately);
	    }
	    if (isPlainObject(thing)) {
	        extendObservable(thing, {
	            property: thing[property]
	        });
	        return observeObservableProperty(thing, property, listener, fireImmediately);
	    }
	    invariant(false, "first argument of observe should be an (observable)object or observableMap if a property name is given");
	}
	function toJSON(source, detectCycles, __alreadySeen) {
	    if (detectCycles === void 0) { detectCycles = true; }
	    if (__alreadySeen === void 0) { __alreadySeen = null; }
	    function cache(value) {
	        if (detectCycles)
	            __alreadySeen.push([source, value]);
	        return value;
	    }
	    if (detectCycles && __alreadySeen === null)
	        __alreadySeen = [];
	    if (detectCycles && source !== null && typeof source === "object") {
	        for (var i = 0, l = __alreadySeen.length; i < l; i++)
	            if (__alreadySeen[i][0] === source)
	                return __alreadySeen[i][1];
	    }
	    if (!source)
	        return source;
	    if (Array.isArray(source) || source instanceof ObservableArray) {
	        var res = cache([]);
	        res.push.apply(res, source.map(function (value) { return toJSON(value, detectCycles, __alreadySeen); }));
	        return res;
	    }
	    if (source instanceof ObservableMap) {
	        var res = cache({});
	        source.forEach(function (value, key) { return res[key] = toJSON(value, detectCycles, __alreadySeen); });
	        return res;
	    }
	    if (typeof source === "object" && isPlainObject(source)) {
	        var res = cache({});
	        for (var key in source)
	            if (source.hasOwnProperty(key))
	                res[key] = toJSON(source[key], detectCycles, __alreadySeen);
	        return res;
	    }
	    if (isObservable(source) && source.$mobx instanceof ObservableValue)
	        return toJSON(source(), detectCycles, __alreadySeen);
	    return source;
	}
	exports.toJSON = toJSON;
	function propagateAtomReady(atom) {
	    invariant(atom.isDirty, "atom not dirty");
	    atom.isDirty = false;
	    reportTransition(atom, "READY", true);
	    propagateReadiness(atom, true);
	}
	var Atom = (function () {
	    function Atom(name, onBecomeObserved, onBecomeUnobserved) {
	        if (name === void 0) { name = "Atom"; }
	        if (onBecomeObserved === void 0) { onBecomeObserved = noop; }
	        if (onBecomeUnobserved === void 0) { onBecomeUnobserved = noop; }
	        this.name = name;
	        this.onBecomeObserved = onBecomeObserved;
	        this.onBecomeUnobserved = onBecomeUnobserved;
	        this.id = getNextId();
	        this.isDirty = false;
	        this.staleObservers = [];
	        this.observers = [];
	    }
	    Atom.prototype.reportObserved = function () {
	        reportObserved(this);
	    };
	    Atom.prototype.reportChanged = function () {
	        if (!this.isDirty) {
	            this.reportStale();
	            this.reportReady();
	        }
	    };
	    Atom.prototype.reportStale = function () {
	        if (!this.isDirty) {
	            this.isDirty = true;
	            reportTransition(this, "STALE");
	            propagateStaleness(this);
	        }
	    };
	    Atom.prototype.reportReady = function () {
	        invariant(this.isDirty, "atom not dirty");
	        if (globalState.inTransaction > 0)
	            globalState.changedAtoms.push(this);
	        else {
	            propagateAtomReady(this);
	            runReactions();
	        }
	    };
	    Atom.prototype.toString = function () {
	        return this.name + "@" + this.id;
	    };
	    return Atom;
	})();
	exports.Atom = Atom;
	var ComputedValue = (function () {
	    function ComputedValue(derivation, scope, compareStructural, name) {
	        var _this = this;
	        if (name === void 0) { name = "ComputedValue"; }
	        this.derivation = derivation;
	        this.scope = scope;
	        this.compareStructural = compareStructural;
	        this.name = name;
	        this.id = getNextId();
	        this.isLazy = true;
	        this.isComputing = false;
	        this.staleObservers = [];
	        this.observers = [];
	        this.observing = [];
	        this.dependencyChangeCount = 0;
	        this.dependencyStaleCount = 0;
	        this.value = undefined;
	        this.peek = function () {
	            _this.isComputing = true;
	            globalState.isComputingComputedValue++;
	            var prevAllowStateChanges = globalState.allowStateChanges;
	            globalState.allowStateChanges = false;
	            var res = derivation.call(scope);
	            globalState.allowStateChanges = prevAllowStateChanges;
	            globalState.isComputingComputedValue--;
	            _this.isComputing = false;
	            return res;
	        };
	    }
	    ComputedValue.prototype.onBecomeObserved = function () {
	    };
	    ComputedValue.prototype.onBecomeUnobserved = function () {
	        for (var i = 0, l = this.observing.length; i < l; i++)
	            removeObserver(this.observing[i], this);
	        this.observing = [];
	        this.isLazy = true;
	        this.value = undefined;
	    };
	    ComputedValue.prototype.onDependenciesReady = function () {
	        var changed = this.trackAndCompute();
	        reportTransition(this, "READY", changed);
	        return changed;
	    };
	    ComputedValue.prototype.get = function () {
	        invariant(!this.isComputing, "Cycle detected", this.derivation);
	        reportObserved(this);
	        if (this.dependencyStaleCount > 0) {
	            return this.peek();
	        }
	        if (this.isLazy) {
	            if (isComputingDerivation()) {
	                this.isLazy = false;
	                this.trackAndCompute();
	            }
	            else {
	                return this.peek();
	            }
	        }
	        return this.value;
	    };
	    ComputedValue.prototype.set = function (_) {
	        throw new Error("[ComputedValue '" + name + "'] It is not possible to assign a new value to a computed value.");
	    };
	    ComputedValue.prototype.trackAndCompute = function () {
	        var oldValue = this.value;
	        this.value = trackDerivedFunction(this, this.peek);
	        return valueDidChange(this.compareStructural, this.value, oldValue);
	    };
	    ComputedValue.prototype.observe = function (listener, fireImmediately) {
	        var _this = this;
	        var firstTime = true;
	        var prevValue = undefined;
	        return autorun(function () {
	            var newValue = _this.get();
	            if (!firstTime || fireImmediately) {
	                listener(newValue, prevValue);
	            }
	            firstTime = false;
	            prevValue = newValue;
	        });
	    };
	    ComputedValue.prototype.toString = function () {
	        return this.name + "@" + this.id + "[" + this.derivation.toString() + "]";
	    };
	    return ComputedValue;
	})();
	function isComputingDerivation() {
	    return globalState.derivationStack.length > 0;
	}
	function checkIfStateModificationsAreAllowed() {
	    invariant(globalState.allowStateChanges, "It is not allowed to change the state when a computed value is being evaluated. Use 'autorun' to create reactive functions with side-effects. Or use 'extras.allowStateChanges(true, block)' to supress this message.");
	}
	function notifyDependencyStale(derivation) {
	    if (++derivation.dependencyStaleCount === 1) {
	        reportTransition(derivation, "STALE");
	        propagateStaleness(derivation);
	    }
	}
	function notifyDependencyReady(derivation, dependencyDidChange) {
	    invariant(derivation.dependencyStaleCount > 0, "unexpected ready notification");
	    if (dependencyDidChange)
	        derivation.dependencyChangeCount += 1;
	    if (--derivation.dependencyStaleCount === 0) {
	        if (derivation.dependencyChangeCount > 0) {
	            derivation.dependencyChangeCount = 0;
	            reportTransition(derivation, "PENDING");
	            var changed = derivation.onDependenciesReady();
	            propagateReadiness(derivation, changed);
	        }
	        else {
	            reportTransition(derivation, "READY", false);
	            propagateReadiness(derivation, false);
	        }
	    }
	}
	function trackDerivedFunction(derivation, f) {
	    var hasException = true;
	    var prevObserving = derivation.observing;
	    derivation.observing = [];
	    globalState.derivationStack.push(derivation);
	    try {
	        var result = f();
	        hasException = false;
	        bindDependencies(derivation, prevObserving);
	        return result;
	    }
	    finally {
	        if (hasException) {
	            console.error("[mobx] An uncaught exception occurred while calculating your computed value, autorun or transformer. Or inside the render method of a React component. " +
	                "These methods should never throw exceptions as MobX will usually not be able to recover from them. " +
	                ("Please enable 'Pause on (caught) exceptions' in your debugger to find the root cause. In: '" + derivation.name + "#" + derivation.id + "'"));
	            resetGlobalState();
	        }
	    }
	}
	function bindDependencies(derivation, prevObserving) {
	    globalState.derivationStack.length -= 1;
	    var _a = quickDiff(derivation.observing, prevObserving), added = _a[0], removed = _a[1];
	    for (var i = 0, l = added.length; i < l; i++) {
	        var dependency = added[i];
	        invariant(!findCycle(derivation, dependency), "Cycle detected", derivation);
	        addObserver(added[i], derivation);
	    }
	    for (var i = 0, l = removed.length; i < l; i++)
	        removeObserver(removed[i], derivation);
	}
	function findCycle(needle, node) {
	    var obs = node.observing;
	    if (obs === undefined)
	        return false;
	    if (obs.indexOf(node) !== -1)
	        return true;
	    for (var l = obs.length, i = 0; i < l; i++)
	        if (findCycle(needle, obs[i]))
	            return true;
	    return false;
	}
	var MobXGlobals = (function () {
	    function MobXGlobals() {
	        this.version = 1;
	        this.derivationStack = [];
	        this.mobxGuid = 0;
	        this.inTransaction = 0;
	        this.inUntracked = 0;
	        this.isRunningReactions = false;
	        this.changedAtoms = [];
	        this.pendingReactions = [];
	        this.allowStateChanges = true;
	        this.resetId = 0;
	    }
	    return MobXGlobals;
	})();
	var globalState = (function () {
	    var res = new MobXGlobals();
	    if (global.__mobservableTrackingStack || global.__mobservableViewStack)
	        throw new Error("[mobx] An incompatible version of mobservable is already loaded.");
	    if (global.__mobxGlobal && global.__mobxGlobal.version !== res.version)
	        throw new Error("[mobx] An incompatible version of mobx is already loaded.");
	    if (global.__mobxGlobal)
	        return global.__mobxGlobal;
	    return global.__mobxGlobal = res;
	})();
	function getNextId() {
	    return ++globalState.mobxGuid;
	}
	function registerGlobals() {
	}
	function resetGlobalState() {
	    globalState.resetId++;
	    var defaultGlobals = new MobXGlobals();
	    for (var key in defaultGlobals)
	        if (key !== "mobxGuid" && key !== "resetId")
	            globalState[key] = defaultGlobals[key];
	}
	function addObserver(observable, node) {
	    var obs = observable.observers, l = obs.length;
	    obs[l] = node;
	    if (l === 0)
	        observable.onBecomeObserved();
	}
	function removeObserver(observable, node) {
	    var obs = observable.observers, idx = obs.indexOf(node);
	    if (idx !== -1)
	        obs.splice(idx, 1);
	    if (obs.length === 0)
	        observable.onBecomeUnobserved();
	}
	function reportObserved(observable) {
	    if (globalState.inUntracked > 0)
	        return;
	    var derivationStack = globalState.derivationStack;
	    var l = derivationStack.length;
	    if (l > 0) {
	        var deps = derivationStack[l - 1].observing, depslength = deps.length;
	        if (deps[depslength - 1] !== observable && deps[depslength - 2] !== observable)
	            deps[depslength] = observable;
	    }
	}
	function propagateStaleness(observable) {
	    var os = observable.observers.slice();
	    os.forEach(notifyDependencyStale);
	    observable.staleObservers = observable.staleObservers.concat(os);
	}
	function propagateReadiness(observable, valueDidActuallyChange) {
	    observable.staleObservers.splice(0).forEach(function (o) { return notifyDependencyReady(o, valueDidActuallyChange); });
	}
	function untracked(action) {
	    deprecated("This feature is experimental and might be removed in a future minor release. Please report if you use this feature in production: https://github.com/mobxjs/mobx/issues/49");
	    globalState.inUntracked++;
	    var res = action();
	    globalState.inUntracked--;
	    return res;
	}
	exports.untracked = untracked;
	var Reaction = (function () {
	    function Reaction(name, onInvalidate) {
	        if (name === void 0) { name = "Reaction"; }
	        this.name = name;
	        this.onInvalidate = onInvalidate;
	        this.id = getNextId();
	        this.staleObservers = EMPTY_ARRAY;
	        this.observers = EMPTY_ARRAY;
	        this.observing = [];
	        this.dependencyChangeCount = 0;
	        this.dependencyStaleCount = 0;
	        this.isDisposed = false;
	        this._isScheduled = false;
	    }
	    Reaction.prototype.onBecomeObserved = function () {
	    };
	    Reaction.prototype.onBecomeUnobserved = function () {
	    };
	    Reaction.prototype.onDependenciesReady = function () {
	        this.schedule();
	        return false;
	    };
	    Reaction.prototype.schedule = function () {
	        if (!this._isScheduled) {
	            this._isScheduled = true;
	            globalState.pendingReactions.push(this);
	            runReactions();
	        }
	    };
	    Reaction.prototype.isScheduled = function () {
	        return this.dependencyStaleCount > 0 || this._isScheduled;
	    };
	    Reaction.prototype.runReaction = function () {
	        if (!this.isDisposed) {
	            this._isScheduled = false;
	            this.onInvalidate();
	            reportTransition(this, "READY", true);
	        }
	    };
	    Reaction.prototype.track = function (fn) {
	        trackDerivedFunction(this, fn);
	    };
	    Reaction.prototype.dispose = function () {
	        if (!this.isDisposed) {
	            this.isDisposed = true;
	            var deps = this.observing.splice(0);
	            for (var i = 0, l = deps.length; i < l; i++)
	                removeObserver(deps[i], this);
	        }
	    };
	    Reaction.prototype.getDisposer = function () {
	        var r = this.dispose.bind(this);
	        r.$mobx = this;
	        return r;
	    };
	    Reaction.prototype.toString = function () {
	        return "Reaction[" + this.name + "]";
	    };
	    return Reaction;
	})();
	exports.Reaction = Reaction;
	var MAX_REACTION_ITERATIONS = 100;
	function runReactions() {
	    if (globalState.isRunningReactions === true || globalState.inTransaction > 0)
	        return;
	    globalState.isRunningReactions = true;
	    var allReactions = globalState.pendingReactions;
	    var iterations = 0;
	    while (allReactions.length > 0) {
	        if (++iterations === MAX_REACTION_ITERATIONS)
	            throw new Error("Reaction doesn't converge to a stable state. Probably there is a cycle in the reactive function: " + allReactions[0].toString());
	        var remainingReactions = allReactions.splice(0);
	        for (var i = 0, l = remainingReactions.length; i < l; i++)
	            remainingReactions[i].runReaction();
	    }
	    globalState.isRunningReactions = false;
	}
	function transaction(action, thisArg) {
	    globalState.inTransaction += 1;
	    var res = action.call(thisArg);
	    if (--globalState.inTransaction === 0) {
	        var values = globalState.changedAtoms.splice(0);
	        for (var i = 0, l = values.length; i < l; i++)
	            propagateAtomReady(values[i]);
	        runReactions();
	    }
	    return res;
	}
	exports.transaction = transaction;
	var ValueMode;
	(function (ValueMode) {
	    ValueMode[ValueMode["Recursive"] = 0] = "Recursive";
	    ValueMode[ValueMode["Reference"] = 1] = "Reference";
	    ValueMode[ValueMode["Structure"] = 2] = "Structure";
	    ValueMode[ValueMode["Flat"] = 3] = "Flat";
	})(ValueMode || (ValueMode = {}));
	function asReference(value) {
	    return new AsReference(value);
	}
	exports.asReference = asReference;
	function asStructure(value) {
	    return new AsStructure(value);
	}
	exports.asStructure = asStructure;
	function asFlat(value) {
	    return new AsFlat(value);
	}
	exports.asFlat = asFlat;
	var AsReference = (function () {
	    function AsReference(value) {
	        this.value = value;
	        assertUnwrapped(value, "Modifiers are not allowed to be nested");
	    }
	    return AsReference;
	})();
	var AsStructure = (function () {
	    function AsStructure(value) {
	        this.value = value;
	        assertUnwrapped(value, "Modifiers are not allowed to be nested");
	    }
	    return AsStructure;
	})();
	var AsFlat = (function () {
	    function AsFlat(value) {
	        this.value = value;
	        assertUnwrapped(value, "Modifiers are not allowed to be nested");
	    }
	    return AsFlat;
	})();
	function getValueModeFromValue(value, defaultMode) {
	    if (value instanceof AsReference)
	        return [ValueMode.Reference, value.value];
	    if (value instanceof AsStructure)
	        return [ValueMode.Structure, value.value];
	    if (value instanceof AsFlat)
	        return [ValueMode.Flat, value.value];
	    return [defaultMode, value];
	}
	function getValueModeFromModifierFunc(func) {
	    if (func === asReference)
	        return ValueMode.Reference;
	    else if (func === asStructure)
	        return ValueMode.Structure;
	    else if (func === asFlat)
	        return ValueMode.Flat;
	    invariant(func === undefined, "Cannot determine value mode from function. Please pass in one of these: mobx.asReference, mobx.asStructure or mobx.asFlat, got: " + func);
	    return ValueMode.Recursive;
	}
	function makeChildObservable(value, parentMode, name) {
	    var childMode;
	    if (isObservable(value))
	        return value;
	    switch (parentMode) {
	        case ValueMode.Reference:
	            return value;
	        case ValueMode.Flat:
	            assertUnwrapped(value, "Items inside 'asFlat' cannot have modifiers");
	            childMode = ValueMode.Reference;
	            break;
	        case ValueMode.Structure:
	            assertUnwrapped(value, "Items inside 'asStructure' cannot have modifiers");
	            childMode = ValueMode.Structure;
	            break;
	        case ValueMode.Recursive:
	            _a = getValueModeFromValue(value, ValueMode.Recursive), childMode = _a[0], value = _a[1];
	            break;
	        default:
	            invariant(false, "Illegal State");
	    }
	    if (Array.isArray(value) && Object.isExtensible(value))
	        return createObservableArray(value, childMode, name);
	    if (isPlainObject(value) && Object.isExtensible(value))
	        return extendObservableHelper(value, value, childMode, name);
	    return value;
	    var _a;
	}
	function assertUnwrapped(value, message) {
	    if (value instanceof AsReference || value instanceof AsStructure || value instanceof AsFlat)
	        throw new Error("[mobx] asStructure / asReference / asFlat cannot be used here. " + message);
	}
	var OBSERVABLE_ARRAY_BUFFER_SIZE = 0;
	var StubArray = (function () {
	    function StubArray() {
	    }
	    return StubArray;
	})();
	StubArray.prototype = [];
	function getArrayLength(adm) {
	    adm.atom.reportObserved();
	    return adm.values.length;
	}
	function setArrayLength(adm, newLength) {
	    if (typeof newLength !== "number" || newLength < 0)
	        throw new Error("[mobx.array] Out of range: " + newLength);
	    var currentLength = adm.values.length;
	    if (newLength === currentLength)
	        return;
	    else if (newLength > currentLength)
	        spliceWithArray(adm, currentLength, 0, new Array(newLength - currentLength));
	    else
	        spliceWithArray(adm, newLength, currentLength - newLength);
	}
	function updateArrayLength(adm, oldLength, delta) {
	    if (oldLength !== adm.lastKnownLength)
	        throw new Error("[mobx] Modification exception: the internal structure of an observable array was changed. Did you use peek() to change it?");
	    checkIfStateModificationsAreAllowed();
	    adm.lastKnownLength += delta;
	    if (delta > 0 && oldLength + delta > OBSERVABLE_ARRAY_BUFFER_SIZE)
	        reserveArrayBuffer(oldLength + delta);
	}
	function spliceWithArray(adm, index, deleteCount, newItems) {
	    var length = adm.values.length;
	    if ((newItems === undefined || newItems.length === 0) && (deleteCount === 0 || length === 0))
	        return [];
	    if (index === undefined)
	        index = 0;
	    else if (index > length)
	        index = length;
	    else if (index < 0)
	        index = Math.max(0, length + index);
	    if (arguments.length === 2)
	        deleteCount = length - index;
	    else if (deleteCount === undefined || deleteCount === null)
	        deleteCount = 0;
	    else
	        deleteCount = Math.max(0, Math.min(deleteCount, length - index));
	    if (newItems === undefined)
	        newItems = EMPTY_ARRAY;
	    else
	        newItems = newItems.map(adm.makeChildReactive);
	    var lengthDelta = newItems.length - deleteCount;
	    updateArrayLength(adm, length, lengthDelta);
	    var res = (_a = adm.values).splice.apply(_a, [index, deleteCount].concat(newItems));
	    notifyArraySplice(adm, index, res, newItems);
	    return res;
	    var _a;
	}
	function makeReactiveArrayItem(value) {
	    assertUnwrapped(value, "Array values cannot have modifiers");
	    if (this.mode === ValueMode.Flat || this.mode === ValueMode.Reference)
	        return value;
	    return makeChildObservable(value, this.mode, this.atom.name + "@" + this.atom.id + " / ArrayEntry");
	}
	function notifyArrayChildUpdate(adm, index, oldValue) {
	    adm.atom.reportChanged();
	    if (adm.changeEvent)
	        adm.changeEvent.emit({ object: adm.array, type: "update", index: index, oldValue: oldValue });
	}
	function notifyArraySplice(adm, index, deleted, added) {
	    if (deleted.length === 0 && added.length === 0)
	        return;
	    adm.atom.reportChanged();
	    if (adm.changeEvent)
	        adm.changeEvent.emit({ object: adm.array, type: "splice", index: index, addedCount: added.length, removed: deleted });
	}
	var ObservableArray = (function (_super) {
	    __extends(ObservableArray, _super);
	    function ObservableArray(initialValues, mode, name) {
	        _super.call(this);
	        var adm = this.$mobx = {
	            atom: new Atom(name || "ObservableArray"),
	            values: undefined,
	            changeEvent: undefined,
	            lastKnownLength: 0,
	            mode: mode,
	            array: this,
	            makeChildReactive: function (v) { return makeReactiveArrayItem.call(adm, v); }
	        };
	        Object.defineProperty(this, "$mobx", {
	            enumerable: false,
	            configurable: false,
	            writable: false
	        });
	        if (initialValues && initialValues.length) {
	            updateArrayLength(adm, 0, initialValues.length);
	            adm.values = initialValues.map(adm.makeChildReactive);
	        }
	        else
	            adm.values = [];
	    }
	    ObservableArray.prototype.observe = function (listener, fireImmediately) {
	        if (fireImmediately === void 0) { fireImmediately = false; }
	        if (this.$mobx.changeEvent === undefined)
	            this.$mobx.changeEvent = new SimpleEventEmitter();
	        if (fireImmediately)
	            listener({ object: this, type: "splice", index: 0, addedCount: this.$mobx.values.length, removed: [] });
	        return this.$mobx.changeEvent.on(listener);
	    };
	    ObservableArray.prototype.clear = function () {
	        return this.splice(0);
	    };
	    ObservableArray.prototype.replace = function (newItems) {
	        return spliceWithArray(this.$mobx, 0, this.$mobx.values.length, newItems);
	    };
	    ObservableArray.prototype.toJSON = function () {
	        this.$mobx.atom.reportObserved();
	        return this.$mobx.values.slice();
	    };
	    ObservableArray.prototype.peek = function () {
	        return this.$mobx.values;
	    };
	    ObservableArray.prototype.find = function (predicate, thisArg, fromIndex) {
	        if (fromIndex === void 0) { fromIndex = 0; }
	        this.$mobx.atom.reportObserved();
	        var items = this.$mobx.values, l = items.length;
	        for (var i = fromIndex; i < l; i++)
	            if (predicate.call(thisArg, items[i], i, this))
	                return items[i];
	        return null;
	    };
	    ObservableArray.prototype.splice = function (index, deleteCount) {
	        var newItems = [];
	        for (var _i = 2; _i < arguments.length; _i++) {
	            newItems[_i - 2] = arguments[_i];
	        }
	        switch (arguments.length) {
	            case 0:
	                return [];
	            case 1:
	                return spliceWithArray(this.$mobx, index);
	            case 2:
	                return spliceWithArray(this.$mobx, index, deleteCount);
	        }
	        return spliceWithArray(this.$mobx, index, deleteCount, newItems);
	    };
	    ObservableArray.prototype.push = function () {
	        var items = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            items[_i - 0] = arguments[_i];
	        }
	        spliceWithArray(this.$mobx, this.$mobx.values.length, 0, items);
	        return this.$mobx.values.length;
	    };
	    ObservableArray.prototype.pop = function () {
	        return this.splice(Math.max(this.$mobx.values.length - 1, 0), 1)[0];
	    };
	    ObservableArray.prototype.shift = function () {
	        return this.splice(0, 1)[0];
	    };
	    ObservableArray.prototype.unshift = function () {
	        var items = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            items[_i - 0] = arguments[_i];
	        }
	        spliceWithArray(this.$mobx, 0, 0, items);
	        return this.$mobx.values.length;
	    };
	    ObservableArray.prototype.reverse = function () {
	        this.$mobx.atom.reportObserved();
	        var clone = this.slice();
	        return clone.reverse.apply(clone, arguments);
	    };
	    ObservableArray.prototype.sort = function (compareFn) {
	        this.$mobx.atom.reportObserved();
	        var clone = this.slice();
	        return clone.sort.apply(clone, arguments);
	    };
	    ObservableArray.prototype.remove = function (value) {
	        var idx = this.$mobx.values.indexOf(value);
	        if (idx > -1) {
	            this.splice(idx, 1);
	            return true;
	        }
	        return false;
	    };
	    ObservableArray.prototype.toString = function () {
	        return "[mobx.array] " + Array.prototype.toString.apply(this.$mobx.values, arguments);
	    };
	    ObservableArray.prototype.toLocaleString = function () {
	        return "[mobx.array] " + Array.prototype.toLocaleString.apply(this.$mobx.values, arguments);
	    };
	    return ObservableArray;
	})(StubArray);
	makeNonEnumerable(ObservableArray.prototype, [
	    "constructor",
	    "observe",
	    "clear",
	    "replace",
	    "toJSON",
	    "peek",
	    "find",
	    "splice",
	    "push",
	    "pop",
	    "shift",
	    "unshift",
	    "reverse",
	    "sort",
	    "toString",
	    "toLocaleString",
	    "remove",
	]);
	Object.defineProperty(ObservableArray.prototype, "length", {
	    enumerable: false,
	    configurable: true,
	    get: function () {
	        return getArrayLength(this.$mobx);
	    },
	    set: function (newLength) {
	        setArrayLength(this.$mobx, newLength);
	    }
	});
	[
	    "concat",
	    "every",
	    "filter",
	    "forEach",
	    "indexOf",
	    "join",
	    "lastIndexOf",
	    "map",
	    "reduce",
	    "reduceRight",
	    "slice",
	    "some"
	].forEach(function (funcName) {
	    var baseFunc = Array.prototype[funcName];
	    Object.defineProperty(ObservableArray.prototype, funcName, {
	        configurable: false,
	        writable: true,
	        enumerable: false,
	        value: function () {
	            this.$mobx.atom.reportObserved();
	            return baseFunc.apply(this.$mobx.values, arguments);
	        }
	    });
	});
	function createArrayBufferItem(index) {
	    Object.defineProperty(ObservableArray.prototype, "" + index, {
	        enumerable: false,
	        configurable: false,
	        set: function (value) {
	            var impl = this.$mobx;
	            var values = impl.values;
	            assertUnwrapped(value, "Modifiers cannot be used on array values. For non-reactive array values use makeReactive(asFlat(array)).");
	            if (index < values.length) {
	                checkIfStateModificationsAreAllowed();
	                var oldValue = values[index];
	                var changed = impl.mode === ValueMode.Structure ? !deepEquals(oldValue, value) : oldValue !== value;
	                if (changed) {
	                    values[index] = impl.makeChildReactive(value);
	                    notifyArrayChildUpdate(impl, index, oldValue);
	                }
	            }
	            else if (index === values.length)
	                spliceWithArray(impl, index, 0, [value]);
	            else
	                throw new Error("[mobx.array] Index out of bounds, " + index + " is larger than " + values.length);
	        },
	        get: function () {
	            var impl = this.$mobx;
	            if (impl && index < impl.values.length) {
	                impl.atom.reportObserved();
	                return impl.values[index];
	            }
	            return undefined;
	        }
	    });
	}
	function reserveArrayBuffer(max) {
	    for (var index = OBSERVABLE_ARRAY_BUFFER_SIZE; index < max; index++)
	        createArrayBufferItem(index);
	    OBSERVABLE_ARRAY_BUFFER_SIZE = max;
	}
	reserveArrayBuffer(1000);
	function createObservableArray(initialValues, mode, name) {
	    return new ObservableArray(initialValues, mode, name);
	}
	function fastArray(initialValues) {
	    deprecated("fastArray is deprecated. Please use `observable(asFlat([]))`");
	    return createObservableArray(initialValues, ValueMode.Flat, null);
	}
	exports.fastArray = fastArray;
	function isObservableArray(thing) {
	    return thing instanceof ObservableArray;
	}
	exports.isObservableArray = isObservableArray;
	var ObservableMapMarker = {};
	var ObservableMap = (function () {
	    function ObservableMap(initialData, valueModeFunc) {
	        var _this = this;
	        this.$mobx = ObservableMapMarker;
	        this._data = {};
	        this._hasMap = {};
	        this._events = undefined;
	        this.name = "ObservableMap";
	        this.id = getNextId();
	        this._keys = new ObservableArray(null, ValueMode.Reference, this.name + "@" + this.id + " / keys()");
	        this._valueMode = getValueModeFromModifierFunc(valueModeFunc);
	        if (isPlainObject(initialData))
	            this.merge(initialData);
	        else if (Array.isArray(initialData))
	            initialData.forEach(function (_a) {
	                var key = _a[0], value = _a[1];
	                return _this.set(key, value);
	            });
	    }
	    ObservableMap.prototype._has = function (key) {
	        return typeof this._data[key] !== "undefined";
	    };
	    ObservableMap.prototype.has = function (key) {
	        if (!this.isValidKey(key))
	            return false;
	        if (this._hasMap[key])
	            return this._hasMap[key].get();
	        return this._updateHasMapEntry(key, false).get();
	    };
	    ObservableMap.prototype.set = function (key, value) {
	        var _this = this;
	        this.assertValidKey(key);
	        assertUnwrapped(value, "[mobx.map.set] Expected unwrapped value to be inserted to key '" + key + "'. If you need to use modifiers pass them as second argument to the constructor");
	        if (this._has(key)) {
	            var oldValue = this._data[key].value;
	            var changed = this._data[key].set(value);
	            if (changed && this._events) {
	                this._events.emit({
	                    type: "update",
	                    object: this,
	                    name: key,
	                    oldValue: oldValue
	                });
	            }
	        }
	        else {
	            transaction(function () {
	                _this._data[key] = new ObservableValue(value, _this._valueMode, _this.name + "@" + _this.id + " / Entry \"" + key + "\"");
	                _this._updateHasMapEntry(key, true);
	                _this._keys.push(key);
	            });
	            this._events && this._events.emit({
	                type: "add",
	                object: this,
	                name: key
	            });
	        }
	    };
	    ObservableMap.prototype.delete = function (key) {
	        var _this = this;
	        if (this._has(key)) {
	            var oldValue = this._data[key].value;
	            transaction(function () {
	                _this._keys.remove(key);
	                _this._updateHasMapEntry(key, false);
	                var observable = _this._data[key];
	                observable.set(undefined);
	                _this._data[key] = undefined;
	            });
	            this._events && this._events.emit({
	                type: "delete",
	                object: this,
	                name: key,
	                oldValue: oldValue
	            });
	        }
	    };
	    ObservableMap.prototype._updateHasMapEntry = function (key, value) {
	        var entry = this._hasMap[key];
	        if (entry) {
	            entry.set(value);
	        }
	        else {
	            entry = this._hasMap[key] = new ObservableValue(value, ValueMode.Reference, this.name + "@" + this.id + " / Contains \"" + key + "\"");
	        }
	        return entry;
	    };
	    ObservableMap.prototype.get = function (key) {
	        if (this.has(key))
	            return this._data[key].get();
	        return undefined;
	    };
	    ObservableMap.prototype.keys = function () {
	        return this._keys.slice();
	    };
	    ObservableMap.prototype.values = function () {
	        return this.keys().map(this.get, this);
	    };
	    ObservableMap.prototype.entries = function () {
	        var _this = this;
	        return this.keys().map(function (key) { return [key, _this.get(key)]; });
	    };
	    ObservableMap.prototype.forEach = function (callback, thisArg) {
	        var _this = this;
	        this.keys().forEach(function (key) { return callback.call(thisArg, _this.get(key), key); });
	    };
	    ObservableMap.prototype.merge = function (other) {
	        var _this = this;
	        transaction(function () {
	            if (other instanceof ObservableMap)
	                other.keys().forEach(function (key) { return _this.set(key, other.get(key)); });
	            else
	                Object.keys(other).forEach(function (key) { return _this.set(key, other[key]); });
	        });
	        return this;
	    };
	    ObservableMap.prototype.clear = function () {
	        var _this = this;
	        transaction(function () {
	            _this.keys().forEach(_this.delete, _this);
	        });
	    };
	    Object.defineProperty(ObservableMap.prototype, "size", {
	        get: function () {
	            return this._keys.length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ObservableMap.prototype.toJs = function () {
	        var _this = this;
	        var res = {};
	        this.keys().forEach(function (key) { return res[key] = _this.get(key); });
	        return res;
	    };
	    ObservableMap.prototype.isValidKey = function (key) {
	        if (key === null || key === undefined)
	            return false;
	        if (typeof key !== "string" && typeof key !== "number")
	            return false;
	        return true;
	    };
	    ObservableMap.prototype.assertValidKey = function (key) {
	        if (!this.isValidKey(key))
	            throw new Error("[mobx.map] Invalid key: '" + key + "'");
	    };
	    ObservableMap.prototype.toString = function () {
	        var _this = this;
	        return "[mobx.map { " + this.keys().map(function (key) { return (key + ": " + ("" + _this.get(key))); }).join(", ") + " }]";
	    };
	    ObservableMap.prototype.observe = function (callback) {
	        if (!this._events)
	            this._events = new SimpleEventEmitter();
	        return this._events.on(callback);
	    };
	    return ObservableMap;
	})();
	exports.ObservableMap = ObservableMap;
	function map(initialValues, valueModifier) {
	    return new ObservableMap(initialValues, valueModifier);
	}
	exports.map = map;
	function isObservableMap(thing) {
	    return thing instanceof ObservableMap;
	}
	exports.isObservableMap = isObservableMap;
	var ObservableObjectMarker = {};
	function asObservableObject(target, name, mode) {
	    if (mode === void 0) { mode = ValueMode.Recursive; }
	    if (target.$mobx) {
	        if (target.$mobx.type !== ObservableObjectMarker)
	            throw new Error("The given object is observable but not an observable object");
	        return target.$mobx;
	    }
	    if (!isPlainObject(target))
	        name = target.constructor.name;
	    if (!name)
	        name = "ObservableObject";
	    var adm = {
	        type: ObservableObjectMarker,
	        values: {},
	        events: undefined,
	        id: getNextId(),
	        target: target, name: name, mode: mode
	    };
	    Object.defineProperty(target, "$mobx", {
	        enumerable: false,
	        configurable: false,
	        writable: false,
	        value: adm
	    });
	    return adm;
	}
	function setObservableObjectProperty(adm, propName, value) {
	    if (adm.values[propName])
	        adm.target[propName] = value;
	    else
	        defineObservableProperty(adm, propName, value);
	}
	function defineObservableProperty(adm, propName, value) {
	    assertPropertyConfigurable(adm.target, propName);
	    var observable;
	    var name = adm.name + "@" + adm.id + " / Prop \"" + propName + "\"";
	    var isComputed = true;
	    if (typeof value === "function" && value.length === 0)
	        observable = new ComputedValue(value, adm.target, false, name);
	    else if (value instanceof AsStructure && typeof value.value === "function" && value.value.length === 0)
	        observable = new ComputedValue(value.value, adm.target, true, name);
	    else {
	        isComputed = false;
	        observable = new ObservableValue(value, adm.mode, name);
	    }
	    adm.values[propName] = observable;
	    Object.defineProperty(adm.target, propName, {
	        configurable: true,
	        enumerable: !isComputed,
	        get: function () {
	            return observable.get();
	        },
	        set: isComputed
	            ? throwingComputedValueSetter
	            : function (newValue) {
	                var oldValue = observable.value;
	                if (observable.set(newValue) && adm.events !== undefined) {
	                    adm.events.emit({
	                        type: "update",
	                        object: this,
	                        name: propName,
	                        oldValue: oldValue
	                    });
	                }
	            }
	    });
	    if (adm.events !== undefined) {
	        adm.events.emit({
	            type: "add",
	            object: adm.target,
	            name: propName
	        });
	    }
	    ;
	}
	function observeObservableObject(object, callback, fireImmediately) {
	    invariant(isObservableObject(object), "Expected observable object");
	    invariant(fireImmediately !== true, "`observe` doesn't support the fire immediately property for observable objects.");
	    var adm = object.$mobx;
	    if (adm.events === undefined)
	        adm.events = new SimpleEventEmitter();
	    return object.$mobx.events.on(callback);
	}
	function isObservableObject(thing) {
	    return thing && thing.$mobx && thing.$mobx.type === ObservableObjectMarker;
	}
	exports.isObservableObject = isObservableObject;
	var ObservableValue = (function (_super) {
	    __extends(ObservableValue, _super);
	    function ObservableValue(value, mode, name) {
	        if (name === void 0) { name = "ObservableValue"; }
	        _super.call(this, name);
	        this.mode = mode;
	        this.hasUnreportedChange = false;
	        this.events = null;
	        this.value = undefined;
	        var _a = getValueModeFromValue(value, ValueMode.Recursive), childmode = _a[0], unwrappedValue = _a[1];
	        if (this.mode === ValueMode.Recursive)
	            this.mode = childmode;
	        this.value = makeChildObservable(unwrappedValue, this.mode, this.name);
	    }
	    ObservableValue.prototype.set = function (newValue) {
	        assertUnwrapped(newValue, "Modifiers cannot be used on non-initial values.");
	        checkIfStateModificationsAreAllowed();
	        var oldValue = this.value;
	        var changed = valueDidChange(this.mode === ValueMode.Structure, oldValue, newValue);
	        if (changed) {
	            this.value = makeChildObservable(newValue, this.mode, this.name);
	            this.reportChanged();
	            if (this.events)
	                this.events.emit(newValue, oldValue);
	        }
	        return changed;
	    };
	    ObservableValue.prototype.get = function () {
	        this.reportObserved();
	        return this.value;
	    };
	    ObservableValue.prototype.observe = function (listener, fireImmediately) {
	        if (!this.events)
	            this.events = new SimpleEventEmitter();
	        if (fireImmediately)
	            listener(this.value, undefined);
	        return this.events.on(listener);
	    };
	    ObservableValue.prototype.toString = function () {
	        return this.name + "@" + this.id + "[" + this.value + "]";
	    };
	    return ObservableValue;
	})(Atom);
	var SimpleEventEmitter = (function () {
	    function SimpleEventEmitter() {
	        this.listeners = [];
	    }
	    SimpleEventEmitter.prototype.emit = function () {
	        var listeners = this.listeners.slice();
	        for (var i = 0, l = listeners.length; i < l; i++)
	            listeners[i].apply(null, arguments);
	    };
	    SimpleEventEmitter.prototype.on = function (listener) {
	        var _this = this;
	        this.listeners.push(listener);
	        return once(function () {
	            var idx = _this.listeners.indexOf(listener);
	            if (idx !== -1)
	                _this.listeners.splice(idx, 1);
	        });
	    };
	    SimpleEventEmitter.prototype.once = function (listener) {
	        var subscription = this.on(function () {
	            subscription();
	            listener.apply(this, arguments);
	        });
	        return subscription;
	    };
	    return SimpleEventEmitter;
	})();
	exports.SimpleEventEmitter = SimpleEventEmitter;
	var EMPTY_ARRAY = [];
	Object.freeze(EMPTY_ARRAY);
	function invariant(check, message, thing) {
	    if (!check)
	        throw new Error("[mobx] Invariant failed: " + message + (thing ? " in '" + thing + "'" : ""));
	}
	var deprecatedMessages = [];
	function deprecated(msg) {
	    if (deprecatedMessages.indexOf(msg) !== -1)
	        return;
	    deprecatedMessages.push(msg);
	    console.error("[mobx] Deprecated: " + msg);
	}
	function once(func) {
	    var invoked = false;
	    return function () {
	        if (invoked)
	            return;
	        invoked = true;
	        return func.apply(this, arguments);
	    };
	}
	var noop = function () { };
	function unique(list) {
	    var res = [];
	    list.forEach(function (item) {
	        if (res.indexOf(item) === -1)
	            res.push(item);
	    });
	    return res;
	}
	function isPlainObject(value) {
	    return value !== null && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype;
	}
	function valueDidChange(compareStructural, oldValue, newValue) {
	    return compareStructural
	        ? !deepEquals(oldValue, newValue)
	        : oldValue !== newValue;
	}
	function makeNonEnumerable(object, props) {
	    for (var i = 0; i < props.length; i++) {
	        Object.defineProperty(object, props[i], {
	            configurable: true,
	            writable: true,
	            enumerable: false,
	            value: object[props[i]]
	        });
	    }
	}
	function isPropertyConfigurable(object, prop) {
	    var descriptor = Object.getOwnPropertyDescriptor(object, prop);
	    return !descriptor || (descriptor.configurable !== false && descriptor.writable !== false);
	}
	function assertPropertyConfigurable(object, prop) {
	    invariant(isPropertyConfigurable(object, prop), "Cannot make property '" + prop + "' observable, it is not configurable and writable in the target object");
	}
	function deepEquals(a, b) {
	    if (a === null && b === null)
	        return true;
	    if (a === undefined && b === undefined)
	        return true;
	    var aIsArray = Array.isArray(a) || isObservableArray(a);
	    if (aIsArray !== (Array.isArray(b) || isObservableArray(b))) {
	        return false;
	    }
	    else if (aIsArray) {
	        if (a.length !== b.length)
	            return false;
	        for (var i = a.length; i >= 0; i--)
	            if (!deepEquals(a[i], b[i]))
	                return false;
	        return true;
	    }
	    else if (typeof a === "object" && typeof b === "object") {
	        if (a === null || b === null)
	            return false;
	        if (Object.keys(a).length !== Object.keys(b).length)
	            return false;
	        for (var prop in a) {
	            if (!b.hasOwnProperty(prop))
	                return false;
	            if (!deepEquals(a[prop], b[prop]))
	                return false;
	        }
	        return true;
	    }
	    return a === b;
	}
	function quickDiff(current, base) {
	    if (!base || !base.length)
	        return [current, []];
	    if (!current || !current.length)
	        return [[], base];
	    var added = [];
	    var removed = [];
	    var currentIndex = 0, currentSearch = 0, currentLength = current.length, currentExhausted = false, baseIndex = 0, baseSearch = 0, baseLength = base.length, isSearching = false, baseExhausted = false;
	    while (!baseExhausted && !currentExhausted) {
	        if (!isSearching) {
	            if (currentIndex < currentLength && baseIndex < baseLength && current[currentIndex] === base[baseIndex]) {
	                currentIndex++;
	                baseIndex++;
	                if (currentIndex === currentLength && baseIndex === baseLength)
	                    return [added, removed];
	                continue;
	            }
	            currentSearch = currentIndex;
	            baseSearch = baseIndex;
	            isSearching = true;
	        }
	        baseSearch += 1;
	        currentSearch += 1;
	        if (baseSearch >= baseLength)
	            baseExhausted = true;
	        if (currentSearch >= currentLength)
	            currentExhausted = true;
	        if (!currentExhausted && current[currentSearch] === base[baseIndex]) {
	            added.push.apply(added, current.slice(currentIndex, currentSearch));
	            currentIndex = currentSearch + 1;
	            baseIndex++;
	            isSearching = false;
	        }
	        else if (!baseExhausted && base[baseSearch] === current[currentIndex]) {
	            removed.push.apply(removed, base.slice(baseIndex, baseSearch));
	            baseIndex = baseSearch + 1;
	            currentIndex++;
	            isSearching = false;
	        }
	    }
	    added.push.apply(added, current.slice(currentIndex));
	    removed.push.apply(removed, base.slice(baseIndex));
	    return [added, removed];
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ]);