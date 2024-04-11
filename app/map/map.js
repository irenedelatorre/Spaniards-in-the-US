class mapConsulates {
  constructor(item) {
    this.id = item.id;
    this.map = item.map;
    this.data = item.data;
    this.info = item.info;
    this.groups = item.groups.filter((d) => d[0] !== "New Orleans");
    this.ca_counties = item.ca_counties;
    this.consulate_borders = item.consulate_borders;
    this.type = item.type;
    this.pts = item.pts;
    this.selectPlot = d3.select(`#${this.id}`);
    this.year = d3.max(this.data, (d) => d.year);

    this.div_width = !item.div_width
      ? document.getElementById(this.id).clientWidth
      : item.div_width;
    this.div_height = !item.div_height
      ? document.getElementById(this.id).clientHeight
      : item.div_height;
    this.consulate = "All";

    this.init();
    if (this.type === "nation") {
      this.createSVG();
      this.drawUS();
    }
  }

  init() {
    this.margin = { t: 40, l: 20, r: 20, b: 40 };

    this.width = this.div_width - this.margin.r - this.margin.l;
    this.height = this.div_height - this.margin.t - this.margin.b;

    this.transformations();

    //projection
    this.projection = projection
      .geoAlbersUsaPr()
      .scale(this.scale)
      .translate(this.translate);

    // function to draw the map
    this.path = d3.geoPath().projection(this.projection);

    this.boundingBoxUsPx = this.path.bounds(this.boundingBoxUs);

    this.californian_counties = this.getCaCounties();

    this.createJurisdictions();

    if (this.type === "nation") {
      this.layers = [
        "nation",
        "jurisdiction-polygons",
        "points",
        "counties",
        "states",
        "nation",
        "jurisdiction-borders",
        "jurisdiction-borders",
        "consulates",
        "consulates",
      ];
    } else if (this.type !== "nation") {
      this.layers = [
        "states",
        "jurisdiction-polygons",
        "points",
        "counties",
        "states",
        "jurisdiction-polygons",
        "jurisdiction-borders",
        "jurisdiction-borders",
        "consulates",
        "consulates",
      ];
    }
  }

  getScale() {
    const this_scaleHeight = d3
      .scaleLinear()
      .domain([250, 520, 610, 747])
      .range([400, 1000, 1300, 1400]);
    return this_scaleHeight(this.div_height);
  }

  transformations() {
    this.scale = this.getScale();

    this.translate = [this.width / 2, this.height / 2];
    if (this.type !== "nation" && this.consulate === "Boston") {
      this.scale = 5200;
      this.translate = [-this.width * 2.2, this.height * 2.4];
    } else if (this.type !== "nation" && this.consulate === "New York") {
      this.scale = 5000;
      this.translate = [-this.width * 1.7, this.height * 1.55];
    } else if (this.type !== "nation" && this.consulate === "Chicago") {
      this.scale = 2000;
      this.translate = [this.width * 0.3, this.height * 0.8];
    } else if (this.type !== "nation" && this.consulate === "Houston") {
      this.scale = 1600;
      this.translate = [this.width * 0.47, this.height * -0.1];
    } else if (this.type !== "nation" && this.consulate === "Los Angeles") {
      this.scale = 2150;
      this.translate = [this.width * 1.2, this.height * 0.3];
    } else if (this.type !== "nation" && this.consulate === "San Francisco") {
      this.scale = 1400;
      this.translate = [this.width * 1, this.height * 0.4];
    } else if (this.type !== "nation" && this.consulate === "Miami") {
      this.scale = 3300;
      this.translate = [-this.width * 0.5, -this.height * 0.8];
    } else if (this.type !== "nation" && this.consulate === "Washington") {
      this.scale = 5000;
      this.translate = [-this.width * 1.4, this.height * 0.3];
    } else if (
      this.type !== "nation" &&
      this.consulate === "San Juan de Puerto Rico"
    ) {
      this.scale = 8000;
      this.translate = [-this.width * 4.3, -this.height * 4.5];
    }
  }

  createSVG() {
    if (this.selectPlot.selectAll("svg").empty()) {
      // Append svg to div
      this.plot = this.selectPlot
        .append("svg")
        .attr("viewBox", [
          0,
          0,
          this.width + this.margin.l + this.margin.r,
          this.height + this.margin.t + this.margin.b,
        ])
        .attr("title", "Spaniards in the US");

      //create groups to put the content inside them
      this.plotMap = this.plot.append("g").attr("class", "map");
      this.plotLines = this.plot.append("g").attr("class", "lines");
      this.plotBubbles = this.plot.append("g").attr("class", "bubbles");
    } else {
      this.plot = this.selectPlot.select("svg");
    }

    this.plotMap.attr(
      "transform",
      `translate(${this.margin.l}, ${this.margin.t})`
    );
    this.plotLines.attr(
      "transform",
      `translate(${this.margin.l}, ${this.margin.t})`
    );
    this.plotBubbles.attr(
      "transform",
      `translate(${this.margin.l}, ${this.margin.t})`
    );
  }

  drawUS() {
    this.mapLevel = this.plotMap
      .selectAll("g")
      .data(this.layers)
      .join("g")
      .attr("class", (d, i) => `${d} sort-${i}`);

    // nation, states and counties
    this.land = this.mapLevel
      .selectAll(".land")
      .data((d) => {
        let geo =
          d === "counties" ? this.californian_counties : this.map.objects[d];
        let this_map_features = "";

        if (
          this.type === "nation" &&
          (d === "nation" || d === "states" || d === "counties")
        ) {
          this_map_features = topojson.feature(this.map, geo).features;
        } else if (this.type !== "nation" && d === "states") {
          this_map_features = this.createOneJurisdiction(d);
        } else if (
          this.type !== "nation" &&
          d === "counties" &&
          (this.consulate === "Los Angeles" ||
            this.consulate === "San Francisco")
        ) {
          const counties = this.filterCaCounties(this.consulate, {
            type: "GeometryCollection",
            geometries: [],
          });
          this_map_features = topojson.feature(this.map, counties).features;
        }
        return this_map_features;
      })
      .join("path")
      .attr("class", (d) => `land ${d.properties.name}`)
      .attr("d", this.path);

    // polygon
    this.jurisdiction = this.plotMap
      .selectAll(".jurisdiction-polygons")
      .selectAll(".land")
      .data(
        this.type === "nation"
          ? this.groups
          : this.groups.filter((d) => d[0] === this.consulate)
      )
      .join("path")
      .attr("class", (d) => `land jurisdiction-polygon jur-${d[0]}`)
      .attr("stroke", "white")
      .attr("d", (d) => this.path(this.drawJurisdiction(d[0])));

    // borders
    this.jurisdiction = this.plotMap
      .selectAll(".jurisdiction-borders")
      .selectAll(".land")
      .data(
        this.type === "nation"
          ? this.consulate_borders.objects.collection.geometries
          : this.consulate_borders.objects.collection.geometries.filter((d) => {
              const consulate =
                d.properties["info_consulados_Consulado general"] ===
                "Nueva York"
                  ? "New York"
                  : d.properties["info_consulados_Consulado general"];
              return consulate === this.consulate;
            })
      )
      .join("path")
      .attr("class", (d) => `land jurisdiction-border`)
      .attr("stroke", "white")
      .attr("d", (d) => this.path(topojson.feature(this.consulate_borders, d)));

    this.plotMap
      .selectAll(".consulates")
      .selectAll(".consulate")
      .data(
        this.type === "nation"
          ? this.groups
          : this.groups.filter((d) => d[0] === this.consulate)
      )
      .join("circle")
      .attr("class", (d) => `consulate ${d[0]}`)
      .attr("cx", (d) => this.projection(d[1][0].lonlat)[0])
      .attr("cy", (d) => this.projection(d[1][0].lonlat)[1])
      .attr("r", 4);

    this.drawPoints();
  }

  drawPoints() {
    let transitions = 0;

    const these_points =
      this.type === "nation"
        ? this.pts
        : this.pts.filter((d) => d.consulate === this.consulate);
    this.plotMap
      .selectAll(".points")
      .selectAll(".point")
      .data(these_points)
      .join("circle")
      .attr("class", "point")
      .attr("cy", (d) => this.projection(d.xy)[1])
      .attr("cx", (d) => this.projection(d.xy)[0])
      .attr("r", 1)
      .style("opacity", 0)
      .transition()
      .duration(500)
      .delay((d, i) =>
        this.type === "nation" && this.width < 500
          ? (i * Math.random()) / 4
          : this.type === "nation" && this.width >= 500
          ? (i * Math.random()) / 2
          : i * Math.random()
      )
      .style("opacity", 1)
      .on("end", (d) => {
        transitions++;
        if (transitions === these_points.length) {
          d3.selectAll(".point").classed("shine", true);
        }
      });
  }

  filterCaCounties(jur, geometry) {
    this.laCountiesIDs = [
      6027, 6071, 6025, 6065, 6073, 6059, 6037, 6029, 6111, 6083, 6079,
    ];

    const counties =
      jur === "Los Angeles"
        ? this.californian_counties.geometries.filter((d) =>
            this.laCountiesIDs.includes(+d.id)
          )
        : this.californian_counties.geometries.filter(
            (d) => !this.laCountiesIDs.includes(+d.id)
          );

    const new_jur = { type: "GeometryCollection", geometries: [] };

    // loop across geometry and create a new array with all states minus CA
    geometry.geometries.forEach((d) => {
      if (d.properties.name !== "California") {
        new_jur.geometries.push(d);
      }
    });

    counties.forEach((d) => {
      new_jur.geometries.push(d);
    });

    return new_jur;
  }

  createOneJurisdiction(map, consulate) {
    const this_consulate = !consulate ? this.consulate : consulate;

    let one_jur = this.jurisdictions.geometries.filter(
      (d) => this_consulate === d.consulate
    );

    const this_jurisdiction = {
      type: "GeometryCollection",
      geometries: one_jur[0],
    };

    return topojson.feature(this.map, this_jurisdiction).features;
  }

  getCaCounties() {
    const countyNames = this.ca_counties.map((d) => d.id);
    const counties = this.map.objects.counties.geometries.filter((e) =>
      countyNames.includes(+e.id)
    );

    return { type: "GeometryCollection", geometries: counties };
  }

  createJurisdictions() {
    this.jurisdictions = {
      type: "GeometryCollection",
      geometries: [],
    };
    this.groups.forEach((d) => {
      const map = this.map.objects.states;
      const states = d[1].map((e) => e.jurisdiction);
      let geo = map.geometries.filter((e) =>
        states.includes(e.properties.name)
      );
      let jurisdiction = {
        type: "GeometryCollection",
        geometries: geo,
      };

      if (d[0] === "Los Angeles" || d[0] === "San Francisco") {
        jurisdiction = this.filterCaCounties(d[0], jurisdiction);
        geo = jurisdiction.geometries;
      }

      geo.consulate = d[0];

      this.jurisdictions.geometries.push(geo);
    });
  }

  drawJurisdiction(consulate) {
    const geo = this.jurisdictions.geometries.filter(
      (e) => e.consulate === consulate
    )[0];

    return geo.length > 0 ? topojson.merge(this.map, geo) : "no data";
  }

  updateThisMap(value) {
    this.consulate = value;
    this.init();
    this.createSVG();
    this.drawUS();
  }

  reDrawMap() {
    this.init();
    this.createSVG();
    this.drawUS();
  }
}
