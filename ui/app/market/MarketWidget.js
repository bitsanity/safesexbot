class MarketWidget {

  constructor( fc, sc ) {
    this.fillcol = fc;
    this.strcol = sc;
  }

  setDimensions( w, h, r ) {
    this.width = w;
    this.height = h;
    this.round = r;
    this.border = new RoundedRect( w, h, r, this.fillcol, this.strcol );
  }

  draw( ctx ) {
    ctx.fillStyle = this.fillcol;
    ctx.fillRect( 0, 0, this.width, this.height );
    this.border.draw( ctx );
  }

}

