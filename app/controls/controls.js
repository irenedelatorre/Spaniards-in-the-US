class Dropdown {
  constructor(item) {
    this.data = item.data;
    this.id = item.id;
    this.select = d3.select(`#${this.id}`);
    this.consulatesInfo = item.consulatesInfo;

    this.createDropdown();

    this.select.on("change", function () {
      const thisConsulate = this.value;
      item.consulatesInfo.updateInfo(thisConsulate);
      // change something in the map
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
