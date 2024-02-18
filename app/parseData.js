const parse = {
    cera_consulates: function(d){
        return {
            country_id: d.pais_id === "NA" ? 302 : +d.pais_id,
            consulate_id: +d.consulado_id,
            consulate: d.consulado,
            date: new Date(`${d.month}-01-${d.year}`),
            census: +d.censo,
            year: +d.year,
            month: +d.month
        };
    },

    info_consulates: function(d){
        return {
            consulate_id: +d.consulado_id,
            general_consulate: d["Consulado general"],
            address: d.Direccion,
            lonlat: [+d.Longitud, +d.Latitud],
            jurisdiction: d.Jurisdiccion,
            county: d.Condado
        }
    },

    addLonLat: function(consulates, info) {
        consulates.forEach( d => {
            const thisConsulate = info.filter(
                e => e.consulate_id === d.consulate_id
            );
            d.lonlat = thisConsulate[0].lonlat;
        })
    },

    us_citizens: function(d) {
        return {
            year: +d.year,
            country: 'Spain',
            consulate: 'US citizens in Spain',
            date: new Date(`1-1-${d.year}`),
            census: +d.censo
        }
    }
}