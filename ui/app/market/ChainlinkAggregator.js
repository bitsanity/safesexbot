class ChainlinkAggregator {

  constructor( sca ) {
    this.sca = sca;
    this.AggCon = null;

    this.ABI = JSON.parse('[{"constant":true,"inputs":[],"name":"latestAnswer","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"latestTimestamp","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]' );
  }

  onConnect() {
    try {
      let web3 = COMMONMODEL.getWeb3();
      this.AggCon = new web3.eth.Contract( this.ABI, this.sca );
    }
    catch (err) {
      console.log( 'ARGH: ' + err.toString() );
    }
  }

  latestAnswer( rescb ) {
    if (!this.AggCon) return;

    this.AggCon.methods.latestAnswer().call().then( res => {
      rescb( res );
    } )
    .catch( err => { console.log(err.toString()) } );
  }

  latestTimestamp( rescb ) {
    if (!this.AggCon) return;

    this.AggCon.methods.latestTimestamp().call().then( res => {
      rescb( res );
    } )
    .catch( err => { console.log(err.toString()) } );
  }

}

