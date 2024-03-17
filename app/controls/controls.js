class Dropdown {
  constructor(item) {
    this.data = item.data;
    this.id = item.id;
    this.select = d3.select(`#${this.id}`);
    this.consulatesInfo = item.consulatesInfo;
    this.nation_id = item.nation_id;
    this.info_id = item.info_id;
    this.map = item.map;

    this.createDropdown();

    this.select.on("change", function () {
      console.log(this.value);

      if (this.value === "All consulates") {
        d3.selectAll(`#${item.nation_id}`).classed("hide", false);
        d3.selectAll(`#${item.info_id}`).classed("hide", true);
      } else {
        d3.selectAll(`#${item.nation_id}`).classed("hide", true);
        d3.selectAll(`#${item.info_id}`).classed("hide", false);
        const thisConsulate = this.value;
        item.consulatesInfo.updateInfo(thisConsulate);
        item.map.updateThisMap(thisConsulate);
      }
    });
  }

  createDropdown() {
    this.select
      .selectAll("option")
      .data(this.data.filter((d) => d !== "New Orleans"))
      .join("option")
      .html((d) => d)
      .attr("value", (d) => d);
  }
}
