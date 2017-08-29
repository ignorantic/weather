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

    app.map = map;

    navigator.geolocation.getCurrentPosition(function (position) {
      initMarker({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      app.marker = marker;
    }, function () {
      initMarker({
        lat: 0,
        lng: 0
      });
      app.marker = marker;
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
      status: 'ready',
      units: {
        visible: false,
        value: 'metric'
      }
    };

    // Create action generators
    this.actions = {
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
      input: function input(data) {
        return {
          type: 'input',
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
      },
      showUnits: function showUnits() {
        return {
          type: 'showUnits'
        };
      },
      hideUnits: function hideUnits() {
        return {
          type: 'hideUnits'
        };
      },
      toggleUnits: function toggleUnits() {
        return {
          type: 'toggleUnits'
        };
      },
      changeUnits: function changeUnits(data) {
        return {
          type: 'changeUnits',
          data: data
        };
      }
    };

    this.initsTimer = null;
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

      this.constructor.on([{
        event: 'mousedown',
        selector: '#units-dropdown',
        action: function action(e) {
          e.stopPropagation();
        }
      }, {
        event: 'click',
        selector: '#units-dropdown',
        action: function action(e) {
          e.stopPropagation();
          _this.store.dispatch(_this.actions.toggleUnits());
        }
      }, {
        event: 'mousedown',
        selector: '#weather',
        action: function action(e) {
          e.stopPropagation();
          _this.store.dispatch(_this.actions.hideUnits());
        }
      }, {
        event: 'mousedown',
        selector: '#map',
        action: function action() {
          _this.store.dispatch(_this.actions.hideUnits());
        }
      }, {
        event: 'change',
        selector: '[name=units]',
        action: function action(e) {
          _this.store.dispatch(_this.actions.changeUnits(e.target.value));
        }
      }, {
        event: 'mouseleave',
        selector: '#units-dropdown',
        action: function action() {
          _this.initsTimer = setTimeout(function () {
            _this.store.dispatch(_this.actions.hideUnits());
          }, 1000);
        }
      }, {
        event: 'mouseleave',
        selector: '#units',
        action: function action() {
          _this.initsTimer = setTimeout(function () {
            _this.store.dispatch(_this.actions.hideUnits());
          }, 1000);
        }
      }, {
        event: 'mouseover',
        selector: '#units',
        action: function action() {
          if (_this.initsTimer !== null) {
            clearTimeout(_this.initsTimer);
            _this.initsTimer = null;
          }
        }
      }, {
        event: 'mouseover',
        selector: '#units-dropdown',
        action: function action() {
          if (_this.initsTimer !== null) {
            clearTimeout(_this.initsTimer);
            _this.initsTimer = null;
          }
        }
      }, {
        event: 'input',
        selector: '#input',
        action: function action(e) {
          _this.store.dispatch(_this.actions.input(e.target.value));
        }
      }]);
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
        case 'input':
          this.getAddressByString(state.string);
          this.getWeather(state.location);
          break;
        case 'location':
          this.getAddressByLocation(state.location);
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
    key: 'getAddressByLocation',


    /**
     * Get address and dispatch a due action.
     * @param location
     */
    value: function getAddressByLocation(location) {
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
     * Get address and dispatch a due action.
     * @param string
     */

  }, {
    key: 'getAddressByString',
    value: function getAddressByString(string) {
      var _this3 = this;

      var url = 'https://maps.googleapis.com/maps/api/geocode/json';
      _ajax2.default.get(url, {
        address: string,
        key: 'AIzaSyB0ActUGaLxSQdUaN6RdrNiCEvmMIoDa78'
      }).then(function (data) {
        if (data.error) {
          _this3.store.dispatch(_this3.actions.error());
          return;
        }
        if (Array.isArray(data.results) && data.results[0] !== undefined && data.results[0].formatted_address !== undefined) {
          _this3.store.dispatch(_this3.actions.address(data.results[0].formatted_address));
          _this3.store.dispatch(_this3.actions.location(data.results[0].geometry.location));
          _this3.marker.setPosition(data.results[0].geometry.location);
          _this3.map.setCenter(_this3.marker.getPosition());
        } else {
          _this3.store.dispatch(_this3.actions.address('unknown'));
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
      var _this4 = this;

      var url = 'https://fcc-weather-api.glitch.me/api/current';
      _ajax2.default.get(url, {
        lat: location.lat,
        lon: location.lng
      }).then(function (data) {
        if (data.error) {
          _this4.store.dispatch(_this4.actions.error());
          return;
        }
        _this4.store.dispatch(_this4.actions.weather(data));
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
        case 'error':
          return Object.assign({}, state, {
            status: 'error'
          });
        case 'location':
          return Object.assign({}, state, {
            location: action.data,
            status: 'location'
          });
        case 'input':
          return Object.assign({}, state, {
            string: action.data,
            status: 'input'
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
        case 'showUnits':
          return Object.assign({}, state, {
            units: {
              visible: true,
              value: state.units.value
            }
          });
        case 'hideUnits':
          return Object.assign({}, state, {
            units: {
              visible: false,
              value: state.units.value
            }
          });
        case 'toggleUnits':
          return Object.assign({}, state, {
            units: {
              visible: !state.units.visible,
              value: state.units.value
            }
          });
        case 'changeUnits':
          return Object.assign({}, state, {
            units: {
              value: action.data,
              visible: state.units.visible
            }
          });
        default:
          return state;
      }
    }
  }, {
    key: 'render',
    value: function render(state) {
      var items = {};
      var icon = document.querySelector('#icon');
      var wind = document.querySelector('#wind');
      var address = document.querySelector('#address');
      var units = document.querySelector('#units');
      switch (state.status) {
        case 'ready':
          if (state.units.visible) {
            units.classList.add('units_active');
          } else {
            units.classList.remove('units_active');
          }
          if (state.weather.main !== undefined) {
            var pressure = void 0;
            var temp = void 0;
            switch (state.units.value) {
              case 'imperial':
                temp = Math.round(state.weather.main.temp * 1.8 + 32) + ' \xB0F';
                pressure = (state.weather.main.pressure * 0.02953).toFixed(2) + ' in';
                break;
              default:
                temp = Math.round(state.weather.main.temp) + ' \xB0C';
                pressure = Math.round(state.weather.main.pressure) + ' mbar';
                break;
            }
            items = {
              '#temp': temp,
              '#pressure': pressure,
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
          if (state.weather.wind !== undefined) {
            wind.setAttribute('src', './wind.png');
            wind.style.transform = 'rotate(' + state.weather.wind.deg + 'deg)';
          } else {
            icon.setAttribute('src', '');
          }
          Object.keys(items).forEach(function (key) {
            document.querySelector(key).innerHTML = items[key];
          });
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
          break;
        default:
          break;
      }
    }

    /**
     * Registrate event handlers
     * @param {array} array - [{
       *                  event: 'click' | ['click', 'resize'],
       *                  selector: '.button',
       *                  action: () => a + b
       *                }]
     */

  }, {
    key: 'on',
    value: function on(array) {
      array.forEach(function (item) {
        if (typeof item.event === 'string') {
          App.addListener(item.event, item.selector, item.action);
        } else if (Array.isArray(item.event)) {
          item.event.forEach(function (event) {
            if (typeof event === 'string') {
              App.addListener(event, item.selector, item.action);
            } else {
              throw new Error('Invalid event name: ' + event);
            }
          });
        } else {
          throw new Error('Invalid event name: ' + item.event);
        }
      });
    }

    /**
     * Add event listener
     * @param {string} event
     * @param {string|window} selector
     * @param {function} action
     */

  }, {
    key: 'addListener',
    value: function addListener(event, selector, action) {
      if (selector === 'window') {
        window.addEventListener(event, action, false);
      } else if (typeof selector === 'string') {
        var elements = document.querySelectorAll(selector);
        elements.forEach(function (element) {
          return element.addEventListener(event, action, false);
        });
      } else {
        throw new Error('Invalid selector value: ' + selector);
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