class BotStatsWidget extends MarketWidget {

  static ETHEREUM;

  constructor() {
    super( "white", "darkgreen" );

    if (!this.ETHEREUM) {
      this.ETHEREUM = new Image();
      this.ETHEREUM.src = "/images/ethereum-green.svg";
    }
  }

  draw( ctx ) {

    // border
    super.draw( ctx );

    ctx.drawImage( this.ETHEREUM, 20, 10, 30, 45 );

    ctx.fillStyle = "darkgreen";
    ctx.font = "bold 20px monospace";
    ctx.fillText( "SAFESΞXBOT", 55, 38 );

    ctx.font = "bold 14px monospace";
    ctx.fillText( "CHITs:",   30, 74 );
    ctx.fillText( "Asks:",    30, 94 );
    ctx.fillText( "Offers:",  30, 114 );
    ctx.fillText( "Options:", 30, 134 );

    ctx.font = "14px monospace";
    chitfactory.stats( res => {
      ctx.fillText( res.chits, 115, 74 );
    } );

    CHITMARKET.stats( res => {
      ctx.fillText( (res.asks != 0) ? res.asks - 1 : 0, 115, 94 );
      ctx.fillText( (res.offers != 0) ? res.offers - 1 : 0, 115, 114 );
    } )

    ctx.fillText( OPTIONFACTORY.allOpenOffers().length, 115, 134 )
  }
}
