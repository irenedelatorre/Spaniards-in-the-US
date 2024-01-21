class smallMultiple {
    constructor(item) {
        this.id = item.id;
        this.data = item.data;
        this.selectPlot = d3.select(`#${this.id}`);
        this.yearExtent = d3.extent(this.data, d => d.year);

        this.init();
        this.createSVG();
    }

    // create one div per key
    createDivs() {
        
    }
}