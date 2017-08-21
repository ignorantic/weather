/**
 * index.js
 * Created by Andrii Sorokin on 08/20/17
 * https://github.com/ignorantic/weather.git
 */

import App from './js/app';

document.addEventListener('DOMContentLoaded', () => {

    let app = new App();
    app.init();

    function initMap() {

        function initMarker(position) {
            marker = new google.maps.Marker({
                position: {
                    lat: position.lat,
                    lng: position.lng
                },
                map: map,
                draggable: true
            });
            map.setCenter(marker.getPosition());
            marker.addListener('dragend', () => {
                app.store.dispatch(app.actions.location({
                    lat: marker.getPosition().lat(),
                    lng: marker.getPosition().lng()
                }))
            });
            app.store.dispatch(app.actions.location(position));
            app.getWeather(position);
        }

        let map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: {
                lat: 0,
                lng: 0
            },
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            streetViewControl: false,
            fullscreenControl: false
        });

        let marker;

        app.store.dispatch(app.actions.wait());
        app.getLocation(initMarker);

        map.addListener('click', (e) => {
            marker.setPosition(e.latLng);
            app.store.dispatch(app.actions.location({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            }))
        });
    }
    window.initMap = initMap;
});
