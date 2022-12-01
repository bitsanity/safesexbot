var CHITMARKET = (function() {

  const CHITMARKETABI = [{"inputs":[{"internalType":"address","name":"_chit","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"offerId","type":"uint256"}],"name":"accept","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"assetChitId","type":"uint256"},{"internalType":"address","name":"askType","type":"address"},{"internalType":"uint256","name":"askAmount","type":"uint256"},{"internalType":"uint256","name":"askTokenId","type":"uint256"}],"name":"ask","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"askCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"asks","outputs":[{"internalType":"uint256","name":"assetChitId","type":"uint256"},{"internalType":"address","name":"askType","type":"address"},{"internalType":"uint256","name":"askAmount","type":"uint256"},{"internalType":"uint256","name":"askTokenId","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"askId","type":"uint256"}],"name":"cancelAsk","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"offerId","type":"uint256"}],"name":"cancelOffer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"chit","outputs":[{"internalType":"contract Chit","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"askId","type":"uint256"},{"internalType":"uint256","name":"payChitId","type":"uint256"}],"name":"offer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"offerCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"offers","outputs":[{"internalType":"uint256","name":"askId","type":"uint256"},{"internalType":"uint256","name":"payChitId","type":"uint256"}],"stateMutability":"view","type":"function"}]

  var MktCon = null;

  function ASKGAS() { return 200000; }
  function CANCELASKGAS() { return 50000; }
  function OFFERGAS() { return 200000; }
  function CANCELOFFERGAS() { return 50000; }
  function ACCEPTGAS() { return 200000; }

  var ASKHWM = 1; // asks start at 1

  var askCache = {}  // { askId: Ask, ... }
  var offerCache = {} // { offerId: Offer, ... }

  function sca() {
    return '0x986B03C027C6Ededc5c85Bd267b4c34D31efe8e3' // mainnet
  //return '0x3B9b02D76cC7a327Adf99255FE39558089614937' // test
  }

  function mktsca() {
    if (MktCon)
      return MktCon.options.address
    return "?"
  }

  async function onConnect() {
    let web3 = COMMONMODEL.getWeb3();
    MktCon = new web3.eth.Contract( CHITMARKETABI, sca() );
    await refreshCaches()
  }

  async function refreshCaches() {
    askCache = {}
    offerCache = {}
    ASKHWM = 1;
    OFFERHWM = 1;
    await fetch()
  }

  async function stats( rescb ) {
    try {
      let askC = await MktCon.methods.askCounter().call()
      let offC = await MktCon.methods.offerCounter().call()

      let result = {
        asks: askC,
        offers: offC
      };
      rescb( result );
    }
    catch( e ) {
      rescb( { asks:0, offers:0 } )
    }
  }

  function chitToOfferId( chitId ) {
    let result = null
    let offerIds = Object.keys(offerCache)
    offerIds.forEach( (offerId,ix) => {

      // offer is valid if the ask is valid and the chit still exists
      if (offerCache[offerId].payChitId == chitId) {
        let askId = offerCache[offerId].askId
        if (    askId != 0
             && askCache[askId]
             && offerCache[offerId].askId != 0) {
          let assetChitId = askCache[askId].assetChitId
          if (chitfactory.getChit(assetChitId)) {
            result = offerId
          }
        }
      }
    } )
    return result;
  }

  function getOfferIds( askId ) {
    let result = []
    let offerIds = Object.keys(offerCache)
    offerIds.forEach( (offerId,ix) => {
      if (offerCache[offerId].askId == askId) {
        result.push( offerId )
      }
    } )
    return result;
  }

  function getOffer( offerId ) {
    return offerCache[offerId]
  }

  function getAskIds( assetChitId ) {
    let result = []
    let askIds = Object.keys(askCache)
    askIds.forEach( (askId,ix) => {
      if (askCache[askId].assetChitId == assetChitId)
        result.push( askId )
    } )
    return result;
  }

  function getAsk( askId ) {
    return askCache[askId]
  }

  async function fetch() {
    if (!MktCon) return

    let askCount = await MktCon.methods.askCounter().call()

    while ( ASKHWM < askCount ) {
      let ask = await MktCon.methods.asks( ASKHWM ).call()
      if (ask.assetChitId != 0) { // ask is active
        let chit = await chitfactory.getChit( ask.assetChitId )
        if (chit) {
          askCache[ASKHWM] = {
            assetChitId: parseInt(ask.assetChitId),
            askType: ask.askType.toLowerCase(),
            askAmount: BigInt(ask.askAmount),
            askTokenId: parseInt( ask.askTokenId )
          }
        }
      }
      else { // ask has been canceled
        delete askCache[ASKHWM]
      }
      ASKHWM++
    }

    let offerCount = await MktCon.methods.offerCounter().call()
    while ( OFFERHWM < offerCount ) {
      let offer = await MktCon.methods.offers( OFFERHWM ).call()

      // ensure offer still valid
      if (offer.payChitId != 0) {
        let chit = await chitfactory.getChit( offer.payChitId )
        if (chit) {
          offerCache[OFFERHWM] = {
            askId: parseInt( offer.askId ),
            payChitId: parseInt( offer.payChitId )
          }
        }
      }
      else { // offer has been canceled
        delete offerCache[OFFERHWM]
      }
      OFFERHWM++
    }
  }

  function ask( assetChitId, askType, askAmount, askTokenId, gasprix ) {

    let user = ACCOUNTMODEL.getUser()
    let calldata =
      MktCon.methods.ask(
        assetChitId, askType, askAmount, askTokenId ).encodeABI();

    let txobj = { nonce:user.nonce++,
                  to:MktCon.options.address,
                  value:0,
                  data:calldata,
                  gas:ASKGAS(),
                  gasPrice:gasprix };

    COMMONCTRL.rollTransaction( txobj, 'CHITMARKET.ask()' )
  }

  async function cancelAsk( askId ) {

    let user = ACCOUNTMODEL.getUser()
    let calldata = MktCon.methods.cancelAsk( askId ).encodeABI();
    let gasprix = SETTINGSVIEW.gasPrice()

    let txobj = { nonce:user.nonce++,
                  to:MktCon.options.address,
                  value:0,
                  data:calldata,
                  gas:CANCELASKGAS(),
                  gasPrice:gasprix };

    COMMONCTRL.rollTransaction( txobj, 'CHITMARKET.cancelAsk()' )

    askCache[askId].assetChitId = 0;
  }

  async function offer( askId, payChitId ) {

    let erc = await ERC721.fetchAsync( chitfactory.chitsca() )

    await erc.approve( MktCon.options.address, payChitId )

    let user = ACCOUNTMODEL.getUser()
    let calldata = MktCon.methods.offer( askId, payChitId ).encodeABI();
    let gasprix = SETTINGSVIEW.gasPrice()

    let txobj = { nonce:user.nonce++,
                  to:MktCon.options.address,
                  value:0,
                  data:calldata,
                  gas:OFFERGAS(),
                  gasPrice:gasprix };

    COMMONCTRL.rollTransaction( txobj, 'CHITMARKET.offer()' )
  }

  async function cancelOffer( offerId ) {

    // change approval of payChitId from contract to self
    let user = ACCOUNTMODEL.getUser()
    let erc = await ERC721.fetchAsync( chitfactory.chitsca() )
    let payChitId = await CHITMARKET.getOffer( offerId ).payChitId
    await erc.approve( "0x0000000000000000000000000000000000000000",
                       payChitId )

    let calldata = MktCon.methods.cancelOffer( offerId ).encodeABI();
    let gasprix = SETTINGSVIEW.gasPrice()

    let txobj = { nonce:user.nonce++,
                  to:MktCon.options.address,
                  value:0,
                  data:calldata,
                  gas:CANCELOFFERGAS(),
                  gasPrice:gasprix };

    await COMMONCTRL.rollTransaction( txobj, 'CHITMARKET.cancelOffer()' )

    offerCache[offerId].payChitId = 0
  }

  async function accept( offerId ) {

    let user = ACCOUNTMODEL.getUser()

    let offer = getOffer( offerId )
    let ask = getAsk( offer.askId )

    let erc = await ERC721.fetchAsync( chitfactory.chitsca() )
    await erc.approve( MktCon.options.address, ask.assetChitId )

    let calldata = MktCon.methods.accept( offerId ).encodeABI();
    let gasprix = SETTINGSVIEW.gasPrice()

    let txobj = { nonce:user.nonce++,
                  to:MktCon.options.address,
                  value:0,
                  data:calldata,
                  gas:ACCEPTGAS(),
                  gasPrice:gasprix };

    await COMMONCTRL.rollTransaction( txobj, 'CHITMARKET.accept()' )

    ask.assetChitId = 0;
    offer.payChitId = 0;
  }

  PubSub.subscribe( 'connected', () => { onConnect() } )

  return {
    ASKGAS:ASKGAS,
    CANCELASKGAS:CANCELASKGAS,
    OFFERGAS:OFFERGAS,
    CANCELOFFERGAS:CANCELOFFERGAS,
    ACCEPTGAS:ACCEPTGAS,
    mktsca:mktsca,
    refreshCaches:refreshCaches,
    stats:stats,
    chitToOfferId:chitToOfferId,
    getOfferIds:getOfferIds,
    getOffer:getOffer,
    getAskIds:getAskIds,
    getAsk:getAsk,
    fetch:fetch,
    ask:ask,
    cancelAsk:cancelAsk,
    offer:offer,
    cancelOffer:cancelOffer,
    accept:accept
  }

})();

