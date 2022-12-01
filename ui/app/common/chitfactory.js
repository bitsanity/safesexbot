class CHITFACTORY {

  static CHITFACTORYABI = 
'[{"inputs":[{"internalType":"uint256","name":"_mf","type":"uint256"},{"internalType":"uint256","name":"_tf","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"ipfsHash","type":"string"}],"name":"ClientPublished","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin_","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"chit","outputs":[{"internalType":"contract Chit","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_sellunits","type":"uint256"},{"internalType":"address","name":"_selltoken","type":"address"},{"internalType":"uint256","name":"_selltokid","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"make","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"makerfee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_operator","type":"address"},{"internalType":"address","name":"_from","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address payable","name":"newadmin","type":"address"}],"name":"setAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_client","type":"string"}],"name":"setClient","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_makefeewei","type":"uint256"},{"internalType":"uint256","name":"_takefeewei","type":"uint256"}],"name":"setFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_chitId","type":"uint256"}],"name":"take","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"takerfee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]'

  static CHITABI =
`[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_itemAmounts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_itemTokenIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_itemTypes","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_minter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_serial","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"address","name":"itemType","type":"address"},{"internalType":"uint256","name":"itemAmount","type":"uint256"},{"internalType":"uint256","name":"itemTokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"mint","outputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]`

  MAKEGAS() { return 200000; }
  TAKEGAS() { return 200000; }

  constructor() {
    this.BotCon = null;
    this.ChitCon = null;
    this.BirthBlock = 15571274; // PROD
    //this.BirthBlock = 0; // TEST
    this.chitCache = {}

    PubSub.subscribe( 'connected', () => { this.onConnect() } )
  }

  sca() {
    return '0x645e9ba771438Bd45E4756B21C6B04197C0BfAd5'; // MAINNET
    //return '0xf68580c3263fb98c6eaee7164afd45ecf6189ebb'; // TEST1
  }

  chitsca() {
    if (this.ChitCon)
      return this.ChitCon.options.address
    return ""
  }

  async fetchPastEvents() {
    this.ChitCon.getPastEvents(
      'Transfer', {fromBlock:this.BirthBlock,toBlock:'latest'} )
    .then( async evts => {
      for (let ii = 0; ii < evts.length; ii++) {
        await this.procEvent( evts[ii] );
      }
    } )
    .catch( err => { console.log(err); return false } );
  }

  async onConnect() {
    let web3 = COMMONMODEL.getWeb3();

    this.BotCon = new web3.eth.Contract(
      JSON.parse(CHITFACTORY.CHITFACTORYABI), this.sca() );

    let addr = await this.BotCon.methods.chit().call()

    this.ChitCon = new web3.eth.Contract(
      JSON.parse(CHITFACTORY.CHITABI), addr )

    await this.fetchPastEvents()

    this.ChitCon.events.Transfer( async (err, evt) => {
      if (err) { console.log(err) }
      else
        await this.procEvent( evt )
    } )
  }

  async procEvent( evt ) {
    let tok = evt.returnValues.tokenId

    if (/^0[xX]0+$/.test(evt.returnValues.to)) {
      this.chitCache[tok].burned = true
      return
    }

    let block = await COMMONMODEL.getWeb3().eth.getBlock( evt.blockNumber )

    if (this.chitCache[tok]) {
      this.chitCache[tok].owner = evt.returnValues.to.toLowerCase()
      this.chitCache[tok].tstamp = block.timestamp
      return
    }

    let ityp = await this.ChitCon.methods._itemTypes(tok).call();
    let iamt = await this.ChitCon.methods._itemAmounts(tok).call();
    let itok = await this.ChitCon.methods._itemTokenIds(tok).call();

    if (! /^0[xX]0+$/.test(ityp) ) {
      let erc = null
      if (iamt == 0) {
        erc = await ERC721.fetchAsync( ityp )
      }
      else {
        erc = await ERC20.fetchAsync( ityp )
      }
    }

    this.chitCache[tok] = {
      chitId: tok,
      owner: evt.returnValues.to.toLowerCase(),
      tstamp: block.timestamp,
      itemType: ityp.toLowerCase(),
      itemAmount: BigInt(iamt),
      itemTokenId: itok,
      burned: false
    }
  }

  async getChit( chitId ) {
    if (this.chitCache[chitId] && !this.chitCache[chitId].burned)
      return this.chitCache[chitId]
    else
      return null
  }

  balanceEth( rescb ) {
    COMMONMODEL.getWeb3().eth.getBalance( this.sca() )
    .then( bal => {
      rescb( COMMONMODEL.getWeb3().utils.fromWei(bal,'ether') );
    } )
    .catch( err => { console.log( err.toString() ); } );
  }

  makerFee( rescb ) {
    if (this.BotCon) {
      this.BotCon.methods.makerfee().call()
      .then( res => {
        rescb( res );
      } )
      .catch( err => { console.log(err.toString()) } );
    }
  }

  takerFee( rescb ) {
    if (this.BotCon) {
      this.BotCon.methods.takerfee().call()
      .then( res => {
        rescb( res );
      } )
      .catch( err => { console.log(err.toString()) } );
    }
  }

  async takerFeeAsync() {
    if (this.BotCon)
      return await this.BotCon.methods.takerfee().call()
    return null
  }

  stats( rescb ) {
    let result = {
      chits: Object.keys(this.chitCache).length
    };
    rescb( result );
  }

  allChits() {
    let result = [];
    Object.keys(this.chitCache).forEach( key => {
      if (this.chitCache[key].burned) {
        /* do nothing */
      }
      else {
        result.push( key )
      }
    } )
    return result
  }

  othersChits() {
    let result = [];
    Object.keys(this.chitCache).forEach( key => {
      if (    this.chitCache[key].owner !== ACCOUNTMODEL.getUser().address
           && !this.chitCache[key].burned)
        result.push( key )
    } )
    return result
  }

  myChits() {
    let result = [];
    Object.keys(this.chitCache).forEach( key => {
      if (    this.chitCache[key].owner === ACCOUNTMODEL.getUser().address
           && !this.chitCache[key].burned)
        result.push( key )
    } )
    return result
  }

  make( sellunits, selltoken, selltokid, data, gasprix ) {

    let isEth = /^0[xX]0+$/.test(selltoken)
    let user = ACCOUNTMODEL.getUser()
    if (!data) data = ""

    this.makerFee( fee => {

      let databytes = Buffer.from( data, 'UTF-8' )
      let calldata =
        this.BotCon.methods.make( sellunits, selltoken, selltokid, databytes )
        .encodeABI();

      let totalFee = BigInt( fee )
      if ( isEth ) totalFee += BigInt( sellunits );

      let txobj = { nonce:user.nonce++,
                    to:this.BotCon.options.address,
                    value: totalFee.toString(),
                    gas:this.MAKEGAS(),
                    gasPrice:gasprix,
                    data:calldata };

      COMMONCTRL.rollTransaction( txobj, 'CHITFACTORY.make()' )
    } );
  }

  async take( id, gasprix ) {

    let chit = await ERC721.fetchAsync( this.ChitCon.options.address );
    await chit.approve( this.BotCon.options.address, id )

    let fee = await this.takerFeeAsync()

    let user = ACCOUNTMODEL.getUser();
    let calldata = this.BotCon.methods.take( id ).encodeABI();
    let txobj = { nonce:user.nonce++,
                  to:this.BotCon.options.address,
                  value:fee,
                  data:calldata,
                  gas:this.TAKEGAS(),
                  gasPrice:gasprix };

    COMMONCTRL.rollTransaction( txobj, 'CHITFACTORY.take()' )
  }
}
