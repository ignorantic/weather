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
    };

    // Create action generators
    this.actions = {
      wait() {
        return {
          type: 'wait',
        };
      },
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
    };
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
      case 'wait':
        return Object.assign({}, state, {
          status: 'waiting',
        });
      case 'error':
        return Object.assign({}, state, {
          status: 'error',
        });
      case 'location':
        return Object.assign({}, state, {
          location: action.data,
          status: 'location',
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
  static render(state) {
    let items = {};
    const updatables = document.querySelector('.updatable');
    const icon = document.querySelector('#icon');
    const address = document.querySelector('#address');
    switch (state.status) {
      case 'waiting':
        updatables.classList.add('transparent');
        break;
      case 'ready':
        if (state.weather.main !== undefined) {
          items = {
            '#temp': `${Math.round(state.weather.main.temp)} °C`,
            '#pressure': `${Math.round(state.weather.main.pressure)} mbar`,
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
        Object.keys(items).forEach((key) => {
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
          '#address': 'n/a',
        };
        icon.setAttribute('src', 'error.png');
        icon.setAttribute('alt', 'error');
        Object.keys(items).forEach((key) => {
          document.querySelector(key).innerHTML = items[key];
        });
        updatables.classList.remove('transparent');
        break;
      default:
        break;
    }
  }

  /**
   * Get address and dispatch a due action.
   * @param location
   */
  getAddress(location) {
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
