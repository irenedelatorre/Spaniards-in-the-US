class smallMultiple {
    constructor(item) {
        this.id = item.id;
        this.data = item.data;
        this.selectPlot = d3.select(`#${this.id}`);
        this.type = item.type;
        this.dateExtent = item.dateExtent;
        this.yExtent = item.yExtent;
        this.height = item.height;

        this.createDivs();
        this.callPlot();
    }

    // create one div per key
    createDivs() {
        this.divs = this.selectPlot
            .selectAll(".plot")
            .data(this.data)
            .join("div")
            .attr("class", d => `plot plot-${d[0]}`)
            .attr("id", d => `${this.id}-${d[0]}`)
            .each(d => this.callPlot(d, this));
    }

    // call the new chart in each div
    callPlot(d, that) {
        let pass = false;
        if (Array.isArray(d) && d.length && typeof that !== undefined) {
            pass = true;
        };

        if (pass && that.type === "line") {
            const change_line = new lineChart({
                id: `${that.id}-${d[0]}`, 
                data: d,
                full_data: that.data,
                dateExtent: that.dateExtent,
                yExtent: that.yExtent,
                height: that.height,
                scale: that.scale
            });
        };
    }
}