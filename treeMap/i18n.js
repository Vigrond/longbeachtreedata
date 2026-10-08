import english from "./map-i18n/english.json" with { type: "json" };
import spanish from "./map-i18n/spanish.json" with { type: "json" };
import tagalog from "./map-i18n/tagalog.json" with { type: "json" };
import vietnamese from "./map-i18n/vietnamese.json" with { type: "json" };

var lang = window.location.search.substring(1).split("=")[1];

i18next.init({
  lng: lang,
  resources: {
    en: {
      translation: english,
    },
    es: {
      translation: spanish,
    },
    tl: {
      translation: tagalog,
    },
    vi: {
      translation: vietnamese,
    },
  },
  fallbackLng: "en",
});

function localize(id, key) {
  document.getElementById(id).innerText = i18next.t(key);
}

localize("map_pane_title", "filter_pane.title");
localize("filters_button", "filter_pane.filters.title");
localize("information_button", "filter_pane.information.title");
localize("filter_neighborhood", "filter_pane.filters.neighborhood.title");
localize("neighborhood_all", "filter_pane.filters.all");
localize("filter_species", "filter_pane.filters.species.title");
localize("species_all", "filter_pane.filters.all");
localize("newly_planted", "filter_pane.filters.newly_planted.title");
localize("new_label", "filter_pane.filters.newly_planted.new");
localize("all_label", "filter_pane.filters.newly_planted.all");
localize("private", "filter_pane.filters.private_trees.title");
localize("private_show_label", "filter_pane.filters.private_trees.show");
localize("private_hide_label", "filter_pane.filters.private_trees.hide");
localize("vacant", "filter_pane.filters.vacant_sites.title");
localize("vacant_show_label", "filter_pane.filters.vacant_sites.show");
localize("vacant_hide_label", "filter_pane.filters.vacant_sites.hide");
localize("submit_button", "filter_pane.information.submit");

let infoBlurb = `
  ${i18next.t("filter_pane.information.description.0")} 
  <a target="_blank" rel="noopener noreferrer" href="https://www.longbeach.gov/sustainability/">
   ${i18next.t("filter_pane.information.office_of_sustainability")} 
  </a>
  ${i18next.t("filter_pane.information.description.1")} 
  <a target="_blank" rel="noopener noreferrer" href="https://www.cclb-corps.org/">
    ${i18next.t("filter_pane.information.conservation_corps")}
    ${i18next.t("filter_pane.information.description.2")}
  </a>
  <br />
  <br />
  ${i18next.t("filter_pane.information.description.3")}
  <br />
`;
document.getElementById("info_blurb").innerHTML = infoBlurb;

localize("metrics_button", "filter_pane.metrics.title");
localize("benefits_button", "filter_pane.benefits.title");
