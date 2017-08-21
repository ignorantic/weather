/**
 * app.js
 * Created by Andrii Sorokin on 08/20/17
 * https://github.com/ignorantic/weather.git
 * AIzaSyB0ActUGaLxSQdUaN6RdrNiCEvmMIoDa78
 */

import ajax from './ajax'

export default class App {

    /**
     * Construct the application object
     */
    constructor() {

        // Create initial state
        this.initialState = {
            location: {},
            weather: {},
            status: 'ready'
        };

        // Create action generators
        this.actions = {
            wait: function () {
                return {
                    type: 'wait'
                };
            },
            error: function () {
                return {
                    type: 'error'
                };
            },
            location: function (data) {
                return {
                    type: 'location',
                    data: data
                };
            },
            weather: function (data) {
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
    init() {

        this.store.subscribe(() => {
            let state = this.store.getState();
            this.filter(state);
        });

        // Initial request
        this.store.dispatch(this.actions.wait());
        this.getLocation((position) => {
            this.store.dispatch(this.actions.location(position));
            this.getWeather(position);
        });
    }

    /**
     * Register event handlers
     * @param {array} array
     */
    on(array) {
        array.forEach(item => {
            if (typeof item.event === 'string') {
                this.addListener(item.event, item.selector, item.action);
            }
        });

    }

    /**
     * Add event listener
     * @param {string} event
     * @param {string} selector
     * @param {function} action
     */
    addListener(event, selector, action) {
        if (typeof selector === 'string') {
            let elements = document.querySelectorAll(selector);
            elements.forEach(element => element.addEventListener(event, action, false));
        }
    }

    /**
     * Create store of component
     * @param {function} reducer
     * @param {object} initialState
     * @returns {object} - Store
     */
    createStore(reducer, initialState) {
        let currentReducer = reducer;
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
            }
        };
    }

    /**
     * Return new state
     * @param {object} state - Current state
     * @param {object} action - Dispatched action
     * @returns {object} - New state
     */
    reducer(state, action) {
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

    filter(state) {
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
    render(state) {
        const weatherList = document.querySelector('.weather__list');
        const temp = document.querySelector('#temp');
        const pressure = document.querySelector('#pressure');
        const humidity = document.querySelector('#humidity');
        const lat = document.querySelector('#lat');
        const lng = document.querySelector('#lng');
        switch (state.status) {
            case 'waiting':
                weatherList.classList.add('transparent');
                break;
            case 'error':
                break;
            case 'ready':
                if (state.weather.main !== void 0) {
                    temp.innerText = `Temperature: ${state.weather.main.temp}`;
                    pressure.innerText = `Pressure: ${state.weather.main.pressure}`;
                    humidity.innerText = `Humidity: ${state.weather.main.humidity}`;
                }
                lat.innerText = `Latitude: ${state.location.lat}`;
                lng.innerText = `Longitude: ${state.location.lng}`;
                weatherList.classList.remove('transparent');
                break;
            default:
                break;

        }
    }

    getLocation(cb) {
        navigator.geolocation.getCurrentPosition((position) => {
            cb({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
        });
    }

    getWeather(location) {
        let url = `https://fcc-weather-api.glitch.me/api/current?`;
        ajax.get(url, {
            lat: location.lat,
            lon: location.lng
        }).then(data => {
            if (data.error) {
                this.store.dispatch(this.actions.error());
                return;
            }
            this.store.dispatch(this.actions.weather(data));
        });
    };
}
