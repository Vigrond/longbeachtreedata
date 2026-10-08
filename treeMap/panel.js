import trees from "/treedata/trees.json" with { type: "json" };

const filtersTab = document.getElementById("filters_button");
const filtersPanel = document.getElementById("filters_panel");
const infoTab = document.getElementById("information_button");
const infoPanel = document.getElementById("info_panel");
const metricsTab = document.getElementById("metrics_button");
const metricsPanel = document.getElementById("metrics_panel");
const benefitsTab = document.getElementById("benefits_button");
const benefitsPanel = document.getElementById("benefits_panel");

/* TAB CLICK EVENTS */
function tabToggle(clicked, other, clickedPanel, otherPanel) {
  if (other.classList.contains("active_tab")) {
    other.classList.remove("active_tab");
    otherPanel.style.display = "none";
    clicked.classList.add("active_tab");
    clickedPanel.style.display = "block";
  }
}

filtersTab.onclick = () => {
  tabToggle(filtersTab, infoTab, filtersPanel, infoPanel);
};

infoTab.onclick = () => {
  tabToggle(infoTab, filtersTab, infoPanel, filtersPanel);
};

benefitsTab.onclick = () => {
  tabToggle(benefitsTab, metricsTab, benefitsPanel, metricsPanel);
};

metricsTab.onclick = () => {
  tabToggle(metricsTab, benefitsTab, metricsPanel, benefitsPanel);
};

const neighborhoodSelect = document.getElementById("neighborhood_select");
const speciesSelect = document.getElementById("species_select");

/* Load metrics and benefits data */
let benefitsSummary = trees.summary;
let neighborhoodCounts = Object.entries(trees.neighborhoods).map((n) => [
  n[0],
  n[1].summary.count,
]);
neighborhoodCounts.sort((a, b) => b[1] - a[1]);

function decimalDisplay(num) {
  return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function dollarDisplay(num) {
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

/* Populate neighborhood and species dropdowns */
let speciesNames = Object.keys(trees.summary.tree_names).sort();
let neighborhoodNames = Object.keys(trees.neighborhoods).sort();

speciesNames.forEach((s) => {
  let option = document.createElement("option");
  option.text = option.value = option.key = s;
  speciesSelect.appendChild(option);
});

neighborhoodNames.forEach((n) => {
  let option = document.createElement("option");
  option.text = option.value = option.key = n;
  neighborhoodSelect.appendChild(option);
});

/* METRICS TAB */

function neighborhoodsChart() {
  let maxCount = neighborhoodCounts[0][1];
  let chart = ``;
  neighborhoodCounts.map((n) => {
    chart =
      chart +
      `<div key=${n[0]}} class="neighborhood_row">
      <div class="name">${n[0]}</div>
      <div class="count">${decimalDisplay(n[1].toLocaleString())}</div>
      <div class="bar_space">
      <div class="bar" style="width: ${(n[1] / maxCount) * 100}%"></div>
      </div>
    </div>`;
  });

  return chart;
}

document.getElementById("metrics_panel").innerHTML = `
  <div class="title">${i18next.t("filter_pane.metrics.total_trees")}</div>
  <div class="options">${decimalDisplay(benefitsSummary.count)}</div>

  <div class="title">${i18next.t("filter_pane.metrics.common_species")}</div>
  <div class="options">
    ${
      benefitsSummary.most_common_tree.scientific_name +
      " (" +
      benefitsSummary.most_common_tree.name +
      ")"
    }
  </div>

<div class="title">${i18next.t("filter_pane.metrics.common_count")}</div>
  <div class="options">
    ${
      decimalDisplay(benefitsSummary.most_common_tree.count) +
      " (" +
      decimalDisplay(benefitsSummary.most_common_tree.percentage * 100) +
      "%)"
    }
  </div>
<div class="title">${i18next.t("filter_pane.metrics.num_by_neighborhood")}</div>
<div id="neighborhood_chart" class="neighborhoods_chart">
${neighborhoodsChart()}
</div>
`;

/* BENEFITS TAB */
document.getElementById("benefits_panel").innerHTML = `
  <div class="title">${i18next.t("filter_pane.benefits.total_benefits")}</div>
  <div class="options">${
    dollarDisplay(benefitsSummary.total_benefits_dollars) +
    " " +
    i18next.t("filter_pane.benefits.per_year")
  }</div>

  <div class="title">${i18next.t(
    "filter_pane.benefits.pollution_removal"
  )}</div>
  <div class="options">${
    decimalDisplay(benefitsSummary.pollution_removal_tons) +
    " " +
    i18next.t("filter_pane.benefits.tons_per_year")
  }</div>
  <div class="options">${
    dollarDisplay(benefitsSummary.pollution_removal_dollars) +
    " " +
    i18next.t("filter_pane.benefits.per_year")
  }</div>

  <div class="title">${i18next.t("filter_pane.benefits.carbon_storage")}</div>
  <div class="options">${
    decimalDisplay(benefitsSummary.carbon_storage_lbs / 2000) +
    " " +
    i18next.t("filter_pane.benefits.tons_per_year")
  }</div>
  <div class="options">${
    dollarDisplay(benefitsSummary.carbon_storage_dollars) +
    " " +
    i18next.t("filter_pane.benefits.per_year")
  }</div>

  <div class="title">${i18next.t(
    "filter_pane.benefits.carbon_sequestration"
  )}</div>
  <div class="options">${
    decimalDisplay(benefitsSummary.carbon_sequestration_lbs / 2000) +
    " " +
    i18next.t("filter_pane.benefits.tons_per_year")
  }</div>
  <div class="options">${
    dollarDisplay(benefitsSummary.carbon_sequestration_dollars) +
    " " +
    i18next.t("filter_pane.benefits.per_year")
  }</div>

  <div class="title">${i18next.t("filter_pane.benefits.avoided_runoff")}</div>
  <div class="options">${
    decimalDisplay(benefitsSummary.avoided_runoff_cubic_ft) +
    " " +
    i18next.t("filter_pane.benefits.cu_ft_per_year")
  }</div>
  <div class="options">${
    dollarDisplay(benefitsSummary.avoided_runoff_dollars) +
    " " +
    i18next.t("filter_pane.benefits.per_year")
  }</div>

  <div class="title">${i18next.t(
    "filter_pane.benefits.oxygen_production"
  )}</div>
  <div class="options">${
    decimalDisplay(benefitsSummary.oxygen_production_tons) +
    " " +
    i18next.t("filter_pane.benefits.tons_per_year")
  }</div>

  <div class="title">${i18next.t(
    "filter_pane.benefits.replacement_value"
  )}</div>
  <div class="options">${
    dollarDisplay(benefitsSummary.replacement_value_dollars) +
    " " +
    i18next.t("filter_pane.benefits.per_year")
  }</div>
`;
