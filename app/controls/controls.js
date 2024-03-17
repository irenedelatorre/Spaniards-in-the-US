class Dropdown {
  constructor(item) {
    this.data = item.data;
    this.id = item.id;
    this.select = d3.select(`#${this.id}`);
    this.consulatesInfo = item.consulatesInfo;
    this.nation_id = item.nation_id;

    this.createDropdown();

    this.select.on("change", function () {
      console.log(this.value);

      if (this.value === "All consulates") {
        d3.selectAll(`#${item.nation_id}`).classed("hide", false);
      } else {
        d3.selectAll(`#${item.nation_id}`).classed("hide", true);
        const thisConsulate = this.value;
        item.consulatesInfo.updateInfo(thisConsulate);
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
