function addSources(map) {
    map.addSource("parcel-source", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
  
    map.addSource("masque-source", {
      type: "geojson",
      data: "https://sig.strasbourg.eu/datastrasbourg/alabri/masque.geojson",
    });
  
    map.addSource("papizorn-source", {
      type: "geojson",
      data: "https://sig.strasbourg.eu/datastrasbourg/alabri/papi_zorn.geojson",
    });
  
    map.addSource("zonesinondables-source", {
      type: "vector",
      url: "pmtiles://https://sig.strasbourg.eu/datastrasbourg/alabri/zonesinondables.pmtiles",
      attribution: 'Ville et Eurométropole de Strasbourg'
    });
  
    map.addSource("couleeseauxboueuses-source", {
      type: "vector",
      url: "pmtiles://https://sig.strasbourg.eu/datastrasbourg/alabri/coulees_eaux_boueuses.pmtiles",
      attribution: 'Ville et Eurométropole de Strasbourg'
    });
  }
  
  function addLayers(map) {
    map.addLayer({
      id: "parcel-layer",
      type: "fill",
      source: "parcel-source",
      paint: {
        "fill-color": "blue",
        "fill-opacity": 0.3,
      },
    });
  
    map.addLayer({
      id: "masque-layer",
      type: "fill",
      source: "masque-source",
      paint: {
        "fill-color": "grey",
        "fill-opacity": 0.5,
      },
    });
  
    map.addLayer({
      id: "papizorn-layer",
      type: "fill",
      source: "papizorn-source",
      paint: {
        "fill-color": "orange",
        "fill-opacity": 0,
      },
    });
  
    map.addLayer({
      id: 'zonesinondables-layer',
      type: 'fill',
      source: 'zonesinondables-source',
      'source-layer': 'zonesinondables',
      paint: {
        "fill-color": "#1D31B8",
        "fill-opacity": 0.2,
      }
    });
  
    map.addLayer({
      id: 'couleeseauxboueuses-layer',
      type: 'fill',
      source: 'couleeseauxboueuses-source',
      'source-layer': 'couleeseauxboueuses',
      paint: {
        "fill-color": "#582900",
        "fill-opacity": 0.2,
      }
    });
  }  
