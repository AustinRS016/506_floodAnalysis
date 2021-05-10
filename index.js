mapboxgl.accessToken = 'pk.eyJ1IjoiYXVzdGlucnMxNiIsImEiOiJja2hjcjAyYWwwMTIyMnVsNXc3ajUwMmk0In0.b8-Uodu2rXl9TvsX7vatSQ';


var map = new mapboxgl.Map({
  container: 'map', // HTML container id
  style: 'mapbox://styles/austinrs16/ckhk49v3x0znh19o35r2mozoa', // style URL
  center: [-122, 48], // starting position as [lng, lat]
  zoom: 10, // starting zoom
});


map.on('load', function(){


map.addSource('Roads',{
       "type": "geojson",
       "data": "jsons/Roads_geo.geojson"
   });
  map.addLayer({
     "id":"roads",
     "type":"line",
     "source":"Roads",
     "layout": {'visibility': 'visible'},
     "paint": {
      'line-color': '#ffde0a',


    },

   });

map.addSource('FEMA_Zones_geo',{
     "type": "geojson",
     "data": "jsons/FEMA_Zones_geo.geojson"
 });
 map.addLayer({
   "id":"fema",
   "type":"fill",
   "source":"FEMA_Zones_geo",
   "layout": {'visibility': 'visible'},
   "filter": ['all',
   ['!=', 'ZONE_SUBTY','AREA OF MINIMAL FLOOD HAZARD'],
   ['!=', 'FLD_ZONE', 'OPEN WATER']
              ],
   "paint": {
     'fill-antialias': false,
     'fill-color':
     ['match',
       ['get','FLD_ZONE'],
       'A', 'orange',
       'AE', 'red',
       'X', [
         'match',
         ['get', 'ZONE_SUBTY'],
         '0.2 PCT ANNUAL CHANCE FLOOD HAZARD', 'yellow',
         'red',
            ],
     'orange'
      ],
   'fill-opacity': .65

      },

        });

   map.addSource('svi',{
        "type": "geojson",
        "data": "jsons/SVI2018_geo.geojson"
    });
    map.addLayer({
      "id":"svi",
      "type":"fill",
      "source":"svi",
      "layout": {'visibility': 'visible'},
      "paint": {
        'fill-antialias': true,
       'fill-color':[
         'interpolate', ['linear'],
         ['get', 'RPL_THEMES'],
         0,
         ['to-color', 'red'],
         1,
         ['to-color', 'green']
       ],
       'fill-opacity': [
         'case',
         ['boolean', ['feature-state', 'hover'], false],
         1,
         0.2
       ]
     }
    });

    map.addSource('Schools',{
         "type": "geojson",
         "data": "jsons/Schools_geo.geojson"
     });
     map.addLayer({
       "id":"schools",
       "type":"circle",
       "source":"Schools",
       "layout": {'visibility': 'visible'},
       "paint": {
        'circle-color': 'green',
        'circle-radius': 3.5
      },

     });

   map.addSource('Transit',{
         "type": "geojson",
         "data": "jsons/Transit_geo.geojson"
     });
     map.addLayer({
       "id":"transit",
       "type":"circle",
       "source":"Transit",
       "layout": {'visibility': 'visible'},
       "paint": {
        'circle-color': 'yellow',
        'circle-radius': 3.5


      },

     });

     map.addSource('everett',{
           "type": "geojson",
           "data": "jsons/EverettBounds_geo.geojson"
       });
       map.addLayer({
         "id":"everett",
         "type":"line",
         "source":"everett",
         "layout": {'visibility': 'visible'},
         "paint": {
          'line-color': 'black'



        },

       });

     map.addSource('critical',{
          "type": "geojson",
          "data": "jsons/Various_geo.geojson"
      });
      map.addLayer({
        "id":"critical",
        "type":"circle",
        "source":"critical",
        "layout": {'visibility': 'visible'},
        "paint": {
         'circle-color': 'orange',
         'circle-radius': 3.5


       },

      });
    });






// Highlight and popup for svi layer
var hoveredStateId = null;



map.on('mousemove', 'svi', function (e){
  if (e.features.length > 0) {
    if (hoveredStateId !== null) {
      map.setFeatureState(
        { source: 'svi', id: hoveredStateId },
        { hover: false}
      );
    }
    hoveredStateId = e.features[0].id;
    map.setFeatureState(
      { source: 'svi', id: hoveredStateId },
      { hover: true }
    );
  }
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave','svi', function () {
  if (hoveredStateId !== null) {
    map.setFeatureState(
      { source: 'svi', id: hoveredStateId },
      { hover: false }
    );
  }
  hoveredStateId = null;
  map.getCanvas().style.cursor = '';
});

map.on('click','svi', function(e) {
  new mapboxgl.Popup()
  .setLngLat(e.lngLat)
  .setHTML("Overall summary ranking: " + e.features[0].properties.RPL_THEMES)
  .addTo(map);
});



//toggleable layers

    var toggleableLayerIds = ['svi','fema'];
    for (var i = 0; i < toggleableLayerIds.length; i++) {
      var id = toggleableLayerIds[i];

        var link = document.createElement('a');

        link.href = '#';
        link.textContent = id;
        link.className = 'active';

        link.onclick = function (e) {
          var clickedLayer = this.textContent;
          e.preventDefault();
          e.stopPropagation();

          var visibility = map.getLayoutProperty(clickedLayer,'visibility');

          if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer,'visibility','none');
            this.className = '';
          }
          else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer,'visibility','visible');
          }
        };
        var layers = document.getElementById('menu');
        layers.appendChild(link);

    };





     // map.addSource('Water',{
     //      "type": "geojson",
     //      "data": "jsons/Water_geo.geojson"
     //  });
     //
     //  map.addLayer({
     //    "id":"water",
     //    "type":"fill",
     //    "source":"Water",
     //    "paint": {
     //     'fill-color': 'blue'
     //
     //
     //   },
     //
     //  });

 //     map.addSource('',{
  //          "type": "geojson",
  //          "data": "jsons/"
  //      });
  //
  //      map.addLayer({
  //        "id":"",
  //        "type":"circle",
  //        "source":"",
  //        "paint": {
  //         'circle-color':
  //
  //
  //       },
  //
  //      });
