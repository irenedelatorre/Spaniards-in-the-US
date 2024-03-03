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

    console.log(
      this.data.infoConsulates,
      this.infoConsulate,
      this.jurisdiction
    );

    // consulate info - right side
    this.select_id_consulate.html(d);
    this.select_id_number.html(this.formatNumber(this.consulate.census));

    // quote
    this.select_id_quote.html(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vulputate, sem a vehicula feugiat, felis ex dictum orci, in ultrices nibh libero et nisi. Suspendisse condimentum quis nulla non convallis. Aenean vehicula ante dolor. Duis at mauris nulla. Etiam non faucibus quam. "
    );

    this.select_id_author.html("Jane Doe");

    // jurisdiction - left side
    this.select_id_jurisdiction.html(this.jurisdiction);
  }
}
