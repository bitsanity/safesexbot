class RatePairWidget extends MarketWidget {

  constructor( pairtext, oraclesca, quotesym, decimals ) {
    super( "white", "darkblue" );

    if (!this.CHAINLINK) {
      this.ETH = new Image();
      this.ETH.src = "/images/ethereum-eth-logo.svg";

      this.BTC = new Image();
      this.BTC.src = "/images/bitcoin-btc-logo.svg";

      this.MONERO = new Image();
      this.MONERO.src = "/images/monero-xmr-logo.svg";

      this.LOOPRING = new Image();
      this.LOOPRING.src = "/images/loopring-lrc-logo.svg";

      this.MATIC = new Image()
      this.MATIC.src = "/images/polygon-matic-logo.svg";

      this.CHAINLINK = new Image();
      this.CHAINLINK.src = "/images/chainlink-logo.svg";

      this.POLKADOT = new Image();
      this.POLKADOT.src = "/images/dot-logo.svg";

      this.CARDANO = new Image();
      this.CARDANO.src = "/images/cardano-ada-logo.svg";

      this.AVAX = new Image()
      this.AVAX.src = "/images/avalanche-avax-logo.svg";

      this.BNB = new Image()
      this.BNB.src = "/images/bnb-bnb-logo.svg";

      this.DASH = new Image()
      this.DASH.src = "/images/dash-dash-logo.svg"

      this.XAU = new Image()
      this.XAU.src = "/images/au.svg"

      this.XAG = new Image()
      this.XAG.src = "/images/ag.svg"
    }

    this.pair = pairtext;
    this.sca = oraclesca;
    this.quotesym = quotesym;
    this.decimals = decimals;
  }

  async getLatest() {
    if (!this.feed) return

    let res = await this.feed.methods.latestRoundData().call()
    let rate = COMMONVIEW.shiftValueLeftDecimals( res.answer, this.decimals )

    if (/^ETH/.test(this.pair)) {
      PubSub.publish( 'ETHUSD', rate )
    }

    return {
      answer: res.answer,
      shortform: rate,
      updatedAt: res.updatedAt
    }
  }

  async onConnect() {
    // aggregatorV3InterfaceABI
    let ABI = [{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

    let web3 = COMMONMODEL.getWeb3();
    this.feed = new web3.eth.Contract( ABI, this.sca );

    await this.getLatest()
  }

  async draw( ctx ) {
    super.draw( ctx ); // border

    if (/^ETH/.test(this.pair))
      ctx.drawImage( this.ETH, 25, 10, 30, 40 );
    else if (/^BTC/.test(this.pair))
      ctx.drawImage( this.BTC, 25, 15, 30, 30 );
    else if (/^DOT/.test(this.pair))
      ctx.drawImage( this.POLKADOT, 25, 15, 30, 30 );
    else if (/^XMR/.test(this.pair))
      ctx.drawImage( this.MONERO, 25, 15, 30, 30 );
    else if (/^LRC/.test(this.pair))
      ctx.drawImage( this.LOOPRING, 25, 15, 30, 30 );
    else if (/^MATIC/.test(this.pair))
      ctx.drawImage( this.MATIC, 25, 15, 30, 30 );
    else if (/^LINK/.test(this.pair))
      ctx.drawImage( this.CHAINLINK, 25, 15, 30, 30 );
    else if (/^ADA/.test(this.pair))
      ctx.drawImage( this.CARDANO, 25, 15, 30, 30 );
    else if (/^AVAX/.test(this.pair))
      ctx.drawImage( this.AVAX, 25, 15, 30, 30 );
    else if (/^BNB/.test(this.pair))
      ctx.drawImage( this.BNB, 25, 15, 30, 30 );
    else if (/^DASH/.test(this.pair))
      ctx.drawImage( this.DASH, 25, 15, 30, 30 );
    else if (/^XAU/.test(this.pair))
      ctx.drawImage( this.XAU, 25, 15, 30, 30 );
    else if (/^XAG/.test(this.pair))
      ctx.drawImage( this.XAG, 25, 15, 30, 30 );
    else
      ctx.drawImage( this.CHAINLINK, 25, 15, 30, 30 );

    ctx.fillStyle = "darkblue";
    ctx.font = "bold 20px monospace";
    ctx.fillText( this.pair, 65, 37 );

    ctx.font = "14px monospace";

    let val = await this.getLatest()
    ctx.fillText( this.quotesym + " " + val.shortform, 25, 85 );

    let when = new Date( val.updatedAt * 1000 );
    let iso = when.toISOString();
    let utc = iso.substring(0,10) + " " + iso.substring(11,16) + "Z";
    ctx.fillText( utc, 25, 110 );
  }

}

