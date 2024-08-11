import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';

// Inicialización del mapa
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: fromLonLat([-102.5528, 23.6345]), // Coordenadas aproximadas del centro de México
    zoom: 5
  })
});

// Capa de límites municipales de México
const limitesMunLayer = new VectorLayer({
  source: new VectorSource({
    url: '/limites_mun.geojson', // Ruta a la capa
    format: new GeoJSON()
  })
});

// Añadir la capa al mapa
map.addLayer(limitesMunLayer);

// Creación de un overlay para mostrar los nombres de los municipios
const overlay = new Overlay({
  element: document.getElementById('popup'),
  positioning: 'bottom-center',
  stopEvent: false
});
map.addOverlay(overlay);

// Función para mostrar el nombre del municipio al hacer clic
map.on('singleclick', function (event) {
  map.forEachFeatureAtPixel(event.pixel, function (feature) {
    const municipalityName = feature.get('ESTADO'); // Extraer el nombre del municipio
    if (municipalityName) {
      const coordinate = event.coordinate;
      overlay.setPosition(coordinate);
      const element = overlay.getElement();
      element.innerHTML = municipalityName;
      element.style.display = 'block';
    }
  });
});

// Ocultar el popup si se hace clic en otro lugar
map.on('pointermove', function () {
  const element = overlay.getElement();
  element.style.display = 'none';
});

// Función para cargar dinámicamente las capas en el selector
async function loadGeoJSONFiles() {
  try {
    const response = await fetch('/geojson'); // Cambiar a la ruta correcta si es necesario
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.status);
    }
    const fileList = await response.json(); // Suponiendo que el servidor devuelve una lista en formato JSON

    const layerSelect = document.getElementById('layer-select');
    layerSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona una capa';
    layerSelect.appendChild(defaultOption);

    fileList.forEach(file => {
      const option = document.createElement('option');
      option.value = file;
      option.textContent = file;
      layerSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error cargando archivos GeoJSON:', error);
  }
}

loadGeoJSONFiles();

// Añadir un evento al selector de capas
document.getElementById('layer-select').addEventListener('change', function (event) {
  const selectedLayer = event.target.value;
  if (selectedLayer) {
    limitesMunLayer.getSource().setUrl(`/${selectedLayer}`); // Ruta ajustada
  }
});



