/**
 * app.js
 * Created by Andrii Sorokin on 08/20/17
 * https://github.com/ignorantic/weather.git
 */

import ajax from './ajax'
import html from './html-helper'

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
            address: function (data) {
                return {
                    type: 'address',
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

    filter(state) {
        switch (state.status) {
            case 'location':
                this.store.dispatch(this.actions.wait());
                this.getAddress(state.location);
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
        console.log(state);
        const updatables = document.querySelector('.updatable');
        const icon = document.querySelector('#icon');
        const address = document.querySelector('#address');
        switch (state.status) {
            case 'waiting':
                updatables.classList.add('transparent');
                break;
            case 'error':
                break;
            case 'ready':
                const temp = document.querySelector('#temp');
                const sky = document.querySelector('#sky');
                const pressure = document.querySelector('#pressure');
                const humidity = document.querySelector('#humidity');
                const lat = document.querySelector('#lat');
                const lng = document.querySelector('#lng');
                icon.innerHTML = '';
                if (Array.isArray(state.weather.weather)
                    && state.weather.weather[0].icon !== void 0) {
                    let iconURL = state.weather.weather[0].icon.split('?')[0];
                    icon.innerHTML = '';
                    icon.appendChild(html.tag('img', null, {
                        src: iconURL,
                        alt: state.weather.weather[0].description
                    }, null));
                    sky.innerHTML = state.weather.weather[0].main;
                }
                if (state.weather.main !== void 0) {
                    temp.innerHTML = `${Math.round(state.weather.main.temp)} °C`;
                    pressure.innerHTML = `${Math.round(state.weather.main.pressure)} mbar`;
                    humidity.innerHTML = `${state.weather.main.humidity} %`;
                }
                lat.innerHTML = state.location.lat.toFixed(3);
                lng.innerHTML = state.location.lng.toFixed(3);
                updatables.classList.remove('transparent');
                break;
            case 'address':
                address.innerHTML = state.address;
                break;
            default:
                break;

        }
    }

    getAddress(location) {
        let url = 'https://maps.googleapis.com/maps/api/geocode/json';
        ajax.get(url, {
            latlng: `${location.lat},${location.lng}`,
            key: 'AIzaSyB0ActUGaLxSQdUaN6RdrNiCEvmMIoDa78'
        }).then(data => {
            if (data.error) {
                this.store.dispatch(this.actions.error());
                return;
            }
            if (Array.isArray(data.results) && data.results[0] !== void 0
                && data.results[0].formatted_address !== void 0) {
                this.store.dispatch(this.actions.address(data.results[0].formatted_address));
            } else {
                this.store.dispatch(this.actions.address('unknown'));
            }
        });

    }

    getWeather(location) {
        let url = 'https://fcc-weather-api.glitch.me/api/current';
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
