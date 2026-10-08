export function treePopup(tree) {
  return `
<div class='popup'>
<div class="tooltip-title">${i18next.t("tree_popup.public_tree")}</div>
${entry(i18next.t("tree_popup.species"), tree.species)}
${entry(i18next.t("tree_popup.common_name"), tree.common_name)}
${entry(i18next.t("tree_popup.neighborhood"), tree.neighborhood)}
${entry(i18next.t("tree_popup.street_address"), tree.street_address)}
${entry(i18next.t("tree_popup.funded_by"), tree.funded_by)}
${entry(i18next.t("tree_popup.planted_by"), tree.planted_by)}
${entry(i18next.t("tree_popup.grow_space"), tree.grow_space)}
${entry(i18next.t("tree_popup.date_planted"), tree.date_planted)}
${
  tree.health == "Needs Help"
    ? `<div class="heading help">
    ${i18next.t("tree_popup.needs_help")}
    </div>`
    : ``
}
    <div class="heading">${i18next.t("tree_popup.report_issue")}</div>
    <a href="${treeReportLink(tree.id)}" target="_blank" >${i18next.t(
    "tree_popup.click_to_report"
  )}</a>
</div>
`;
}

export function vacantSitePopup(site) {
  return `
<div class='popup'>
    <div class="tooltip-title">${i18next.t("tree_popup.vacant_site")}</div>

${entry(i18next.t("tree_popup.neighborhood"), site.neighborhood)}
${entry(i18next.t("tree_popup.street_address"), site.street_address)}
</div>
`;
}

function entry(heading, field) {
  return `<div>
      <div class="heading">${heading}</div>
      <div class="data">
        ${
          field === "" || field === " "
            ? `<em>${i18next.t("tree_popup.unknown")}</em>`
            : field
        }
      </div>
    </div>`;
}

function treeReportLink(treeId) {
  return (
    "https://docs.google.com/forms/d/e/1FAIpQLSee-2oPtsiJY6v_YqsAcOy_-Z9-mkvI43hyB3rcNKx86Y_YCw/viewform?usp=pp_url&entry.1908668307=" +
    +treeId
  );
}
