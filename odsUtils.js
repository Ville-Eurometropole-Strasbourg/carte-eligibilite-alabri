/**
 * Convertit une géométrie en format de polygone OpenDataSoft.
 * 
 * @function geomToOdsPolygon
 * @param {Object} geometry - La géométrie à convertir (compatible avec Turf.js).
 * @returns {string} Une chaîne de caractères représentant le polygone au format attendu par l'API d'OpenDataSoft.
 * 
 * @description
 * Cette fonction prend une géométrie et la convertit en une représentation de polygone
 * compatible avec l'API d'OpenDataSoft. Elle utilise la boîte englobante (bounding box) de
 * la géométrie pour créer un rectangle simplifié.
 * 
 * Le processus de conversion est le suivant :
 * 1. Extraction de la boîte englobante (bbox) de la géométrie.
 * 2. Création des quatre coins du rectangle à partir de la bbox.
 * 3. Construction d'une chaîne de caractères représentant le polygone au format OpenDataSoft.
 * 
 * @example
 * const geometry = turf.polygon([[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]);
 * const odsPolygon = geomToOdsPolygon(geometry);
 * console.log(odsPolygon);
 * // Output: "(1, 0), (1, 1), (0, 1), (0, 0)"
 * 
 * @requires turf - La bibliothèque Turf.js doit être disponible dans l'environnement.
 * 
 * @note
 * - La fonction suppose que la géométrie en entrée est valide et compatible avec Turf.js.
 * - Le polygone résultant est toujours un rectangle, ce qui peut simplifier la géométrie originale.
 * - L'ordre des coordonnées dans le polygone résultant est : haut-gauche, haut-droite, bas-droite, bas-gauche.
 */
function geomToOdsPolygon(geometry) {
    // Extraction de la bbox (boîte englobante) de la géométrie
    // La bbox est un tableau de 4 valeurs : [minLng, minLat, maxLng, maxLat]
    const bbox = turf.bbox(geometry);

    // Extraction des coordonnées depuis la bbox
    // On déstructure le tableau bbox pour obtenir les valeurs individuelles
    const [minLng, minLat, maxLng, maxLat] = bbox;
    
    // Création des points pour chaque coin du rectangle
    // Note : L'ordre est important pour le format OpenDataSoft
    const topLeft = [maxLat, minLng];
    const topRight = [maxLat, maxLng];
    const bottomRight = [minLat, maxLng];
    const bottomLeft = [minLat, minLng];
    
    // Retourne la chaîne de caractères du polygone au format OpenDataSoft
    const polygon = `(${topLeft[0]}, ${topLeft[1]}), (${topRight[0]}, ${topRight[1]}), (${bottomRight[0]}, ${bottomRight[1]}), (${bottomLeft[0]}, ${bottomLeft[1]})`;
    
    return polygon;
}

/**
 * Récupère les informations de la parcelle cadastrale à partir des coordonnées géographiques.
 * 
 * @param {number} lat - Latitude du point.
 * @param {number} lng - Longitude du point.
 * @returns {Promise<Object|string>} Un objet contenant l'ID et la forme géométrique de la parcelle, ou "N/A" si non trouvé.
 */
function recupererParcelle(lat, lng) {
    // Construit l'URL de l'API du cadastre de Strasbourg avec les coordonnées
    const cadApiUrl = `https://data.strasbourg.eu/api/records/1.0/search/?dataset=parcelles_cadastrales&q=&geofilter.distance=${lat}%2C${lng}%2C1`;

    // Effectue la requête à l'API
    return fetch(cadApiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Vérifie si des résultats ont été trouvés
        if (data.records && data.records.length > 0) {
          // Extrait l'ID et la forme géométrique de la parcelle
          const parcelleId = data.records[0].fields.id_parcellaire;
          const parcelleGeo = data.records[0].fields.geo_shape;
          return { id_parcellaire: parcelleId, geo_shape: parcelleGeo };
        } else {
          // Retourne "N/A" si aucune parcelle n'est trouvée
          return "N/A";
        }
      })
      .catch((error) => {
        // Gère les erreurs de requête
        console.error(
          "Une erreur s'est produite lors de la récupération des données du cadastre :",
          error
        );
        return "N/A";
      });
  }