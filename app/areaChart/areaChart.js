class areaChart {
  constructor(item) {
    this.id = item.id;
    this.data = item.data;
    this.dateExtent = item.dateExtent;
    this.stack = item.stack;
    this.select = d3.select(`#${this.id}`);
    this.tickFormat = d3.timeFormat("%Y");
    this.formatNumber = d3.format(",");
    this.label_n = item.label_n;
    this.label_text = item.label_text;

    this.init();
    this.createSVG();
    this.build_chart();
  }

  init() {
    this.margin = {
      t: 70,
      l: 80,
      r: 85,
      b: 30,
    };

    this.width =
      document.getElementById(this.id).clientWidth -
      this.margin.r -
      this.margin.l;

    this.height =
      document.getElementById(this.id).clientHeight -
      this.margin.t -
      this.margin.b;

    // from https://observablehq.com/@d3/stacked-area-chart/2
    const keys_all = d3.union(
      this.data
        .sort((a, b) => b.date - a.date || b.census - a.census)
        .map((d) => d[this.stack])
    );
    const keys = [...new Set(keys_all)];

    const groups = d3.index(
      this.data,
      (d) => d.date,
      (d) => d[this.stack]
    );

    this.series = d3
      .stack()
      .keys(keys)
      .value(([, D], key) =>
        typeof D.get(key) === "undefined" ? 0 : D.get(key).census
      )(groups);

    // scales
    this.scale_y = d3
      .scaleLinear()
      .domain([0, d3.max(this.series, (d) => d3.max(d, (e) => e[1]))])
      .rangeRound([this.height, 0]);

    this.scale_x = d3
      .scaleLinear()
      .domain(this.dateExtent)
      .range([0, this.width]);

    this.area = d3
      .area()
      .x((d) => this.scale_x(d.data[0]))
      .y0((d) => this.scale_y(d[0]))
      .y1((d) => this.scale_y(d[1]));

    this.line = d3
      .line()
      .x((d) => this.scale_x(d.data[0]))
      .y((d) => this.scale_y(d[1]));
  }

  createSVG() {
    if (this.select.selectAll("svg").empty()) {
      this.plot = this.select.append("svg");
      this.axis_y = this.plot.append("g").attr("class", "axis axis-y");
      this.axis_x = this.plot.append("g").attr("class", "axis axis-x");
      this.plot_chart = this.plot.append("g").attr("class", "chart");
    } else {
      this.plot = this.select.select("svg");
      this.axis_y = this.plot.select(".axis-y");
      this.axis_x = this.plot.select(".axis-x");
      this.plot_chart = this.plot.select(".chart");
    }

    this.plot = this.select
      .select("svg")
      .attr("width", this.width + this.margin.r + this.margin.l)
      .attr("height", this.height + this.margin.b + this.margin.t)
      .attr("aria-hidden", true);

    this.axis_y.attr(
      "transform",
      `translate(${this.margin.l}, ${this.margin.t})`
    );

    this.plot_chart.attr(
      "transform",
      `translate(${this.margin.l}, ${this.margin.t})`
    );

    this.axis_x.attr(
      "transform",
      `translate(${this.margin.l}, ${this.height + this.margin.t})`
    );
  }

  add_axis() {
    const axis_x = d3
      .axisBottom(this.scale_x)
      .tickPadding(8)
      .tickValues(
        this.width < 500
          ? [this.dateExtent[0], new Date("2013-01-01"), this.dateExtent[1]]
          : [
              this.dateExtent[0],
              // new Date("1-1-2004"),
              // new Date("1-1-2005"),
              // new Date("1-1-2006"),
              // new Date("1-1-2007"),
              // new Date("1-1-2008"),
              // new Date("1-1-2009"),
              new Date("2010-01-01"),
              // new Date("1-1-2011"),
              // new Date("1-1-2012"),
              // new Date("1-1-2013"),
              // new Date("1-1-2014"),
              new Date("2015-01-01"),
              // new Date("1-1-2016"),
              // new Date("1-1-2017"),
              // new Date("1-1-2018"),
              // new Date("1-1-2019"),
              new Date("2020-01-01"),
              // new Date("1-1-2021"),
              // new Date("1-1-2022"),
              // new Date("1-1-2023"),
              this.dateExtent[1],
            ]
      )
      .tickFormat((d) => {
        if (d !== this.dateExtent[0] && d !== this.dateExtent[1]) {
          return this.tickFormat(d);
        } else {
          return d3.timeFormat("%b %Y")(d);
        }
      });

    const axis_y = d3
      .axisLeft()
      .scale(this.scale_y)
      .tickSize(-this.width)
      .ticks(3)
      .tickPadding(8);

    this.axis_x.call(axis_x);
    this.axis_y.call(axis_y);

    this.axis_y.selectAll(".domain").remove();
  }

  build_chart() {
    const padding_x = 6;

    this.add_axis();

    const gCharts = this.plot_chart
      .selectAll("g")
      .data(["areas", "lines", "total", "labels"])
      .join("g")
      .attr("class", (d) => d);

    this.plot_chart
      .selectAll(".areas")
      .selectAll(".area")
      .data(this.series)
      .join("path")
      .attr("class", (d) =>
        d.key === "United States of America" ? "area highlight" : "area"
      )
      .attr("d", (d) => this.area(d));

    this.plot_chart
      .selectAll(".lines")
      .selectAll(".area-line")
      .data(this.series.filter((d) => d.index <= 2))
      .join("path")
      .attr("class", "area-line")
      .attr("d", (d) => this.line(d));

    this.plot_chart
      .selectAll(".total")
      .selectAll(".total-line")
      .data([this.series[this.series.length - 1]])
      .join("path")
      .attr("class", "total-line")
      .attr("d", (d) => this.line(d));

    this.plot_chart
      .selectAll(".total")
      .selectAll(".total-circle")
      .data([this.series[this.series.length - 1]])
      .join("circle")
      .attr("class", "total-circle")
      .attr("r", 6)
      .attr("cx", (d) => this.scale_x(d3.max(d, (e) => e.data[0])))
      .attr("cy", (d) => this.scale_y(d3.max(d[0], (e) => e)));

    this.plot_chart
      .selectAll(".total")
      .selectAll(".total-label-highlight")
      .data([this.series[this.series.length - 1]])
      .join("text")
      .attr("class", "total-label-highlight")
      .attr("x", (d) => this.scale_x(d3.max(d, (e) => e.data[0])) + padding_x)
      .attr("y", (d) => this.scale_y(d3.max(d[0], (e) => e)) - 40)
      .text((d) => `${this.formatNumber(this.label_n)} Spaniards`);

    this.plot_chart
      .selectAll(".total")
      .selectAll(".total-label")
      .data([this.series[this.series.length - 1]])
      .join("text")
      .attr("class", "total-label")
      .attr("x", (d) => this.scale_x(d3.max(d, (e) => e.data[0])) + padding_x)
      .attr("y", (d) => this.scale_y(d3.max(d[0], (e) => e)) - 16)
      .text(this.label_text);

    this.plot_chart
      .selectAll(".labels")
      .selectAll(".label")
      .data(this.series.filter((d) => d.index <= 2))
      .join("text")
      .attr("class", (d) =>
        d.key === "United States of America" ? "label highlight" : "label"
      )
      .attr("x", (d) => this.scale_x(d3.max(d, (e) => e.data[0])) + padding_x)
      .attr("y", (d) => this.scale_y(d3.mean(d[0], (e) => e)) + 6)
      .text((d) =>
        d.key === "United States of America" ? "US" : d.key.toLowerCase()
      );

    this.plot_chart
      .selectAll(".labels")
      .selectAll(".label-other")
      .data(this.series.filter((d) => d.index === 2))
      .join("text")
      .attr("class", "label label-other")
      .attr("x", (d) => this.scale_x(d3.max(d, (e) => e.data[0])) + padding_x)
      .attr("y", (d) => this.scale_y(d3.max(d[0], (e) => e)) - 24)
      .text((d) => "Other");
  }

  updateChart() {
    this.init();
    this.createSVG();
    this.build_chart();
  }
}
