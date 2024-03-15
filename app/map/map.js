class mapConsulates {
  constructor(item) {
    this.id = item.id;
    this.map = item.map;
    this.data = item.data;
    this.info = item.info;
    this.groups = item.groups.filter((d) => d[0] !== "New Orleans");
    this.ca_counties = item.ca_counties;
    this.consulate_borders = item.consulate_borders;
    this.pts = item.pts;
    this.selectPlot = d3.select(`#${this.id}`);
    this.year = d3.max(this.data, (d) => d.year);

    this.init();
    this.createSVG();
    this.drawUS();
  }

  init() {
    this.margin = { t: 40, l: 20, r: 20, b: 50 };

    this.width =
      document.getElementById(this.id).clientWidth -
      this.margin.r -
      this.margin.l;

    this.height =
      document.getElementById(this.id).clientHeight -
      this.margin.t -
      this.margin.b;

    //projection
    this.projection = projection
      .geoAlbersUsaPr()
      .scale(1200)
      .translate([this.width / 2, this.height / 2]);

    this.projectionPR = d3
      .geoConicEqualArea()
      .rotate([66, 0])
      .center([0, 18])
      .scale(1200)
      .translate([this.width / 2, this.height / 2])
      .parallels([8, 18]);

    // function to draw the map
    this.path = d3.geoPath().projection(this.projection);

    this.scaleR = d3
      .scaleSqrt()
      .domain(d3.extent(this.data, (d) => d.census))
      .range([10, 50]);

    this.californian_counties = this.getCaCounties();

    this.createJurisdictions();
    // create dots

    // const points = districts.features.map((geo) =>
    //   makeDots(geo.geometry.coordinates[0].map(projection), numPoints, {
    //     distance: distance,
    //     edgeDistance: Math.max(3, distance),
    //   })
    // );
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
    let layers = [
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
    this.mapLevel = this.plotMap
      .selectAll("g")
      .data(layers)
      .join("g")
      .attr("class", (d, i) => `${d} sort-${i}`);

    this.land = this.mapLevel
      .selectAll(".land")
      .data((d) => {
        let geo =
          d === "counties" ? this.californian_counties : this.map.objects[d];

        return d !== "jurisdiction-polygons" &&
          d !== "jurisdiction-borders" &&
          d !== "consulates" &&
          d !== "points"
          ? topojson.feature(this.map, geo).features
          : "";
      })
      .join("path")
      .attr("class", (d) => `land ${d.properties.name}`)
      .attr("d", this.path);

    // polygon
    this.jurisdiction = this.plotMap
      .selectAll(".jurisdiction-polygons")
      .selectAll(".land")
      .data(this.groups)
      .join("path")
      .attr("class", (d) => `land jurisdiction-polygon jur-${d[0]}`)
      .attr("stroke", "white")
      .attr("d", (d) => this.path(this.drawJurisdiction(d[0])));

    // borders
    this.jurisdiction = this.plotMap
      .selectAll(".jurisdiction-borders")
      .selectAll(".land")
      .data(this.consulate_borders.objects.collection.geometries)
      .join("path")
      .attr("class", (d) => `land jurisdiction-border`)
      .attr("stroke", "white")
      .attr("d", (d) => this.path(topojson.feature(this.consulate_borders, d)));

    this.plotMap
      .selectAll(".consulates")
      .selectAll(".consulate")
      .data(this.groups)
      .join("circle")
      .attr("class", (d) => `consulate ${d[0]}`)
      .attr("cx", (d) => this.projection(d[1][0].lonlat)[0])
      .attr("cy", (d) => this.projection(d[1][0].lonlat)[1])
      .attr("r", 4);

    this.drawPoints();
  }

  drawPoints() {
    console.log(this.pts);
    this.plotMap
      .selectAll(".points")
      .selectAll(".point")
      .data(this.pts)
      .join("circle")
      .attr("class", "point")
      .attr("cy", (d) => this.projection(d.xy)[1])
      .attr("cx", (d) => this.projection(d.xy)[0])
      .attr("r", 1);

    // let points = makeDots(
    //   geo.geometry.coordinates[0].map(projection),
    //   numPoints,
    //   {
    //     distance: distance,
    //     edgeDistance: Math.max(3, distance),
    //   }
    // );

    // let points = districts.features.map((geo) =>
    //   makeDots(geo.geometry.coordinates[0].map(projection), numPoints, {
    //     distance: distance,
    //     edgeDistance: Math.max(3, distance),
    //   })
    // );
  }

  filterCaCounties(jur, geometry) {
    const laCountiesIDs = [
      6027, 6071, 6025, 6065, 6073, 6059, 6037, 6029, 6111, 6083, 6079,
    ];

    const counties =
      jur === "Los Angeles"
        ? this.californian_counties.geometries.filter((d) =>
            laCountiesIDs.includes(+d.id)
          )
        : this.californian_counties.geometries.filter(
            (d) => !laCountiesIDs.includes(+d.id)
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
}
