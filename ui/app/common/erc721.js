class ERC721 {

  static TRANSFERFROMGAS = 80000;
  static SAFETRANSFERFROMGAS = 200000;
  static APPROVEGAS = 50000;

  static ERC721ABI = JSON.parse( '[{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]' );

  static cache = {}

  static tokenSCAs() {
    return Object.keys(this.cache);
  }

  static async fetchAsync( toksca ) {
    if (!toksca || toksca.length == 0) return null;
    toksca = toksca.toLowerCase()

    let result = this.cache[toksca]
    if (!result) {
      result = await this.loadOne( toksca )
      this.cache[toksca] = result
    }
    return result
  }

  static fetch( toksca ) {
    if (!toksca || toksca.length == 0)
      return null;

    toksca = toksca.toLowerCase();
    return this.cache[toksca]; // could be null
  }

  static async loadOne( ansca ) {
    if ( !ansca || ansca.length == 0 || /^0x0+$/.test(ansca) ) return null;
    let toksca = ansca.toLowerCase();

    if (this.cache[toksca]) return this.cache[toksca]

    let web3 = COMMONMODEL.getWeb3();
    let con = new web3.eth.Contract( ERC721.ERC721ABI, toksca );
    let tok = { smartcontract: con, sca: toksca };

    try {
      tok.symbol = await con.methods.symbol().call()
      tok.name = await con.methods.name().call()
      this.cache[toksca] = new ERC721( tok );
      return this.cache[toksca]
    }
    catch( e ) {
      console.log( e )
    }

    return null
  }

  constructor( blob ) {
    this.blob = blob;
  }

  sca() {
    return this.blob.sca;
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

  ownerOf( tokenId, errcb, rescb ) {
    this.blob.smartcontract.methods.ownerOf( tokenId ).call()
    .then( res => { rescb( res ); } )
    .catch( err => { errcb( err.toString() ); } );
  }

  async owner( tokId ) {
    return await this.blob.smartcontract.methods.ownerOf( tokId ).call()
  }

  async safeTransferFrom( from, to, tokenId, data ) {
    let calldata =
      this.blob.smartcontract.methods.safeTransferFrom(
        from, to, tokenId, data ).encodeABI();

    await this.doTransaction( calldata, ERC721.SAFETRANSFERFROMGAS,
      this.blob.symbol +
      '.safeTransferFrom(from=' + from +
      ',to=' + to +
      ',tokenId=' + tokenId +
      ',data=' + data + ')' )
  }

  async transferFrom( from, to, tokenId ) {
    let calldata =
      this.blob.smartcontract.methods.transferFrom(
        from, to, tokenId ).encodeABI();

    await this.doTransaction( calldata, ERC721.TRANSFERFROMGAS,
      this.blob.symbol +
      '.transferFrom(from=' + from +
      ',to=' + to +
      ',tokenId=' + tokenId + ')' )
  }

  async approve( spender, tokenId ) {
    let calldata =
      this.blob.smartcontract.methods.approve( spender, tokenId ).encodeABI();

    await this.doTransaction( calldata, ERC721.APPROVEGAS,
      this.blob.symbol +
      '.approve(spender=' + spender + ',tokenId=' + tokenId + ')' )
  }

  getApproved( tokenId, errcb, rescb ) {
    this.blob.smartcontract.methods.getApproved( tokenId ).call()
    .then( res => { rescb( res ); } )
    .catch( err => { errcb( err.toString() ); } );
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
