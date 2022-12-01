class BlocktimeWidget extends MarketWidget {

  static CLOCK;

  constructor() {
    super( "white", "black" );

    if (!this.CLOCK) {
      this.CLOCK = new Image();
      this.CLOCK.src = "/images/clock.svg";
    }
  }

  draw( ctx ) {

    // border
    super.draw( ctx );

    ctx.drawImage( this.CLOCK, 20, 15, 30, 30 );

    ctx.fillStyle = "black";

    ctx.font = "bold 20px monospace";
    ctx.fillText( "TIME NOW", 60, 37 );

    ctx.font = "bold 14px monospace";
    ctx.fillText( "Blockchain:", 20, 70 );
    ctx.fillText( "Local:", 20, 110 );

    let now = new Date();

    ctx.font = "14px monospace";
    ctx.fillText( now.toISOString().substring(0,10) + " T " +
                  now.toISOString().substring(11,16) + "Z", 20, 85 );

    ctx.fillText( now.toLocaleString().substring(0,10) + " " +
                  now.toLocaleString().substring(12), 20, 125 );
  }

}

