// console.log("token ",mapToken);


// mapboxgl.accessToken = 'pk.eyJ1IjoiaGVldHNoaWhvcmEiLCJhIjoiY2xzY3Nqd3V4MDFlMDJybzRhZHkwMzJhNCJ9.6fdSU2gJC8lSs3w9QImqbw';
console.log(mapToken);
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map);
