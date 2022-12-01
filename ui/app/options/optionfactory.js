var OPTIONFACTORY = (function() {

  const SCA = '0xaEE9b3e8329B57e2192f4B70c7C3fB22A4C72F6E' // mainnet
  //const SCA = '0x4ebf4321a360533ac2d48a713b8f18d341210078' // test

  const OPTIONFACTORYABI = '[{"inputs":[{"internalType":"uint256","name":"mf","type":"uint256"},{"internalType":"uint256","name":"cf","type":"uint256"},{"internalType":"uint256","name":"tf","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"cancel","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"cancelfee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"isCall","type":"bool"},{"internalType":"address","name":"aaaType","type":"address"},{"internalType":"uint256","name":"aaaAmount","type":"uint256"},{"internalType":"uint256","name":"aaaTokenId","type":"uint256"},{"internalType":"address","name":"bbbType","type":"address"},{"internalType":"uint256","name":"bbbAmount","type":"uint256"},{"internalType":"uint256","name":"bbbTokenId","type":"uint256"},{"internalType":"uint256","name":"expires","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"make","outputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"makefee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nft","outputs":[{"internalType":"contract OptionNFT","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_operator","type":"address"},{"internalType":"address","name":"_from","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner_","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"which","type":"uint8"},{"internalType":"uint256","name":"amtwei","type":"uint256"}],"name":"setFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"newowner","type":"address"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"take","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"takefee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]'
  const NFTABI = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Singed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_collatAmounts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_collatTokenIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_collatTypes","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_count","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_expirations","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_makers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_minter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_optionTypes","outputs":[{"internalType":"enum OptionNFT.OptionType","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_settleAmounts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_settleTokenIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_settleTypes","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"isSinged","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"enum OptionNFT.OptionType","name":"otype","type":"uint8"},{"internalType":"address","name":"collatType","type":"address"},{"internalType":"uint256","name":"collatAmount","type":"uint256"},{"internalType":"uint256","name":"collatTokenId","type":"uint256"},{"internalType":"address","name":"settleType","type":"address"},{"internalType":"uint256","name":"settleAmount","type":"uint256"},{"internalType":"uint256","name":"settleTokenId","type":"uint256"},{"internalType":"uint256","name":"expires","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"mint","outputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"singe","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

  function MAKEGAS() { return 325000; }
  function TAKEGAS() { return 500000; }
  function CANCELGAS() { return 200000; }

  var FactoryCon = null;
  var NFTCon = null
  var optionNFT = null

  const ZEROADDRESS = "0x0000000000000000000000000000000000000000"

  const BirthBlock = 15572207; // PROD
  //const BirthBlock = 0; // TEST
  var evtHWM = BirthBlock

  var makefee
  var cancelfee
  var takefee
  var nftCon

  var eventCache = {} // { <tokenId> : {maker: <addr>, owner: <addr>} }
  var optionCache = {}

  function nftSCA() {
    if (NFTCon) return NFTCon.options.address
    return null
  }

  // Transfer(address from, address to, uint256 tokenId)
  // Singed(uint256 tokenId)

  function fetchEvents() {

    if (!NFTCon) return

    NFTCon.getPastEvents( 'allEvents', {fromBlock:evtHWM, toBlock:'latest'} )
    .then( async (evs) => {
      for( var ii = 0; ii < evs.length; ii++ ) {
        let tok = evs[ii].returnValues.tokenId
        if (!tok) continue

        evtHWM = evs[ii].blockNumber

        if ( evs[ii].event === 'Transfer') {
          // transfer to zero address is a burn
          if (/^0[xX]0+$/.test(evs[ii].returnValues.to) ) {
            delete eventCache[tok]
          }
          else {
            let mkr = await NFTCon.methods._makers(tok).call()
            mkr = mkr.toLowerCase()

            let block =
              await COMMONMODEL.getWeb3().eth.getBlock( evs[ii].blockNumber )

            eventCache[tok] = {
              tstamp: block.timestamp,
              maker: mkr,
              owner : evs[ii].returnValues.to.toLowerCase()
            }
          }
        }
        else if (evs[ii].event === 'Singed') {
          delete eventCache[tok]
        }
      }
    } )
    .catch( e => { console.log(e) } )
  }

  function onConnect() {
    let web3 = COMMONMODEL.getWeb3();
    FactoryCon = new web3.eth.Contract( JSON.parse(OPTIONFACTORYABI), SCA );

    PubSub.publish( 'OptionFactorySCA', SCA )

    FactoryCon.methods.makefee().call()
    .then( res => {
      PubSub.publish( 'OptionMakeFee', makefee = BigInt(res) )
    } ).catch( err => { console.log(err) } );

    FactoryCon.methods.takefee().call()
    .then( res => {
      PubSub.publish( 'OptionTakeFee', takefee = BigInt(res) )
    } ).catch( err => { console.log(err.toString()) } );

    FactoryCon.methods.cancelfee().call()
    .then( res => {
      PubSub.publish( 'OptionCancelFee', cancelfee = BigInt(res) )
    } ).catch( err => { console.log(err) } );

    FactoryCon.methods.nft().call().then( async (nft) => {
      NFTCon = new web3.eth.Contract( JSON.parse(NFTABI), nft )
      optionNFT = await ERC721.fetchAsync( nft )
      PubSub.publish( 'OptionNFTSCA', nft )

      fetchEvents()
    } )
    .catch( e => { console.log(e) } );
  }

  async function getToken( tokenId ) {
    let result = optionCache[tokenId]
    if (result != null) return result

    result = {}
    try {
      // note: tokenId is shared primary key across event and option caches
      result.tstamp = eventCache[tokenId].tstamp

      result.owner =
        (await NFTCon.methods.ownerOf( tokenId ).call()).toLowerCase()

      result.optionType = await NFTCon.methods._optionTypes(tokenId).call()

      result.maker =
        (await NFTCon.methods._makers(tokenId).call()).toLowerCase()

      result.collatType =
        (await NFTCon.methods._collatTypes(tokenId).call()).toLowerCase()

      result.collatAmount = await NFTCon.methods._collatAmounts(tokenId).call()

      result.collatTokenId =
        await NFTCon.methods._collatTokenIds(tokenId).call()

      result.settleType =
        (await NFTCon.methods._settleTypes(tokenId).call()).toLowerCase()

      result.settleAmount = await NFTCon.methods._settleAmounts(tokenId).call()

      result.settleTokenId =
        await NFTCon.methods._settleTokenIds(tokenId).call()

      result.expiration = await NFTCon.methods._expirations(tokenId).call()

      optionCache[tokenId] = result
    }
    catch(e) {
      console.log( e.toString() )
      return null
    }

    return result
  }

  function isZeroAddr( strAddr ) {
    return /^0[xX]0+$/.test( strAddr ) || /^0+$/.test( strAddr )
  }

  // require controller to preload tokens before calling this

  async function make( isCall,
                 aaaType, aaaAmount, aaaTokenId,
                 bbbType, bbbAmount, bbbTokenId,
                 expires, data ) {
    //
    // Approve tokens as necessary before calling make()
    //

    if (isCall && !isZeroAddr(aaaType) && aaaAmount != 0) { // erc20
      let tok = await ERC20.fetchAsync( aaaType )
      if (null == tok) tok = await ERC20.fetchAsync( aaaType )
      if (null == tok) throw ("Invalid ERC20: " + aaaType)
      await tok.approve( SCA, aaaAmount )
    }

    if (isCall && !isZeroAddr(aaaType) && aaaAmount == 0) { // erc721
      let tok = await ERC721.fetchAsync( aaaType )
      if (null == tok) tok = await ERC721.fetchAsync( aaaType )
      if (null == tok) throw ("Invalid ERC721: " + aaaType)
      await tok.approve( SCA, aaaTokenId )
    }

    if (!isCall && !isZeroAddr(bbbType) && bbbAmount != 0) { // erc20
      let tok = await ERC20.fetchAsync( bbbType )
      if (null == tok) tok = await ERC20.fetchAsync( bbbType )
      if (null == tok) throw ("Invalid ERC20: " + bbbType)
      await tok.approve( SCA, bbbAmount )
    }

    if ( !isCall && !isZeroAddr(bbbType) && bbbAmount == 0 ) { // erc721
      let tok = await ERC721.fetchAsync( bbbType )
      if (null == tok) tok = await ERC721.fetchAsync( bbbType )
      if (null == tok) throw ("Invalid ERC721: " + bbbType)
      await tok.approve( SCA, bbbTokenId )
    }

    let val = BigInt(0)
    if ( isCall && isZeroAddr(aaaType) ) val += BigInt(aaaAmount);
    if ( !isCall && isZeroAddr(bbbType) ) val += BigInt(bbbAmount);
    val += makefee

    let calldata = FactoryCon.methods.make(
      isCall,
      isZeroAddr(aaaType) ? ZEROADDRESS : aaaType,
      aaaAmount,aaaTokenId,
      isZeroAddr(bbbType) ? ZEROADDRESS : bbbType,
      bbbAmount, bbbTokenId, expires, Buffer.from(data,'UTF-8') )
      .encodeABI()

    let txobj = { nonce:ACCOUNTMODEL.getUser().nonce++,
                  to: FactoryCon.options.address,
                  value: '' + val,
                  gas: '' + MAKEGAS(),
                  gasPrice: SETTINGSVIEW.gasPrice(),
                  data: calldata }

     COMMONCTRL.rollTransaction( txobj, 'OptionFactory.make()' )
  }

  async function cancel( tokenId ) {

    await optionNFT.approve( FactoryCon.options.address, tokenId )

    let calldata = FactoryCon.methods.cancel( tokenId ).encodeABI()

    let txobj = { nonce:ACCOUNTMODEL.getUser().nonce++,
                  to: FactoryCon.options.address,
                  value: cancelfee.toString(),
                  gas: CANCELGAS(),
                  gasPrice: SETTINGSVIEW.gasPrice(),
                  data: calldata }

     await COMMONCTRL.rollTransaction(
       txobj,
       'OptionFactory.cancel(tokenId=' + tokenId + ')' )

    delete optionCache[tokenId]
    delete eventCache[tokenId]
  }

  async function take( tokenId ) {
    let type = await NFTCon.methods._settleTypes(tokenId).call()
    let amt = await NFTCon.methods._settleAmounts(tokenId).call()
    let stid = await NFTCon.methods._settleTokenIds(tokenId).call()

    let val = BigInt(takefee)
    if (type == 0) val += BigInt(amt);

    if (type != 0 && amt != 0) { // erc20
      let tok = await ERC20.fetchAsync( type )
      if (null == tok) throw ("Invalid ERC20: " + type)
      await tok.approve( SCA, amt )
    }

    if (type != 0 && amt == 0 && stid != 0) { // erc721
      let tok = await ERC721.fetchAsync( type )
      if (null == tok) throw ("Invalid ERC721: " + type)
      await tok.approve( SCA, stid )
    }

    await optionNFT.approve( FactoryCon.options.address, tokenId )

    let calldata = FactoryCon.methods.take( tokenId ).encodeABI()

    let txobj = { nonce:ACCOUNTMODEL.getUser().nonce++,
                  to: FactoryCon.options.address,
                  value: val.toString(),
                  gas: TAKEGAS(),
                  gasPrice: SETTINGSVIEW.gasPrice(),
                  data: calldata }

     COMMONCTRL.rollTransaction( txobj,
       'OptionFactory.take(tokenId=' + tokenId + ')' )
  }

  // all tokens where caller is maker and owner
  function myOpenOffers() {
    let me = ACCOUNTMODEL.getUser().address
    let result = []

    Object.keys(eventCache).forEach( (key) => {
      let mk = eventCache[key].maker
      let ow = eventCache[key].owner

      if (mk === me && ow === me) {
        result.push( key )
      }
    } )
    return result
  }

  // all NFT tokenIds where caller is neither owner nor maker
  function offersFromOthers() {
    let me = ACCOUNTMODEL.getUser().address
    let result = []
    Object.keys(eventCache).forEach( (key) => {
      if (eventCache[key].maker !== me && eventCache[key].owner !== me)
        result.push( key )
    } )
    return result
  }

  // as it says ...
  function allOpenOffers() {
    return Object.keys(eventCache)
  }

  PubSub.subscribe( 'connected', () => { onConnect(); } )
  PubSub.subscribe( 'TransactionSent', () => { fetchEvents(); } )

  return {
    SCA:SCA,
    ZEROADDRESS:ZEROADDRESS,
    MAKEGAS:MAKEGAS,
    nftSCA:nftSCA,
    fetchEvents:fetchEvents,
    getToken:getToken,
    make:make,
    cancel:cancel,
    take:take,
    myOpenOffers:myOpenOffers,
    offersFromOthers:offersFromOthers,
    allOpenOffers:allOpenOffers
  };

})();

