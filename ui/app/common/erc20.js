class ERC20 {

  static TRANSFERFROMGAS = 100000;
  static TRANSFERGAS = 100000;
  static APPROVEGAS = 50000;

  static ERC20ABI =
[{"inputs":[{"internalType":"uint256","name":"initialSupply","type":"uint256"},{"internalType":"string","name":"tokenName","type":"string"},{"internalType":"uint8","name":"decimalUnits","type":"uint8"},{"internalType":"string","name":"tokenSymbol","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"delegate","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]

  static ETHEREUM = {
    sca:"0x0000000000000000000000000000000000000000",
    totalSupply:"unlimited",
    decimals:18,
    symbol:"ETH",
    name:"Ether"
  };

  static cache = {
    "0x0000000000000000000000000000000000000000" : new ERC20(this.ETHEREUM)
  }

  static tokenSCAs() {
    return Object.keys(this.cache);
  }

  static async fetchAsync( toksca ) {
    if (!toksca || toksca.length == 0) return null;
    toksca = toksca.toLowerCase()

    let result = this.cache[toksca]
    if (!result) {
      result = await this.loadOne( toksca )
      if (result) this.cache[toksca] = result
    }
    return result
  }

  static fetch( toksca ) {
    if (!toksca || toksca.length == 0)
      return null;

    toksca = toksca.toLowerCase();
    return this.cache[toksca]; // could be null
  }

  static async loadOne( somesca ) {
    if ( !somesca || somesca.length == 0 ) return null
    if ( /^0[xX]0+$/.test(somesca) || /^0+$/.test(somesca) ) return ETHEREUM;

    let toksca = somesca.toLowerCase();
    if (this.cache[toksca]) return this.cache[toksca]

    let web3 = COMMONMODEL.getWeb3();
    let con = new web3.eth.Contract( ERC20.ERC20ABI, toksca );
    let tok = { smartcontract: con, sca: toksca };

    try {
      tok.totalSupply = await con.methods.totalSupply().call()
      tok.decimals = await con.methods.decimals().call()
      tok.symbol = await con.methods.symbol().call()
      tok.name = await con.methods.name().call()
      this.cache[toksca] = new ERC20( tok );
      return this.cache[toksca]
    }
    catch( e ) {
      console.log( e )
    }

    return null
  }

  static load() {
  }

  constructor( blob ) {
    this.blob = blob;
  }

  sca() {
    return this.blob.sca;
  }

  totalSupply() {
    return this.blob.totalSupply;
  }

  decimals() {
    return this.blob.decimals;
  }

  symbol() {
    return this.blob.symbol;
  }

  name() {
    return this.blob.name;
  }

  balanceOf( addr, errcb, rescb ) {
    this.blob.smartcontract.methods.balanceOf( addr ).call()
    .then( res => {
      rescb( res );
    } )
    .catch( err => {
      errcb( err.toString() );
    } );
  }

  allowance( owner, spender, errcb, rescb ) {
    this.blob.smartcontract.methods.allowance( owner, spender )
    .then( res => {
      rescb( res );
    } )
    .catch( err => {
      errcb( err.toString() );
    } );
  }

  async transfer( toaddr, quant ) {
    let calldata =
      this.blob.smartcontract.methods.transfer( toaddr, quant ).encodeABI();

    await this.doTransaction(
      calldata,
      ERC20.TRANSFERGAS,
      this.blob.symbol + '.transfer(to=' + toaddr + ',amount=' + quant + ')' )
  }

  async approve( spender, quant ) {
    let calldata =
      this.blob.smartcontract.methods.approve( spender, quant ).encodeABI();

    await this.doTransaction(
      calldata,
      ERC20.APPROVEGAS,
      this.blob.symbol +
        '.approve(spender=' + spender +
        ',amount=' + quant + ')' )
  }

  async transferFrom( from, to, quant ) {
    let calldata =
      this.blob.smartcontract.methods.transferFrom( from, to, quant )
      .encodeABI();

    await this.doTransaction(
      calldata,
      ERC20.TRANSFERFROMGAS,
      this.blob.symbol +
        '.transferFrom(from=' + from +
        ',to=' + to +
        ',amount=' + quant + ')' )
  }

  async doTransaction( calldata, gasunits, descrip ) {
    let user = ACCOUNTMODEL.getUser()

    let txobj = { nonce: user.nonce++,
                  to: this.sca(),
                  from: ACCOUNTMODEL.getUser().address,
                  data: calldata,
                  gas: gasunits,
                  gasPrice: SETTINGSVIEW.gasPrice() };

    await COMMONCTRL.rollTransaction( txobj, descrip )
  }

}
