import trees from "../treedata/trees.json" with { type: "json" };
import { treePopup, vacantSitePopup } from "./popups.js";

const map = initializeMap();
const canvasRenderer = L.canvas({ padding: 0.5 });
var allYoungTrees = [];
var allOtherTrees = [];
var allPrivateTrees = [];
var allVacantSites = [];
var currentDisplayLayer;
var markerClusterGroup = L.markerClusterGroup({
  spiderfyOnMaxZoom: false,
  showCoverageOnHover: false,
  chunkedLoading: true,
  disableClusteringAtZoom: 15,
});

// On first render, load all data and display only young trees
processAllDataOnLoad();

addMarkersToMap(allYoungTrees);

function initializeMap() {
  let config = {
    minZoom: 12,
    maxZoom: 18,
    preferCanvas: true,
  };
  // Long Beach, CA coordinates
  const lat = 33.807948;
  const lng = -118.154467;
  const zoom = 12;
  const map = L.map("map", config).setView([lat, lng], zoom);

  L.tileLayer(
    "https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}",
    {
      attribution:
        '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      accessToken:
        "adVaQK2QoeYxUg2MZXvS6KtyFzrDfCfqVdqhfeSHTTvu9cCHWIwRQtKwjAgd0TCA",
    }
  ).addTo(map);
  return map;
}

function isTree(mapItem) {
  return mapItem.hasOwnProperty("species");
}

function isPrivate(mapItem) {
  return mapItem.hasOwnProperty("priv");
}

// Determine if tree is <= 4 y.o. from today's date
function isYoungTree(tree) {
  if (tree.date_planted != "") {
    let today = new Date();
    let tree_date = new Date(tree.date_planted);
    let diff = (today - tree_date) / (1000 * 3600 * 24 * 365);
    if (diff < 5) {
      return true;
    }
  }
  return false;
}

function processAllDataOnLoad() {
  const neighborhoods = Object.values(trees.neighborhoods);
  for (let i = 0; i < neighborhoods.length; i++) {
    // Young trees are automatically sorted into their own list
    allOtherTrees.push(...processItems(neighborhoods[i].public_trees));
    allPrivateTrees.push(...processItems(neighborhoods[i].private_trees, true));
    allVacantSites.push(...processItems(neighborhoods[i].vacant_lots));
  }
}

// Process items from a single neighborhood set. If trees,
// add trees that need help to the top of the set
// to make them generally more easily visible.
// If trees and contains trees younger than 4 y.o.,
// return them in the second return value.
function processItems(set, priv = false) {
  if (set.length > 0) {
    let result = [];
    let tempTopLayer = [];
    for (let j = 0; j < set.length; j++) {
      let item = set[j];
      // Add a private field to private trees for easy coloring
      if (priv) {
        item.priv = true;
      }
      if (isTree(item) && item.health == "Needs Help") {
        tempTopLayer.push(item);
      } else if (
        isTree(item) &&
        item.date_planted !== "" &&
        isYoungTree(item) &&
        !priv
      ) {
        allYoungTrees.push(item);
      } else {
        result.push(item);
      }
    }
    result.push(...tempTopLayer);
    return result;
  } else return [];
}

function addMarkersToMap(markersToAdd) {
  let markers = [];
  for (let i = 0; i < markersToAdd.length; i++) {
    markers.push(createMarker(markersToAdd[i]));
  }

  // Add/change leaflet's displayed layer
  if (currentDisplayLayer) {
    map.removeLayer(currentDisplayLayer);
    markerClusterGroup.clearLayers();
  }
  let newLayerGroup = markerClusterGroup.addLayers(markers);
  newLayerGroup.addTo(map);
  currentDisplayLayer = newLayerGroup;
  return newLayerGroup;
}

function createMarker(mapItem) {
  let marker = L.circleMarker([mapItem.lat, mapItem.long], {
    renderer: canvasRenderer,
  });
  marker.setStyle({
    radius: 7,
    weight: 0.75,
    fillOpacity: 1,
  });
  if (isTree(mapItem)) {
    marker.bindPopup(treePopup(mapItem));
    if (isPrivate(mapItem)) {
      // Private trees are YELLOW
      marker.setStyle({ color: "#E49B0F", fillColor: "#FFBF00" });
    } else if (mapItem.health == "Needs Help") {
      // Trees needing help are RED
      marker.setStyle({ color: "#F88379", fillColor: "#C41E3A" });
    }
    // Young trees are LIGHT GREEN
    else if (isYoungTree(mapItem)) {
      marker.setStyle({ color: "#228B22", fillColor: "#7CFC00" });
    } else {
      // All other trees are DARK GREEN
      marker.setStyle({ color: "#AFE1AF", fillColor: "#228B22" });
    }
  } else {
    marker.bindPopup(vacantSitePopup(mapItem));
    marker.setStyle({ color: "#2976e3", fillColor: "#0047AB" });
  }
  return marker;
}

/* FILTERING */

// Event handlers for filter toggles
const neighborhoodSelect = document.getElementById("neighborhood_select");
const speciesSelect = document.getElementById("species_select");
const newlyPlantedNew = document.getElementById("newly_planted_new");
const newlyPlantedAll = document.getElementById("newly_planted_all");
const privateShow = document.getElementById("private_show");
const privateHide = document.getElementById("private_hide");
const vacantShow = document.getElementById("vacant_show");
const vacantHide = document.getElementById("vacant_hide");
neighborhoodSelect.onchange = () => applyFilters();
speciesSelect.onchange = () => applyFilters();
newlyPlantedAll.onchange = () => applyFilters();
newlyPlantedNew.onchange = () => applyFilters();
privateShow.onchange = () => applyFilters();
privateHide.onchange = () => applyFilters();
vacantShow.onchange = () => applyFilters();
vacantHide.onchange = () => applyFilters();

function applyFilters() {
  // memoize by checking if this configuration has been worked out before
  let filtersState = [
    neighborhoodSelect.value,
    speciesSelect.value,
    newlyPlantedNew.checked,
    newlyPlantedAll.checked,
    privateShow.checked,
    privateHide.checked,
    vacantShow.checked,
    vacantHide.checked,
  ];

  // todo: save state and resulting filter output to cache
  filter();
}

function filter() {
  let set = [];
  // Filters for trees
  if (newlyPlantedNew.checked) {
    set = [...allYoungTrees];
  } else {
    set = [...allYoungTrees, ...allOtherTrees];
  }
  if (privateShow.checked) {
    set.push(...allPrivateTrees);
  }
  if (speciesSelect.value !== "all") {
    set = set.filter((t) => t.common_name == speciesSelect.value);
  }

  // Add vacant sites if applicable
  if (vacantShow.checked) {
    set.push(...allVacantSites);
  }

  // Then filter all by neighborhood
  if (neighborhoodSelect.value !== "all") {
    set = set.filter((e) => e.neighborhood == neighborhoodSelect.value);
  }

  return addMarkersToMap(set);
}
