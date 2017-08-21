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
        let map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: {lat: 47, lng: 37.5}
        });
        let marker = new google.maps.Marker({
            position: {lat: 47, lng: 37.5},
            map: map,
            draggable: true
        });

        map.addListener('click', (e) => {
            marker.setPosition(e.latLng);
            app.store.dispatch(app.actions.location({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            }))
        });

        marker.addListener('dragend', () => {
            app.store.dispatch(app.actions.location({
                lat: marker.getPosition().lat(),
                lng: marker.getPosition().lng()
            }))
        });
    }
    window.initMap = initMap;
});
