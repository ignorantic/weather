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
  // Create and initialize application object
  var app = new _app2.default();
  app.init();

  // Initialize map, callback for Google Maps JavaScript API
  function initMap() {
    var map = void 0;
    var marker = void 0;

    // Initialize marker
    function initMarker(position) {
      marker = new window.google.maps.Marker({
        position: {
          lat: position.lat,
          lng: position.lng
        },
        map: map,
        draggable: true
      });

      map.setCenter(marker.getPosition());
      marker.addListener('dragend', function () {
        app.store.dispatch(app.actions.location({
          lat: marker.getPosition().lat(),
          lng: marker.getPosition().lng()
        }));
      });

      app.store.dispatch(app.actions.location(position));
      app.getWeather(position);
    }

    map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: {
        lat: 0,
        lng: 0
      },
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: window.google.maps.ControlPosition.TOP_RIGHT
      },
      streetViewControl: false,
      fullscreenControl: false
    });

    app.store.dispatch(app.actions.wait());
    navigator.geolocation.getCurrentPosition(function (position) {
      initMarker({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    }, function () {
      initMarker({
        lat: 0,
        lng: 0
      });
    });

    map.addListener('click', function (e) {
      marker.setPosition(e.latLng);
      app.store.dispatch(app.actions.location({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
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
      address: '',
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
      address: function address(data) {
        return {
          type: 'address',
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
  }

  /**
   * Initializing the application object
   */


  _createClass(App, [{
    key: 'init',
    value: function init() {
      var _this = this;

      // Create store with initial state
      this.store = App.createStore(App.reducer, this.initialState);

      this.store.subscribe(function () {
        var state = _this.store.getState();
        _this.switcher(state);
      });
    }

    /**
     * Create store of component
     * @param {function} reducer
     * @param {object} initialState
     * @returns {object} - Store
     */

  }, {
    key: 'switcher',


    /**
     * Switch the control flow according to the state
     * @param state
     */
    value: function switcher(state) {
      switch (state.status) {
        case 'location':
          this.store.dispatch(this.actions.wait());
          this.getAddress(state.location);
          this.getWeather(state.location);
          break;
        default:
          App.render(state);
          break;
      }
    }

    /**
     * Update DOM
     * @param state
     */

  }, {
    key: 'getAddress',


    /**
     * Get address and dispatch a due action.
     * @param location
     */
    value: function getAddress(location) {
      var _this2 = this;

      var url = 'https://maps.googleapis.com/maps/api/geocode/json';
      _ajax2.default.get(url, {
        latlng: location.lat + ',' + location.lng,
        key: 'AIzaSyB0ActUGaLxSQdUaN6RdrNiCEvmMIoDa78'
      }).then(function (data) {
        if (data.error) {
          _this2.store.dispatch(_this2.actions.error());
          return;
        }
        if (Array.isArray(data.results) && data.results[0] !== undefined && data.results[0].formatted_address !== undefined) {
          _this2.store.dispatch(_this2.actions.address(data.results[0].formatted_address));
        } else {
          _this2.store.dispatch(_this2.actions.address('unknown'));
        }
      });
    }

    /**
     * Get weather and dispatch a due action.
     * @param location
     */

  }, {
    key: 'getWeather',
    value: function getWeather(location) {
      var _this3 = this;

      var url = 'https://fcc-weather-api.glitch.me/api/current';
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
  }], [{
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
        case 'address':
          return Object.assign({}, state, {
            address: action.data,
            status: 'address'
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
    key: 'render',
    value: function render(state) {
      var items = {};
      var updatables = document.querySelector('.updatable');
      var icon = document.querySelector('#icon');
      var address = document.querySelector('#address');
      switch (state.status) {
        case 'waiting':
          updatables.classList.add('transparent');
          break;
        case 'ready':
          if (state.weather.main !== undefined) {
            items = {
              '#temp': Math.round(state.weather.main.temp) + ' \xB0C',
              '#pressure': Math.round(state.weather.main.pressure) + ' mbar',
              '#humidity': state.weather.main.humidity + ' %'
            };
          }
          items['#lat'] = state.location.lat.toFixed(3);
          items['#lng'] = state.location.lng.toFixed(3);
          if (Array.isArray(state.weather.weather) && state.weather.weather[0].icon !== undefined) {
            items['#sky'] = state.weather.weather[0].main;
            icon.setAttribute('src', state.weather.weather[0].icon.split('?')[0]);
            icon.setAttribute('alt', state.weather.weather[0].description);
          }
          Object.keys(items).forEach(function (key) {
            document.querySelector(key).innerHTML = items[key];
          });
          updatables.classList.remove('transparent');
          break;
        case 'address':
          address.innerHTML = state.address;
          break;
        case 'error':
          items = {
            '#temp': 'n/a',
            '#pressure': 'n/a',
            '#humidity': 'n/a',
            '#lat': 'n/a',
            '#lng': 'n/a',
            '#sky': 'n/a',
            '#address': 'n/a'
          };
          icon.setAttribute('src', 'error.png');
          icon.setAttribute('alt', 'error');
          Object.keys(items).forEach(function (key) {
            document.querySelector(key).innerHTML = items[key];
          });
          updatables.classList.remove('transparent');
          break;
        default:
          break;
      }
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
 * Created by Andrii Sorokin on 08/20/17
 * https://github.com/ignorantic/weather.git
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
  Object.keys(parameters).forEach(function (item) {
    if (paramString !== '') {
      paramString += '&';
    } else {
      paramString = '?';
    }
    paramString += item + '=' + parameters[item];
  });
  return fetch(url + paramString).then(status).then(json).catch(error);
};

ajax.post = function (url, headers, body) {
  return fetch(url, {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(body)
  }).then(status).then(json).catch(error);
};

exports.default = ajax;

/***/ })
/******/ ]);