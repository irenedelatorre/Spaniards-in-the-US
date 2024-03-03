class ConsulatesInfo {
  constructor(item) {
    this.data = item.data;
    this.id_number = item.id_number;
    this.id_consulate = item.id_consulate;
    this.id_quote = item.id_quote;
    this.id_author = item.id_author;
    this.id_jurisdiction = item.id_jurisdiction;
    this.formatNumber = d3.format(",");

    // select ids
    this.select_id_number = d3.select(`#${this.id_number}`);
    this.select_id_consulate = d3.select(`#${this.id_consulate}`);
    this.select_id_quote = d3.select(`#${this.id_quote}`);
    this.select_id_author = d3.select(`#${this.id_author}`);
    this.select_id_jurisdiction = d3.select(`#${this.id_jurisdiction}`);
    // this.quote = item.quote;
  }

  updateInfo(d) {
    this.consulate = this.data.totalConsulates.filter(
      (e) => e.consulate.toLowerCase() === d.toLowerCase()
    )[0];

    this.infoConsulate = this.data.infoConsulates.filter((e) => e[0] === d)[0];
    this.jurisdiction = this.infoConsulate[1]
      .map((e) => e.jurisdiction)
      .join(", ");

    const quotes = this.data.quotes.filter((e) => e.consulate === d);
    console.log(
      d,
      this.consulate,
      this.data,
      "Puerto Rico".toLowerCase(),
      d.toLowerCase()
    );

    // consulate info - right side
    this.select_id_consulate.html(d);
    this.select_id_number.html(this.formatNumber(this.consulate.census));

    // quote
    this.createQuotes(quotes);

    // jurisdiction - left side
    let jurisInfo = this.jurisdiction;
    if (d === "Los Angeles") {
      jurisInfo =
        "Arizona, Colorado and Utah, and the following counties in California: Imperial, Inyo, Kern, Los Angeles, Orange, Riverside, San Bernardino, San Diego, San Luis Obispo,Santa Barbara and Ventura";
    } else if (d === "San Francisco") {
      jurisInfo =
        "Alaska, Northern California, Hawaii, Idaho, Montana, Nevada, Oregon, Washington, Wyoming, US Pacific";
    }
    this.select_id_jurisdiction.html(jurisInfo);
  }

  createQuotes(quotes) {
    console.log(quotes);
    // update number of indicators
    d3.selectAll("#carouselQuotes")
      .selectAll(".carousel-indicators")
      .selectAll("button")
      .data(quotes)
      .join("button")
      .attr("type", "button")
      .attr("data-bs-target", "#carouselQuotes")
      .attr("data-bs-slide-to", (d, i) => i)
      .attr("aria-label", (d, i) => `Quote ${i}`)
      .attr("aria-current", (d, i) => (i === 0 ? "true" : ""))
      .attr("class", (d, i) => (i === 0 ? "active" : ""));

    const infoQuote = d3
      .selectAll("#carouselQuotes")
      .selectAll(".carousel-inner")
      .selectAll(".carousel-item")
      .data(quotes)
      .join("carousel-item")
      .attr("class", (d, i) =>
        i === 0 ? "active carousel-item" : "carousel-item"
      );

    // quote
    infoQuote
      .selectAll(".quote")
      .data((d) => [d])
      .join("p")
      .attr("class", "quote")
      .html((d) => `"${d.quote}"`);

    infoQuote
      .selectAll(".author")
      .data((d) => [d])
      .join("p")
      .attr("class", "author")
      .html((d) => d.author);
  }
}
