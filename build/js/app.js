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

var _htmlHelper = __webpack_require__(3);

var _htmlHelper2 = _interopRequireDefault(_htmlHelper);

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
      var updatables = document.querySelector('.updatable');
      var icon = document.querySelector('#icon');
      var address = document.querySelector('#address');
      var temp = document.querySelector('#temp');
      var pressure = document.querySelector('#pressure');
      var humidity = document.querySelector('#humidity');
      var lat = document.querySelector('#lat');
      var lng = document.querySelector('#lng');
      var sky = document.querySelector('#sky');
      var iconURL = void 0;
      switch (state.status) {
        case 'waiting':
          updatables.classList.add('transparent');
          break;
        case 'ready':
          icon.innerHTML = '';
          if (Array.isArray(state.weather.weather) && state.weather.weather[0].icon !== undefined) {
            iconURL = state.weather.weather[0].icon.split('?')[0];
            icon.innerHTML = '';
            icon.appendChild(_htmlHelper2.default.tag('img', null, {
              src: iconURL,
              alt: state.weather.weather[0].description
            }, null));
            sky.innerHTML = state.weather.weather[0].main;
          }
          if (state.weather.main !== undefined) {
            temp.innerHTML = Math.round(state.weather.main.temp) + ' \xB0C';
            pressure.innerHTML = Math.round(state.weather.main.pressure) + ' mbar';
            humidity.innerHTML = state.weather.main.humidity + ' %';
          }
          lat.innerHTML = state.location.lat.toFixed(3);
          lng.innerHTML = state.location.lng.toFixed(3);
          updatables.classList.remove('transparent');
          break;
        case 'address':
          address.innerHTML = state.address;
          break;
        case 'error':
          // Nothing yet
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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * html-helper.js
 * Created by Andrii Sorokin on 08/21/17
 * https://github.com/ignorantic/weather.git
 */

var html = {};

/**
 * Create and return DOM element
 *
 * @param  {String}         htmlTag         HTML tag
 * @param  {String}         innerHTML       HTML text
 *         {Object}         DOM element
 *         {Array}          array of DOM elements
 * @param  {Object}         attrs
 * @param  {Object}         style
 * @return {Object}         DOM element
 */
html.tag = function (htmlTag, innerHTML, attrs, style) {
  var element = void 0;
  function addAttrs() {
    if (attrs) {
      Object.keys(attrs).forEach(function (item) {
        var valueStr = void 0;
        if (Array.isArray(attrs[item])) {
          valueStr = attrs[item].join(' ');
        } else {
          valueStr = attrs[item];
        }
        element.setAttribute(item, valueStr);
      });
    }
  }

  function addChildren() {
    if (typeof innerHTML === 'string') {
      element.innerHTML = innerHTML;
      return;
    }
    if (innerHTML instanceof HTMLElement) {
      element.appendChild(innerHTML);
      return;
    }
    if (Array.isArray(innerHTML)) {
      innerHTML.forEach(function (value) {
        if (value instanceof HTMLElement) {
          element.appendChild(value);
        }
      });
    }
  }

  function addStyles() {
    if (style) {
      Object.keys(style).forEach(function (item) {
        if (typeof style[item] === 'string') {
          element.style[item] = style[item];
        }
      });
    }
  }

  /* BEGIN */

  if (typeof htmlTag === 'string') {
    element = document.createElement(htmlTag);
  } else {
    element = document.createElement('div');
  }

  if ((typeof attrs === 'undefined' ? 'undefined' : _typeof(attrs)) === 'object') {
    addAttrs();
  }

  if (innerHTML) {
    addChildren();
  }

  if ((typeof style === 'undefined' ? 'undefined' : _typeof(style)) === 'object') {
    addStyles();
  }

  return element;
};

/**
 * Create and return DOM element of link
 *
 * @param  {String}         innerHTML       HTML text
 *         {Object}         DOM element
 *         {Array}          array of DOM elements
 * @param  {String}         url             Web address
 * @param  {Object}         attrs
 * @param  {Object}         style
 * @return {Object}         DOM element     Link element
 */
html.a = function (innerHTML, url, attrs, style) {
  var element = html.tag('a', innerHTML, attrs, style);
  if (typeof url === 'string') {
    element.setAttribute('href', url);
  }
  return element;
};

exports.default = html;

/***/ })
/******/ ]);