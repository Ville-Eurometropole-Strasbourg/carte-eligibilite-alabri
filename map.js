const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const map = new maplibregl.Map({
  container: "map",
  style: {
    version: 8,
    sources: {
      "raster-tiles": {
        type: "raster",
        tiles: [
          "https://adict.strasbourg.eu/mapproxy/service?VERSION=1.1.0&1=2&SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=monstrasbourg&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=false&HEIGHT=256&WIDTH=256&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}",
        ],
        tileSize: 256,
      },
    },
    layers: [
      {
        id: "simple-tiles",
        type: "raster",
        source: "raster-tiles",
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  },
  minZoom: 10,
  maxZoom: 16,
  center: [7.7254, 48.5798],
  hash: true,
  zoom: 13,
});

map.dragRotate.disable();

map.addControl(
  new MaplibreGeocoder(geocoderApi, {
    maplibregl,
  })
);

map.addControl(
  new maplibregl.NavigationControl({
    visualizePitch: true,
    showZoom: true,
    showCompass: false,
  })
);

map.addControl(
  new maplibregl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  })
);

map.addControl(new maplibregl.FullscreenControl());
map.addControl(new maplibregl.NavigationControl({ showCompass: false }));

map.on("load", function () {
  addSources(map);
  addLayers(map);
});

// Gestion de l'événement de clic sur la carte
map.on("click", function (e) {
  // Vérification si le clic est sur la couche du masque
  const featuresMasque = map.queryRenderedFeatures(e.point, {
    layers: ["masque-layer"],
  });

  if (featuresMasque.length > 0) {
    return;
  }

  // Vérification si le clic est sur la couche de Papi Zorn
  const featuresPapiZorn = map.queryRenderedFeatures(e.point, {
    layers: ["papizorn-layer"],
  });

  // Récupération des coordonnées du clic
  var coordinates = {
    lng: parseFloat(e.lngLat.lng.toFixed(5)),
    lat: parseFloat(e.lngLat.lat.toFixed(5)),
  };
  console.log(coordinates);

  const lat = coordinates.lat;
  const lon = coordinates.lng;

  Promise.all([recupererParcelle(lat, lon)]).then((results) => {
    const cadastreData = results[0];
    const parcelleId = cadastreData.id_parcellaire;

    verificationRemonteeDeNappeEms(
      cadastreData.geo_shape,
      geomToOdsPolygon(cadastreData.geo_shape)
    ).then((result) => {
      console.log("exposition au risque de remontee de nappe (EMS)", result);
    });
    verificationCouleesEauxBoueuses(
      cadastreData.geo_shape,
      geomToOdsPolygon(cadastreData.geo_shape)
    ).then((result) => {
      console.log("exposition au risque de coulees eaux boueuses", result);
    });
    verificationDebordementEms(
      cadastreData.geo_shape,
      geomToOdsPolygon(cadastreData.geo_shape)
    ).then((result) => {
      console.log("exposition au risque de debordement (EMS)", result);
    });
    verificationDebordementBruche(
      cadastreData.geo_shape,
      geomToOdsPolygon(cadastreData.geo_shape)
    ).then((result) => {
      console.log("exposition au risque de debordement (Bruche)", result);
    });

    function afficherPopupMapLibre(message, coordinates) {
      new maplibregl.Popup().setLngLat(coordinates).setHTML(message).addTo(map);
    }

    const promessesDeVerification = [
      verificationRemonteeDeNappeEms(
        cadastreData.geo_shape,
        geomToOdsPolygon(cadastreData.geo_shape)
      ),
      verificationCouleesEauxBoueuses(
        cadastreData.geo_shape,
        geomToOdsPolygon(cadastreData.geo_shape)
      ),
      verificationDebordementEms(
        cadastreData.geo_shape,
        geomToOdsPolygon(cadastreData.geo_shape)
      ),
      verificationDebordementBruche(
        cadastreData.geo_shape,
        geomToOdsPolygon(cadastreData.geo_shape)
      ),
    ];

    Promise.all(promessesDeVerification)
      .then((results) => {
        const risqueExpose = results.some((result) => result === true);
        let message = "";

        if (featuresPapiZorn.length > 0) {
          // Messages pour la zone Papi Zorn
          message += risqueExpose
            ? "<b>Votre bien est situé en zone inondable</b><br/>"
            : "<b>Votre bien n'est pas situé en zone inondable</b><br/>";
          message += `Parcelle : ${parcelleId}<br/>Zone gérée par le SDEA<br><a href="https://www.sdea.fr/index.php/fr/les-services/conseil/j-agis-en-cas-d-inondation/je-fais-diagnostiquer-la-vulnerabilite-de-mon-habitation" target="_blank">Plus d'informations sur l'opération Pieds au sec</a>`;
        } else {
          // Messages et liens pour les zones hors Papi Zorn
          message += risqueExpose
            ? "<b>Votre bien est situé en zone inondable</b><br/>" +
              `Parcelle : ${parcelleId}<br/>` +
              `<a href='https://demarches.strasbourg.eu/a-faire-valider/diagnostic-inondation/?parc=${parcelleId}' target='_blank'>M'inscrire pour un diagnostic ALABRI gratuit</a><br/>` +
              "<a href='https://www.strasbourg.eu/risque-inondation' target='_blank'>Plus d'informations sur le risque inondation</a>"
            : "<b>Votre bien n'est pas situé en zone inondable</b><br/>" +
              `Parcelle : ${parcelleId}<br/>` +
              "<a href='https://www.strasbourg.eu/risque-inondation' target='_blank'>Plus d'informations sur le risque inondation</a><br/>" +
              "<a href='https://www.strasbourg.eu/prevenir-inondations-caves-sous-sols' target='_blank'>Prévenir les inondations en sous-sols</a>";
        }

        afficherPopupMapLibre(message, coordinates);
      })
      .catch((error) => {
        console.error("Erreur lors des vérifications des risques:", error);
      });

    if (cadastreData.geo_shape) {
      map.getSource("parcel-source").setData(cadastreData.geo_shape);
    } else {
      map
        .getSource("parcel-source")
        .setData({ type: "FeatureCollection", features: [] });
    }
  });
});
