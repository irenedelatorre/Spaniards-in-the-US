class lineChart {
    constructor(item) {
        this.id = item.id;
        this.data = item.data;
        this.selectPlot = d3.select(`#${this.id}`);
        this.yearExtent = d3.extent(this.data, d => d.year);

        this.init();
        this.createSVG();
    }
    

    init() {
                this.margin = {t: 40, l: 20, r: 20, b: 50};

        this.width = 
            document.getElementById(this.id).clientWidth - 
            this. margin.r - 
            this.margin.l;

        this.height = 
            document.getElementById(this.id).clientHeight - 
            this.margin.t - 
            this.margin.b;
    }
}