// load data
Promise.all([
    // CONSULATES in the US
    d3.csv("./assets/data/cera_consulados.csv", parse.cera_consulates),
    d3.csv("./assets/data/info_consulados.csv", parse.info_consulates),

    // map from https://observablehq.com/@d3/u-s-map
    d3.json('./assets/map/counties-albers-10m.json'),
])
.then(function(files) {

    const consulates_es = files[0];
    const consulates_es_info = files[1];
    const us = files[2];

    // add lonlat from consulates_es_info to consulates
    parse.addLonLat(consulates_es, consulates_es_info);

    console.log(consulates_es, consulates_es_info);

    const consulatesGroup = d3.groups(
        consulates_es_info,
        g => g.general_consulate
    );

    const consulatesGroups = d3.groups(
        consulates_es,
        g => g.consulate
    );

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
        data: consulatesGroups,
    })

    // update on windows resize
    window.onresize = function() {

        // doesn't need it 
        // bar_table.resize();
    };

})