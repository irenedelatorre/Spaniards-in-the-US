// load data
Promise.all([
    // CONSULATES in the US
    d3.csv("./assets/data/cera_consulados.csv", parse.cera_consulates),
    d3.csv("./assets/data/info_consulados.csv", parse.info_consulates),

    // map from https://observablehq.com/@d3/u-s-map
    d3.json('./assets/map/counties-albers-10m.json'),

    // total us
    d3.csv("./assets/data/cera_total_us.csv", parse.cera_consulates),

    // us citizens in Spain
    d3.csv("./assets/data/us_citizens_in_spain.csv", parse.us_citizens),
])
.then(function(files) {

    const consulates_es = files[0].sort((a, b) => b.census - a.census);
    const consulates_es_info = files[1];
    const us = files[2];
    const consulates_us_total = files[3].sort((a, b) => a.date - b.date);
    const us_citizens = files[4].sort((a, b) => a.date - b.date);

    // add lonlat from consulates_es_info to consulates
    parse.addLonLat(consulates_es, consulates_es_info);

    const consulatesGroup = d3.groups(
        consulates_es_info,
        g => g.general_consulate
    );

    const consulatesGroupsTime = d3.groups(
        consulates_es,
        g => g.consulate_id
    );

    const totalGroupTime = d3.groups(
        consulates_us_total,
        g => g.consulate_id
    );

    const totalUS_inSpain = d3.groups(
        us_citizens,
        g => g.country
    );

    // TOTAL
    const dateExtent = d3.extent(consulates_es, d => d.date);
    const censusExtent = [0, d3.max(consulates_es, d => d.census)];
    const censusTotalExtent = [0, d3.max(consulates_us_total, d => d.census)];

    // create dropdown with consulates
    const consulatesNames = consulatesGroup.map(d => d[0]);
    consulatesNames.unshift("All consulates");
    const map_tooltip = new Dropdown({
        data: consulatesNames,
        id: "consulates-list"
    })
    // create map with information about spanish consulates
    const us_map = new mapConsulates({
        id: "map",
        map: us,
        data: consulates_es,
        info: consulates_es_info,
        groups: consulatesGroup
    });

    const change_line = new smallMultiple({
        id: "changeByTime", 
        data: consulatesGroupsTime,
        type: "line",
        dateExtent: dateExtent,
        yExtent: censusExtent,
        height: 594
    });

    const change_line_US = new smallMultiple({
        id: "changeByTimeTotal", 
        data: totalGroupTime,
        type: "line",
        dateExtent: dateExtent,
        yExtent: censusTotalExtent,
        height: 594
    });

    
    const change_line_US_in_Spain = new smallMultiple({
        id: "changeByTimeUSSpain", 
        data: totalUS_inSpain,
        type: "line",
        dateExtent: dateExtent,
        yExtent: censusExtent,
        // yExtent: [0, d3.max(us_citizens, d => d.census)],
        height: 594
    });

    // update on windows resize
    window.onresize = function() {

        // doesn't need it 
        // bar_table.resize();
    };

})