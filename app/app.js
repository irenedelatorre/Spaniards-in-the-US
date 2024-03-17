// load data
Promise.all([
  // CONSULATES in the US
  d3.csv("./assets/data/cera_consulados.csv", parse.cera_consulates),
  d3.csv("./assets/data/info_consulados.csv", parse.info_consulates),

  // map from https://observablehq.com/@d3/u-s-map
  d3.json("./assets/map/counties-albers-10m.json"),
  // jurisdiction lines
  d3.json("./assets/map/consulate_jurisdictions_borders.json"),
  // jurisdiction polygons
  d3.json("./assets/map/consulate_jurisdictions.json"),
  // californian counties
  d3.csv("./assets/map/californian_counties.csv", parse.counties),

  // total us
  d3.csv("./assets/data/cera_total_us.csv", parse.cera_consulates),

  // us citizens in Spain
  d3.csv("./assets/data/us_citizens_in_spain.csv", parse.us_citizens),

  // quotes
  d3.csv("./assets/data/quotes.csv", parse.quotes),

  // points
  d3.csv("./assets/map/density_pt_by_10.csv", parse.points),
]).then(function (files) {
  const consulates_es = files[0].sort((a, b) => b.census - a.census);
  const consulates_es_info = files[1];

  // map
  const us = files[2];
  const consulate_borders = files[3];
  const consulate_jurisdiction = files[4];
  const ca_counties = files[5];
  const points = files[9];

  const consulates_us_total = files[6].sort((a, b) => a.date - b.date);
  const us_citizens = files[7].sort((a, b) => a.date - b.date);
  const quotes = files[8];

  // add lonlat from consulates_es_info to consulates
  parse.addLonLat(consulates_es, consulates_es_info);

  const consulatesGroup = d3.groups(
    consulates_es_info,
    (g) => g.general_consulate
  );

  const consulatesGroupsTime = d3.groups(consulates_es, (g) => g.consulate_id);

  const totalGroupTime = d3.groups(consulates_us_total, (g) => g.consulate_id);

  const totalUS_inSpain = d3.groups(us_citizens, (g) => g.country);

  // TOTAL
  const dateExtent = d3.extent(consulates_es, (d) => d.date);
  const censusExtent = [0, d3.max(consulates_es, (d) => d.census)];
  const censusTotalExtent = [0, d3.max(consulates_us_total, (d) => d.census)];

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

  // const change_line_US = new smallMultiple({
  //   id: "changeByTimeTotal",
  //   data: totalGroupTime,
  //   type: "line",
  //   dateExtent: dateExtent,
  //   yExtent: censusTotalExtent,
  //   height: 594,
  // });

  // const change_line_US_in_Spain = new smallMultiple({
  //   id: "changeByTimeUSSpain",
  //   data: totalUS_inSpain,
  //   type: "line",
  //   dateExtent: dateExtent,
  //   yExtent: censusExtent,
  //   // yExtent: [0, d3.max(us_citizens, d => d.census)],
  //   height: 594,
  // });

  // const change_line = new smallMultiple({
  //   id: "plotConsulate",
  //   data: consulatesGroupsTime,
  //   type: "line",
  //   dateExtent: dateExtent,
  //   yExtent: censusExtent,
  //   height: 594,
  // });

  // initialize the consulatesInformation
  const consulatesInfo = new ConsulatesInfo({
    data: {
      totalConsulates: consulates_es.filter((d) => d.date >= dateExtent[1]),
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

  // create dropdown with consulates
  const consulatesNames = consulatesGroup.map((d) => d[0]);
  consulatesNames.unshift("All consulates");
  const map_dropdown = new Dropdown({
    data: consulatesNames,
    id: "consulates-list",
    consulatesInfo: consulatesInfo,
    nation_id: "map-nation",
  });

  // update on windows resize
  window.onresize = function () {
    // doesn't need it
    // bar_table.resize();
  };
});
