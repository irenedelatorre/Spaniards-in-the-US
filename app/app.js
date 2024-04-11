// load data
Promise.all([
  // CONSULATES in the US
  d3.csv("./assets/data/cera_consulados.csv", parse.cera_consulates),
  d3.csv("./assets/data/info_consulados.csv", parse.info_consulates),

  // map from https://observablehq.com/@d3/u-s-map
  d3.json("./assets/map/counties-albers-10m.json"),
  // jurisdiction lines
  d3.json("./assets/map/consulate_jurisdictions_borders.json"),

  // californian counties
  d3.csv("./assets/map/californian_counties.csv", parse.counties),

  // total us
  d3.csv("./assets/data/cera_total_us.csv", parse.cera_consulates),

  // quotes
  d3.csv("./assets/data/quotes.csv", parse.quotes),

  // points
  d3.csv("./assets/map/density_pt_by_10.csv", parse.points),

  // area chart
  d3.csv("./assets/data/translation.csv", parse.translation),
  d3.csv("./assets/data/total_by_country.csv", parse.countryData),
]).then(function (files) {
  const consulates_es = files[0].sort((a, b) => b.census - a.census);
  const consulates_es_info = files[1];

  // map
  const us = files[2];
  const consulate_borders = files[3];
  const ca_counties = files[4];
  const points = files[7];

  // const
  const quotes = files[6];

  // area chart
  const dictionary = files[8];
  const country_data = files[9];

  // MANAGE AND TRANSFORM DATA //
  // add lonlat from consulates_es_info to consulates
  parse.addLonLat(consulates_es, consulates_es_info);
  const consulatesGroup = d3.groups(
    consulates_es_info,
    (g) => g.general_consulate
  );

  const consulatesGroupsTime = d3.groups(consulates_es, (g) => g.consulate_id);

  // TOTAL
  const dateExtent = d3.extent(consulates_es, (d) => d.date);
  const censusExtent = [0, d3.max(consulates_es, (d) => d.census)];

  // AREA
  // add translation to array
  parse.translate(country_data, dictionary);

  // create map with information about spanish consulates
  const us_map = new mapConsulates({
    id: "map-nation",
    map: us,
    data: consulates_es,
    info: consulates_es_info,
    groups: consulatesGroup,
    ca_counties: ca_counties,
    consulate_borders: consulate_borders,
    pts: points,
    type: "nation",
  });

  // initialize the consulatesInformation
  const totalConsulates = consulates_es.filter((d) => d.date >= dateExtent[1]);
  const consulatesInfo = new ConsulatesInfo({
    data: {
      totalConsulates: totalConsulates,
      infoConsulates: consulatesGroup,
      quotes: quotes,
      byConsulate: consulatesGroupsTime,
    },
    plot: {
      id: "plotConsulate",
      dateExtent: dateExtent,
      yExtent: censusExtent,
      height: 250,
    },
    id_number: "number",
    id_consulate: "consulate",
    id_quote: "quote",
    id_author: "author",
    id_jurisdiction: "jurisdiction",
  });

  // create map only for one state at a time
  const jur_map = new mapConsulates({
    id: "map-jurisdiction",
    map: us,
    data: consulates_es,
    info: consulates_es_info,
    groups: consulatesGroup,
    ca_counties: ca_counties,
    consulate_borders: consulate_borders,
    pts: points,
    type: "jurisdiction",
    div_height: 450,
    div_width: 650,
  });

  // create dropdown with consulates
  const consulatesNames = consulatesGroup.map((d) => d[0]);
  consulatesNames.unshift("All consulates");
  const map_dropdown = new Dropdown({
    data: consulatesNames,
    id: "consulates-list",
    consulatesInfo: consulatesInfo,
    nation_map: us_map,
    jur_map: jur_map,
    nation_id: "map-nation",
    info_id: "visuals-consulate",
  });

  // create area chart
  const label_n_sp = d3.sum(
    country_data.filter((d) => d.year === 2023 && d.month === 12),
    (d) => d.census
  );

  const area_by_country = new areaChart({
    data: country_data,
    dateExtent: d3.extent(country_data, (d) => d.date),
    id: "spaniards-living-abroad",
    stack: "country",
    label_n: label_n_sp,
    label_text: "live abroad",
  });

  const label_n_us = d3.sum(
    consulates_es.filter((d) => d.year === 2023 && d.month === 12),
    (d) => d.census
  );

  const area_by_state = new areaChart({
    data: consulates_es,
    dateExtent: d3.extent(consulates_es, (d) => d.date),
    id: "spaniards-living-us",
    stack: "consulate",
    label_n: label_n_us,
    label_text: "live in the US",
  });

  // update on windows resize
  window.onresize = function () {
    // consulatesInfo.redrawChart();
    area_by_country.updateChart();
    area_by_state.updateChart();
  };
});
