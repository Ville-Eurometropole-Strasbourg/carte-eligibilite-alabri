function verificationRemonteeDeNappeEms(parcelle, polygon) {
  const url = `https://data.strasbourg.eu/api/records/1.0/search/?dataset=ppri-zonage-rn&q=&geofilter.polygon=${polygon}`;

  return fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {
      const zoneVertRecords = data.records.filter(r => {
        const isZoneVert = r.fields.nom === "Zone verte" || r.fields.nom === "Zone vert clair";
        return isZoneVert;
      });

      // Fusionner les géométries des zones vertes
      const mergedGeometry = zoneVertRecords.reduce((acc, r) => {
        if (!acc) return r.fields.geo_shape;
        return turf.union(acc, r.fields.geo_shape);
      }, null);

      if (!mergedGeometry) {
        return false;
      }

      // Intersecter la géométrie fusionnée avec la parcelle
      const intersection = turf.intersect(mergedGeometry, parcelle);

      const contactAlea = turf.booleanIntersects(
        { type: 'FeatureCollection', features: intersection ? [intersection] : [] },
        parcelle
      );

      return contactAlea;
    })
    .catch(error => {
      console.error('Erreur traitement des géométries EMS :', error);
      return null;
    });
}


function verificationCouleesEauxBoueuses(parcelle, polygon) {
  const url = `https://data.strasbourg.eu/api/records/1.0/search/?dataset=coulees-eaux-boueuses&q=&geofilter.polygon=${polygon}`;
  return fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {
      // Ne pas filtrer par nom de zone
      const allRecords = data.records;
      // Fusionner les géométries de toutes les zones
      const mergedGeometry = allRecords.reduce((acc, r) => {
        if (!acc) return r.fields.geo_shape;
        return turf.union(acc, r.fields.geo_shape);
      }, null);
      if (!mergedGeometry) {
        return false;
      }
      // Intersecter la géométrie fusionnée avec la parcelle
      const intersection = turf.intersect(mergedGeometry, parcelle);
      const contactAlea = turf.booleanIntersects(
        { type: 'FeatureCollection', features: intersection ? [intersection] : [] },
        parcelle
      );
      return contactAlea;
    })
    .catch(error => {
      console.error('Erreur traitement des géométries EMS :', error);
      return null;
    });
}


function verificationDebordementEms(parcelle, polygon) {
  const url = `https://data.strasbourg.eu/api/records/1.0/search/?dataset=ppri-zonage-ipd&q=&geofilter.polygon=${polygon}`;
  return fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {
      // Ne pas filtrer par nom de zone
      const allRecords = data.records;
      // Fusionner les géométries de toutes les zones
      const mergedGeometry = allRecords.reduce((acc, r) => {
        if (!acc) return r.fields.geo_shape;
        return turf.union(acc, r.fields.geo_shape);
      }, null);
      if (!mergedGeometry) {
        return false;
      }
      // Intersecter la géométrie fusionnée avec la parcelle
      const intersection = turf.intersect(mergedGeometry, parcelle);
      const contactAlea = turf.booleanIntersects(
        { type: 'FeatureCollection', features: intersection ? [intersection] : [] },
        parcelle
      );
      return contactAlea;
    })
    .catch(error => {
      console.error('Erreur traitement des géométries EMS :', error);
      return null;
    });
}

function verificationDebordementBruche(parcelle, polygon) {
  const url = `https://data.strasbourg.eu/api/records/1.0/search/?dataset=ppri_bruche_ipd_zonage&q=&geofilter.polygon=${polygon}`;
  return fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {
      // Ne pas filtrer par nom de zone
      const allRecords = data.records;
      // Fusionner les géométries de toutes les zones
      const mergedGeometry = allRecords.reduce((acc, r) => {
        if (!acc) return r.fields.geo_shape;
        return turf.union(acc, r.fields.geo_shape);
      }, null);
      if (!mergedGeometry) {
        return false;
      }
      // Intersecter la géométrie fusionnée avec la parcelle
      const intersection = turf.intersect(mergedGeometry, parcelle);
      const contactAlea = turf.booleanIntersects(
        { type: 'FeatureCollection', features: intersection ? [intersection] : [] },
        parcelle
      );
      return contactAlea;
    })
    .catch(error => {
      console.error('Erreur traitement des géométries EMS :', error);
      return null;
    });
}
