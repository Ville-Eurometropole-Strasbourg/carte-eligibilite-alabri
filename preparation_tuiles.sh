mkdir tmp
curl -o tmp/ppri-zonage-rn-zone-verte.geojson https://data.strasbourg.eu/api/explore/v2.1/catalog/datasets/ppri-zonage-rn/exports/geojson?refine=nom%3A%22Zone%20verte%22
curl -o tmp/ppri-zonage-rn-zone-vert-clair.geojson https://data.strasbourg.eu/api/explore/v2.1/catalog/datasets/ppri-zonage-rn/exports/geojson?refine=nom%3A%22Zone%20vert%20clair%22
curl -o tmp/ppri-zonage-ipd.geojson https://data.strasbourg.eu/api/explore/v2.1/catalog/datasets/ppri-zonage-ipd/exports/geojson
curl -o tmp/ppri-bruche-ipd.geojson https://data.strasbourg.eu/api/explore/v2.1/catalog/datasets/ppri_bruche_ipd_zonage/exports/geojson
curl -o tmp/ppri-zonage-pac-eas.geojson https://data.strasbourg.eu/api/explore/v2.1/catalog/datasets/ppri_eas_inond_debt/exports/geojson

tippecanoe -zg -o zonesinondables.mbtiles --coalesce-densest-as-needed --extend-zooms-if-still-dropping zonesinondables.geojson
pmtiles convert zonesinondables.mbtiles zonesinondables.pmtiles
