class Dropdown {
    constructor(item) {
        this.data = item.data;
        this.id = item.id;
        this.select = d3.select(`#${this.id}`);

        this.createDropdown();

        this.select
            .on("change", function() {
                // change something in the map
            });
    }

    createDropdown() {
        this.select
            .selectAll("option")
            .data(this.data)
            .join("option")
            .html(d => d)
            .attr("value", d => d);
    }
}