/**
 * index.js
 * Created by Andrii Sorokin on 08/20/17
 * https://github.com/ignorantic/weather.git
 */

import App from './js/app';

document.addEventListener('DOMContentLoaded', () => {
  // Create and initialize application object
  const app = new App();
  app.init();

  // Initialize map, callback for Google Maps JavaScript API
  function initMap() {
    let map;
    let marker;

    // Initialize marker
    function initMarker(position) {
      marker = new window.google.maps.Marker({
        position: {
          lat: position.lat,
          lng: position.lng,
        },
        map,
        draggable: true,
      });

      map.setCenter(marker.getPosition());
      marker.addListener('dragend', () => {
        app.store.dispatch(app.actions.location({
          lat: marker.getPosition().lat(),
          lng: marker.getPosition().lng(),
        }));
      });

      app.store.dispatch(app.actions.location(position));
      app.getWeather(position);
    }

    map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: {
        lat: 0,
        lng: 0,
      },
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: window.google.maps.ControlPosition.TOP_RIGHT,
      },
      streetViewControl: false,
      fullscreenControl: false,
    });

    window.map = map;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        initMarker({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        window.marker = marker;
      },
      () => {
        initMarker({
          lat: 0,
          lng: 0,
        });
        window.marker = marker;
      },
    );

    map.addListener('click', (e) => {
      marker.setPosition(e.latLng);
      app.store.dispatch(app.actions.location({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      }));
    });
  }

  window.initMap = initMap;
});
