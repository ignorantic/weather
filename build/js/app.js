/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _app = __webpack_require__(1);

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {

    var app = new _app2.default();
    app.init();

    function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: { lat: 47, lng: 37.5 }
        });
        var marker = new google.maps.Marker({
            position: { lat: 47, lng: 37.5 },
            map: map,
            draggable: true
        });

        map.addListener('click', function (e) {
            marker.setPosition(e.latLng);
            app.store.dispatch(app.actions.location({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            }));
        });

        marker.addListener('dragend', function () {
            app.store.dispatch(app.actions.location({
                lat: marker.getPosition().lat(),
                lng: marker.getPosition().lng()
            }));
        });
    }
    window.initMap = initMap;
}); /**
     * index.js
     * Created by Andrii Sorokin on 08/20/17
     * https://github.com/ignorantic/weather.git
     */

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * app.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Andrii Sorokin on 08/20/17
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * https://github.com/ignorantic/weather.git
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * AIzaSyB0ActUGaLxSQdUaN6RdrNiCEvmMIoDa78
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _ajax = __webpack_require__(2);

var _ajax2 = _interopRequireDefault(_ajax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {

    /**
     * Construct the application object
     */
    function App() {
        _classCallCheck(this, App);

        // Create initial state
        this.initialState = {
            location: {},
            weather: {},
            status: 'ready'
        };

        // Create action generators
        this.actions = {
            wait: function wait() {
                return {
                    type: 'wait'
                };
            },
            error: function error() {
                return {
                    type: 'error'
                };
            },
            location: function location(data) {
                return {
                    type: 'location',
                    data: data
                };
            },
            weather: function weather(data) {
                return {
                    type: 'weather',
                    data: data
                };
            }
        };

        // Create store with initial state
        this.store = this.createStore(this.reducer, this.initialState);
    }

    /**
     * Initializing the application object
     */


    _createClass(App, [{
        key: 'init',
        value: function init() {
            var _this = this;

            this.store.subscribe(function () {
                var state = _this.store.getState();
                _this.filter(state);
            });

            // Initial request
            this.store.dispatch(this.actions.wait());
            this.getLocation(function (position) {
                _this.store.dispatch(_this.actions.location(position));
                _this.getWeather(position);
            });
        }

        /**
         * Register event handlers
         * @param {array} array
         */

    }, {
        key: 'on',
        value: function on(array) {
            var _this2 = this;

            array.forEach(function (item) {
                if (typeof item.event === 'string') {
                    _this2.addListener(item.event, item.selector, item.action);
                }
            });
        }

        /**
         * Add event listener
         * @param {string} event
         * @param {string} selector
         * @param {function} action
         */

    }, {
        key: 'addListener',
        value: function addListener(event, selector, action) {
            if (typeof selector === 'string') {
                var elements = document.querySelectorAll(selector);
                elements.forEach(function (element) {
                    return element.addEventListener(event, action, false);
                });
            }
        }

        /**
         * Create store of component
         * @param {function} reducer
         * @param {object} initialState
         * @returns {object} - Store
         */

    }, {
        key: 'createStore',
        value: function createStore(reducer, initialState) {
            var currentReducer = reducer;
            var currentState = initialState;
            var listener = function listener() {};
            return {
                getState: function getState() {
                    return currentState;
                },
                dispatch: function dispatch(action) {
                    currentState = currentReducer(currentState, action);
                    listener();
                    return action;
                },
                subscribe: function subscribe(newListener) {
                    listener = newListener;
                }
            };
        }

        /**
         * Return new state
         * @param {object} state - Current state
         * @param {object} action - Dispatched action
         * @returns {object} - New state
         */

    }, {
        key: 'reducer',
        value: function reducer(state, action) {
            switch (action.type) {
                case 'wait':
                    return Object.assign({}, state, {
                        status: 'waiting'
                    });
                case 'error':
                    return Object.assign({}, state, {
                        status: 'error'
                    });
                case 'location':
                    return Object.assign({}, state, {
                        location: action.data,
                        status: 'location'
                    });
                case 'weather':
                    return Object.assign({}, state, {
                        weather: action.data,
                        status: 'ready'
                    });
                default:
                    return state;
            }
        }
    }, {
        key: 'filter',
        value: function filter(state) {
            switch (state.status) {
                case 'location':
                    this.store.dispatch(this.actions.wait());
                    this.getWeather(state.location);
                    break;
                default:
                    this.render(state);
                    break;
            }
        }

        /**
         * Update view of component
         * @param state
         */

    }, {
        key: 'render',
        value: function render(state) {
            var weatherList = document.querySelector('.weather__list');
            var temp = document.querySelector('#temp');
            var pressure = document.querySelector('#pressure');
            var humidity = document.querySelector('#humidity');
            var lat = document.querySelector('#lat');
            var lng = document.querySelector('#lng');
            switch (state.status) {
                case 'waiting':
                    weatherList.classList.add('transparent');
                    break;
                case 'error':
                    break;
                case 'ready':
                    if (state.weather.main !== void 0) {
                        temp.innerText = 'Temperature: ' + state.weather.main.temp;
                        pressure.innerText = 'Pressure: ' + state.weather.main.pressure;
                        humidity.innerText = 'Humidity: ' + state.weather.main.humidity;
                    }
                    lat.innerText = 'Latitude: ' + state.location.lat;
                    lng.innerText = 'Longitude: ' + state.location.lng;
                    weatherList.classList.remove('transparent');
                    break;
                default:
                    break;

            }
        }
    }, {
        key: 'getLocation',
        value: function getLocation(cb) {
            navigator.geolocation.getCurrentPosition(function (position) {
                cb({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
        }
    }, {
        key: 'getWeather',
        value: function getWeather(location) {
            var _this3 = this;

            var url = 'https://fcc-weather-api.glitch.me/api/current?';
            _ajax2.default.get(url, {
                lat: location.lat,
                lon: location.lng
            }).then(function (data) {
                if (data.error) {
                    _this3.store.dispatch(_this3.actions.error());
                    return;
                }
                _this3.store.dispatch(_this3.actions.weather(data));
            });
        }
    }]);

    return App;
}();

exports.default = App;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * ajax.js
 * Created by Andrii Sorokin on 08/19/17
 * https://github.com/ignorantic/quotes.git
 */

var ajax = {};

function error(e) {
    return {
        error: e
    };
}

function json(response) {
    return response.json();
}

function status(response) {
    if (response.ok) {
        return response;
    }
    throw new Error(response.statusText);
}

ajax.get = function (url, parameters) {
    var paramString = '';
    for (var key in parameters) {
        if (Object.prototype.hasOwnProperty.call(parameters, key)) {
            if (paramString !== '') {
                paramString += '&';
            }
            paramString += key + '=' + parameters[key];
        }
    }
    return fetch(url + paramString).then(status).then(json).catch(error);
};

ajax.post = function (url, headers, body) {

    return fetch(url, {
        headers: headers,
        method: 'POST',
        mode: mode,
        body: JSON.stringify(body)
    }).then(status).then(json).catch(error);
};

exports.default = ajax;

/***/ })
/******/ ]);