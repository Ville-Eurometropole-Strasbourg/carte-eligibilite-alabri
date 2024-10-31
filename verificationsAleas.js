/**
 * Vérifie si une parcelle est en contact avec une zone de remontée de nappe EMS.
 * 
 * @param {Object} parcelle - La géométrie de la parcelle à vérifier.
 * @param {string} polygon - La chaîne de coordonnées du polygone de recherche.
 * @returns {Promise<boolean|null>} - Une promesse qui se résout en true si la parcelle est en contact, 
 *                                    false sinon, ou null en cas d'erreur.
 */
function verificationRemonteeDeNappeEms(parcelle, polygon) {
  // URL de l'API pour récupérer les données de zonage PPRI
  const url = `https://data.strasbourg.eu/api/records/1.0/search/?dataset=ppri-zonage-rn&q=&geofilter.polygon=${polygon}`;

  return fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {
      // Filtrer les enregistrements pour ne garder que les zones vertes
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
        return false; // Aucune zone verte trouvée
      }
      // Intersecter la géométrie fusionnée avec la parcelle
      const intersection = turf.intersect(mergedGeometry, parcelle);
      // Vérifier si la parcelle est en contact avec la zone d'aléa
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

/**
 * Vérifie si une parcelle est en contact avec une zone à risque d'inondation de l'Eurométropole de Strasbourg.
 * 
 * @param {Object} parcelle - L'objet GeoJSON représentant la parcelle à vérifier.
 * @param {string} polygon - La chaîne de coordonnées du polygone de recherche.
 * @returns {Promise<boolean|null>} Une promesse qui se résout en :
 *   - true si la parcelle est en contact avec une zone à risque,
 *   - false si elle n'est pas en contact,
 *   - null en cas d'erreur.
 */
function verificationDebordementEms(parcelle, polygon) {
  // URL de l'API pour récupérer les données de zonage PPRI
  const url = `https://data.strasbourg.eu/api/records/1.0/search/?dataset=ppri-zonage-ipd&q=&geofilter.polygon=${polygon}`;
  return fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {
      // Récupérer tous les enregistrements sans filtrage par nom de zone
      const allRecords = data.records;
      // Fusionner les géométries de toutes les zones
      const mergedGeometry = allRecords.reduce((acc, r) => {
        if (!acc) return r.fields.geo_shape;
        return turf.union(acc, r.fields.geo_shape);
      }, null);
      // Si aucune géométrie n'a été trouvée, retourner false
      if (!mergedGeometry) {
        return false;
      }
      // Calculer l'intersection entre la géométrie fusionnée et la parcelle
      const intersection = turf.intersect(mergedGeometry, parcelle);
      // Vérifier si la parcelle est en contact avec la zone à risque
      const contactAlea = turf.booleanIntersects(
        { type: 'FeatureCollection', features: intersection ? [intersection] : [] },
        parcelle
      );
      return contactAlea;
    })
    .catch(error => {
      // En cas d'erreur, afficher un message dans la console et retourner null
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

function verificationPacDebordementEhnAndlauScheer(parcelle, polygon) {
  const url = `https://data.strasbourg.eu/api/records/1.0/search/?dataset=ppri_eas_inond_debt&q=&geofilter.polygon=${polygon}`;
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
