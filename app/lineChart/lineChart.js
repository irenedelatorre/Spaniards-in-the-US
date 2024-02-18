class lineChart {
    constructor(item) {
        this.id = item.id;
        this.data = item.data;
        this.full_data = item.full_data;
        this.consulate = {name: this.data[1][0].consulate, id: this.data[0]};
        this.select = d3.select(`#${this.id}`);
        this.dateExtent = item.dateExtent;
        this.yExtent = item.yExtent;
        this.tickFormat = d3.timeFormat("%Y");
        this.heightCSS = item.height;

        console.log(item.yExtent, "hello")
        this.addTitle();
        this.init();
        this.createSVG();
        this.build_chart();
    }

    addTitle() {
        this.select
            .selectAll("h3")
            .data([this.consulate])
            .join("h3")
            .text(d => d.name.toLowerCase())
    }
    

    init() {
        this.margin = {
            t: 15,
            l: 100,
            r: 30,
            b: 60
        };

        this.width = 
            document.getElementById(this.id).clientWidth - 
            this. margin.r - 
            this.margin.l;

        this.height = this.heightCSS - this.margin.t - this.margin.b;

            console.log(this.height)

        this.scale_y = d3
            .scaleLinear()
            .domain(this.yExtent)
            .range([this.height, 0]);
      
        this.scale_x = d3
            .scaleLinear()
            .domain(this.dateExtent)
            .range([0, this.width]);
      
        this.line = d3
            .line()
            .x((d) => d.date)
            .y((d) => d.census);
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
            .attr("height", this.height + this.margin.b + this.margin.t);
    
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
            .tickPadding(4)
            .tickValues([
                this.dateExtent[0],
                new Date("1-1-2004"),
                new Date("1-1-2005"),
                new Date("1-1-2006"),
                new Date("1-1-2007"),
                new Date("1-1-2008"),
                new Date("1-1-2009"),
                new Date("1-1-2010"),
                new Date("1-1-2011"),
                new Date("1-1-2012"),
                new Date("1-1-2013"),
                new Date("1-1-2014"),
                new Date("1-1-2015"),
                new Date("1-1-2016"),
                new Date("1-1-2017"),
                new Date("1-1-2018"),
                new Date("1-1-2019"),
                new Date("1-1-2020"),
                new Date("1-1-2021"),
                new Date("1-1-2022"),
                new Date("1-1-2023"),
                this.dateExtent[1]
            ])
            .tickFormat(this.tickFormat);
    
        const axis_y = d3
            .axisLeft()
            .scale(this.scale_y)
            .tickSize(-this.width)
            .ticks(6)
            .tickPadding(4);

        this.axis_x.call(axis_x);
        this.axis_y.call(axis_y);

        this.axis_y.selectAll('.domain').remove();
    }

    build_chart() {
        this.add_axis();

        // background data
        this.plot_chart
            .selectAll(".bkg-line")
            .data(this.full_data.filter(d => d[0] !== this.consulate.id))
            .join("path")
            .attr("class", "line bkg-line")
            .attr("d", d => this.line(d[1].sort((a, b) => a.date - b.date)))

        // this consulate
        const thisConsulate = this.plot_chart
            .append("g")
            .attr("class", "highlighted-line");
        
        thisConsulate
            .selectAll(".main-line")
            .data([this.data[1]].sort((a, b) => a.date - b.date))
            .join("path")
            .attr("class", "line main-line")
            .attr("d", this.line);

        const lastDate = d3.max(this.data[1], d => d.date);
        const last_point = this.data[1].filter(d => d.date === lastDate)[0];
        console.log(last_point)
        thisConsulate
            .selectAll(".main-dot")
            .data([last_point])
            .join("circle")
            .attr("class", "main-dot")
            .attr("cx", d => this.scale_x(d.date))
            .attr("cy", d => this.scale_y(d.census))
            .attr("r", 24 / 2);
    }
}