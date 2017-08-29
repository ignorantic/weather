/**
 * app.js
 * Created by Andrii Sorokin on 08/20/17
 * https://github.com/ignorantic/weather.git
 */

import ajax from './ajax';

export default class App {
  /**
   * Construct the application object
   */
  constructor() {
    // Create initial state
    this.initialState = {
      location: {},
      address: '',
      weather: {},
      status: 'ready',
      units: {
        visible: false,
        value: 'metric',
      },
    };

    // Create action generators
    this.actions = {
      error() {
        return {
          type: 'error',
        };
      },
      location(data) {
        return {
          type: 'location',
          data,
        };
      },
      input(data) {
        return {
          type: 'input',
          data,
        };
      },
      address(data) {
        return {
          type: 'address',
          data,
        };
      },
      weather(data) {
        return {
          type: 'weather',
          data,
        };
      },
      showUnits() {
        return {
          type: 'showUnits',
        };
      },
      hideUnits() {
        return {
          type: 'hideUnits',
        };
      },
      toggleUnits() {
        return {
          type: 'toggleUnits',
        };
      },
      changeUnits(data) {
        return {
          type: 'changeUnits',
          data,
        };
      },
    };

    this.initsTimer = null;
  }

  /**
   * Initializing the application object
   */
  init() {
    // Create store with initial state
    this.store = App.createStore(App.reducer, this.initialState);

    this.store.subscribe(() => {
      const state = this.store.getState();
      this.switcher(state);
    });

    this.constructor.on([{
      event: 'mousedown',
      selector: '#units-dropdown',
      action: (e) => {
        e.stopPropagation();
      },
    }, {
      event: 'click',
      selector: '#units-dropdown',
      action: (e) => {
        e.stopPropagation();
        this.store.dispatch(this.actions.toggleUnits());
      },
    }, {
      event: 'mousedown',
      selector: '#weather',
      action: (e) => {
        e.stopPropagation();
        this.store.dispatch(this.actions.hideUnits());
      },
    }, {
      event: 'mousedown',
      selector: '#map',
      action: () => {
        this.store.dispatch(this.actions.hideUnits());
      },
    }, {
      event: 'change',
      selector: '[name=units]',
      action: (e) => {
        this.store.dispatch(this.actions.changeUnits(e.target.value));
      },
    }, {
      event: 'mouseleave',
      selector: '#units-dropdown',
      action: () => {
        this.initsTimer = setTimeout(() => {
          this.store.dispatch(this.actions.hideUnits());
        },
        1000);
      },
    }, {
      event: 'mouseleave',
      selector: '#units',
      action: () => {
        this.initsTimer = setTimeout(() => {
          this.store.dispatch(this.actions.hideUnits());
        },
        1000);
      },
    }, {
      event: 'mouseover',
      selector: '#units',
      action: () => {
        if (this.initsTimer !== null) {
          clearTimeout(this.initsTimer);
          this.initsTimer = null;
        }
      },
    }, {
      event: 'mouseover',
      selector: '#units-dropdown',
      action: () => {
        if (this.initsTimer !== null) {
          clearTimeout(this.initsTimer);
          this.initsTimer = null;
        }
      },
    }, {
      event: 'input',
      selector: '#input',
      action: (e) => {
        this.store.dispatch(this.actions.input(e.target.value));
      },
    }]);
  }

  /**
   * Create store of component
   * @param {function} reducer
   * @param {object} initialState
   * @returns {object} - Store
   */
  static createStore(reducer, initialState) {
    const currentReducer = reducer;
    let currentState = initialState;
    let listener = () => {
    };
    return {
      getState() {
        return currentState;
      },
      dispatch(action) {
        currentState = currentReducer(currentState, action);
        listener();
        return action;
      },
      subscribe(newListener) {
        listener = newListener;
      },
    };
  }

  /**
   * Return new state
   * @param {object} state - Current state
   * @param {object} action - Dispatched action
   * @returns {object} - New state
   */
  static reducer(state, action) {
    switch (action.type) {
      case 'error':
        return Object.assign({}, state, {
          status: 'error',
        });
      case 'location':
        return Object.assign({}, state, {
          location: action.data,
          status: 'location',
        });
      case 'input':
        return Object.assign({}, state, {
          string: action.data,
          status: 'input',
        });
      case 'address':
        return Object.assign({}, state, {
          address: action.data,
          status: 'address',
        });
      case 'weather':
        return Object.assign({}, state, {
          weather: action.data,
          status: 'ready',
        });
      case 'showUnits':
        return Object.assign({}, state, {
          units: {
            visible: true,
            value: state.units.value,
          },
        });
      case 'hideUnits':
        return Object.assign({}, state, {
          units: {
            visible: false,
            value: state.units.value,
          },
        });
      case 'toggleUnits':
        return Object.assign({}, state, {
          units: {
            visible: !state.units.visible,
            value: state.units.value,
          },
        });
      case 'changeUnits':
        return Object.assign({}, state, {
          units: {
            value: action.data,
            visible: state.units.visible,
          },
        });
      default:
        return state;
    }
  }

  /**
   * Switch the control flow according to the state
   * @param state
   */
  switcher(state) {
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
  static render(state) {
    let items = {};
    const icon = document.querySelector('#icon');
    const wind = document.querySelector('#wind');
    const address = document.querySelector('#address');
    const units = document.querySelector('#units');
    switch (state.status) {
      case 'ready':
        if (state.units.visible) {
          units.classList.add('units_active');
        } else {
          units.classList.remove('units_active');
        }
        if (state.weather.main !== undefined) {
          let pressure;
          let temp;
          switch (state.units.value) {
            case 'imperial':
              temp = `${Math.round((state.weather.main.temp * 1.8) + 32)} °F`;
              pressure = `${(state.weather.main.pressure * 0.02953).toFixed(2)} in`;
              break;
            default:
              temp = `${Math.round(state.weather.main.temp)} °C`;
              pressure = `${Math.round(state.weather.main.pressure)} mbar`;
              break;
          }
          items = {
            '#temp': temp,
            '#pressure': pressure,
            '#humidity': `${state.weather.main.humidity} %`,
          };
        }
        items['#lat'] = state.location.lat.toFixed(3);
        items['#lng'] = state.location.lng.toFixed(3);
        if (Array.isArray(state.weather.weather)
          && state.weather.weather[0].icon !== undefined) {
          items['#sky'] = state.weather.weather[0].main;
          icon.setAttribute('src', state.weather.weather[0].icon.split('?')[0]);
          icon.setAttribute('alt', state.weather.weather[0].description);
        }
        if (state.weather.wind !== undefined) {
          wind.setAttribute('src', './wind.png');
          wind.style.transform = `rotate(${state.weather.wind.deg}deg)`;
        } else {
          icon.setAttribute('src', '');
        }
        Object.keys(items).forEach((key) => {
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
          '#address': 'n/a',
        };
        icon.setAttribute('src', 'error.png');
        icon.setAttribute('alt', 'error');
        Object.keys(items).forEach((key) => {
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
  static on(array) {
    array.forEach((item) => {
      if (typeof item.event === 'string') {
        App.addListener(item.event, item.selector, item.action);
      } else if (Array.isArray(item.event)) {
        item.event.forEach((event) => {
          if (typeof event === 'string') {
            App.addListener(event, item.selector, item.action);
          } else {
            throw new Error(`Invalid event name: ${event}`);
          }
        });
      } else {
        throw new Error(`Invalid event name: ${item.event}`);
      }
    });
  }

  /**
   * Add event listener
   * @param {string} event
   * @param {string|window} selector
   * @param {function} action
   */
  static addListener(event, selector, action) {
    if (selector === 'window') {
      window.addEventListener(event, action, false);
    } else if (typeof selector === 'string') {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => element.addEventListener(event, action, false));
    } else {
      throw new Error(`Invalid selector value: ${selector}`);
    }
  }

  /**
   * Get address and dispatch a due action.
   * @param location
   */
  getAddressByLocation(location) {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    ajax.get(url, {
      latlng: `${location.lat},${location.lng}`,
      key: 'AIzaSyB0ActUGaLxSQdUaN6RdrNiCEvmMIoDa78',
    }).then((data) => {
      if (data.error) {
        this.store.dispatch(this.actions.error());
        return;
      }
      if (Array.isArray(data.results) && data.results[0] !== undefined
        && data.results[0].formatted_address !== undefined) {
        this.store.dispatch(this.actions.address(data.results[0].formatted_address));
      } else {
        this.store.dispatch(this.actions.address('unknown'));
      }
    });
  }

  /**
   * Get address and dispatch a due action.
   * @param string
   */
  getAddressByString(string) {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    ajax.get(url, {
      address: string,
      key: 'AIzaSyB0ActUGaLxSQdUaN6RdrNiCEvmMIoDa78',
    }).then((data) => {
      if (data.error) {
        this.store.dispatch(this.actions.error());
        return;
      }
      if (Array.isArray(data.results) && data.results[0] !== undefined
        && data.results[0].formatted_address !== undefined) {
        this.store.dispatch(this.actions.address(data.results[0].formatted_address));
        this.store.dispatch(this.actions.location(data.results[0].geometry.location));
        this.marker.setPosition(data.results[0].geometry.location);
        this.map.setCenter(this.marker.getPosition());
      } else {
        this.store.dispatch(this.actions.address('unknown'));
      }
    });
  }

  /**
   * Get weather and dispatch a due action.
   * @param location
   */
  getWeather(location) {
    const url = 'https://fcc-weather-api.glitch.me/api/current';
    ajax.get(url, {
      lat: location.lat,
      lon: location.lng,
    }).then((data) => {
      if (data.error) {
        this.store.dispatch(this.actions.error());
        return;
      }
      this.store.dispatch(this.actions.weather(data));
    });
  }
}
