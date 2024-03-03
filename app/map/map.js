class mapConsulates {
  constructor(item) {
    this.id = item.id;
    this.map = item.map;
    this.data = item.data;
    this.info = item.info;
    this.groups = item.groups;
    this.selectPlot = d3.select(`#${this.id}`);
    this.year = d3.max(this.data, (d) => d.year);

    this.init();
    this.createSVG();
    this.drawUS();
    this.drawLines();
    this.drawBubbles();
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

    // function to draw the map
    this.path = d3.geoPath().projection(this.projection);

    this.scaleR = d3
      .scaleSqrt()
      .domain(d3.extent(this.data, (d) => d.census))
      .range([10, 50]);
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

  drawLines() {
    this.plotLines
      .selectAll(".jurisdiction")
      .data(topojson.feature(this.map, this.map.objects.states).features)
      .join("path")
      .attr("class", (d) => `jurisdiction ${d.properties.name}`)
      .attr("d", (d) => {
        // console.log(d)
        // console.log(this.path.centroid(d));
        const start = this.path.centroid(d);

        // find consulate
        const consulate = this.info.filter(
          (e) => d.properties.name === e.jurisdiction
        );

        // ignore Puerto Rico for a bit
        if (consulate.length > 0 && consulate[0].consulate_id !== 320) {
          const end = this.projection(consulate[0].lonlat);
          const dx = end[0] - start[0];
          const dy = end[1] - start[1];
          const dr = Math.sqrt(dx * dx + dy * dy);
          // ignore Puerto Rico for a bit
          return `M${start[0]},${start[1]}A${dr},${dr} 0 0,1 ${end[0]},${end[1]}`;
        }
        // console.log(consulate, this.info, d.properties.name)

        // const end_x = d.target.x;
        // const end_y = d.target.y;
        // const dx = end_x - d.source.x;
        // const dy = end_y - d.source.y;
        // const dr = Math.sqrt(dx * dx + dy * dy);
        // return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${end_x},${end_y}`;
      });
  }

  drawBubbles() {
    this.plotBubbles
      .selectAll(".consulado")
      .data(this.data.filter((d) => d.year === this.year))
      .join("circle")
      .attr("class", (d) => `consulado ${d.consulate}`)
      .attr("cx", (d) => {
        // ignore Puerto Rico for a bit
        return d.consulate_id !== 320 ? this.projection(d.lonlat)[0] : "";
      })
      .attr("cy", (d) => {
        // ignore Puerto Rico for a bit
        return d.consulate_id !== 320 ? this.projection(d.lonlat)[1] : "";
      })
      .attr("r", (d) => this.scaleR(d.census));
  }

  drawUS() {
    console.log("mapping", this.map.objects);
    this.mapLevel = this.plotMap
      .selectAll("g")
      .data(["nation", "jurisdiction", "counties", "states", "jurisdiction"])
      .join("g")
      .attr("class", (d, i) => `${d} sort-${i}`);

    this.land = this.mapLevel
      .selectAll(".land")
      .data((d) => {
        let geo = this.map.objects[d];

        if (d === "counties") {
          const drawCounties = this.info
            .map((d) => d.county)
            .filter((d) => d !== "");
          const countyNames = drawCounties[0].split(", ");
          const counties = this.map.objects.counties.geometries.filter((e) =>
            countyNames.includes(e.properties.name)
          );

          geo = { type: "GeometryCollection", geometries: counties };
        }
        return d !== "jurisdiction"
          ? topojson.feature(this.map, geo).features
          : "";
      })
      .join("path")
      .attr("class", (d) => `land ${d.properties.name}`)
      .attr("d", this.path);

    this.jurisdiction = this.plotMap
      .selectAll(".jurisdiction")
      .selectAll(".land")
      .data(this.groups)
      .join("path")
      .attr("class", (d) => `land jurisdiction-${d[0]}`)
      .attr("d", (d) => {
        const map = this.map.objects.states;
        const states = d[1].map((e) => e.jurisdiction);
        const geo = map.geometries.filter((e) =>
          states.includes(e.properties.name)
        );
        const jurisdiction = {
          type: "GeometryCollection",
          geometries: geo,
        };
        return geo.length > 0
          ? this.path(topojson.merge(this.map, jurisdiction.geometries))
          : "";
      });
    // .
  }
}
