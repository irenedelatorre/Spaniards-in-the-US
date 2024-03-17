const parse = {
  cera_consulates: function (d) {
    return {
      country_id: d.pais_id === "NA" ? 302 : +d.pais_id,
      consulate_id: +d.consulado_id,
      consulate: parse.change_es_to_en(d.consulado),
      date: new Date(`${d.month}-01-${d.year}`),
      census: +d.censo,
      year: +d.year,
      month: +d.month,
    };
  },

  info_consulates: function (d) {
    return {
      consulate_id: +d.consulado_id,
      general_consulate: parse.change_es_to_en(d["Consulado general"]),
      address: d.Direccion,
      lonlat: [+d.Longitud, +d.Latitud],
      jurisdiction: d.Jurisdiccion,
      county: d.Condado,
    };
  },

  counties: function (d) {
    return {
      name: d.name,
      id: +d.id_n,
    };
  },

  addLonLat: function (consulates, info) {
    consulates.forEach((d) => {
      const thisConsulate = info.filter(
        (e) => e.consulate_id === d.consulate_id
      );
      d.lonlat = thisConsulate[0].lonlat;
    });
  },

  points: function (d) {
    return {
      consulate: parse.change_es_to_en(d["info_consulados_Consulado general"]),
      xy: [+d.X, +d.Y],
    };
  },

  us_citizens: function (d) {
    return {
      year: +d.year,
      country: "Spain",
      consulate: "US citizens in Spain",
      date: new Date(`1-1-${d.year}`),
      census: +d.censo,
    };
  },

  quotes: function (d) {
    return {
      quote: d.Frase,
      author: d.Firma,
      consulate: parse.change_es_to_en(d.Consulado),
    };
  },

  change_es_to_en: function (es) {
    let name = es;
    if (es === "Nueva York") {
      name = "New York";
    } else if (es === "NUEVA YORK") {
      name = "NEW YORK";
    } else if (es === "Nueva Orleans") {
      name = "New Orleans";
    } else if (es === "NUEVA ORLEANS") {
      name = "NEW ORLEANS";
    } else if (es === "Puerto Rico") {
      name = "San Juan de Puerto Rico";
    } else if (es === "PUERTO RICO") {
      name = "SAN JUAN DE PUERTO RICO";
    } else if (es === "SAN JUAN PUERTO RICO") {
      name = "SAN JUAN DE PUERTO RICO";
    }

    return name;
  },
};
