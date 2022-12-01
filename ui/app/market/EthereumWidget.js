class EthereumWidget extends MarketWidget {

  static ETHEREUM;

  constructor() {
    super( "white", "darkgreen" );

    if (!this.ETHEREUM) {
      this.ETHEREUM = new Image();
      this.ETHEREUM.src = "/images/ethereum-green.svg";
    }
  }

  async draw( ctx ) {

    // border
    super.draw( ctx );

    ctx.drawImage( this.ETHEREUM, 20, 10, 30, 45 );

    ctx.fillStyle = "darkgreen";
    ctx.font = "bold 20px monospace";
    ctx.fillText( "ΞTHEREUM", 60, 38 );

    ctx.font = "bold 14px monospace";
    ctx.fillText( "BlockNum:", 15, 80 );
    ctx.fillText( "Tx Count:", 15, 105 );
    ctx.fillText( "Gas Price:", 15, 130 );

    let bn = await COMMONMODEL.getWeb3().eth.getBlockNumber()
    ctx.font = "14px monospace";
    ctx.fillText( bn, 102, 80 );

    let btc = await COMMONMODEL.getWeb3().eth.getBlockTransactionCount( bn )
    ctx.fillText( btc, 102, 105 );

    let egp = await COMMONMODEL.getWeb3().eth.getGasPrice()
    let val = COMMONVIEW.shiftValueLeftDecimals( egp, 9 );
    val = Math.floor( val * 100 ) / 100

    ctx.fillText( val + " Gwei", 102, 130 );
  }
}
