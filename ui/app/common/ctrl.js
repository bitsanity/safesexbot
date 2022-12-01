var COMMONCTRL = (function() {

  const CHAINID = 1 // PROD

  var pendingTxnQueue = []

  function setMainScreen( bool ) {
    $( "#CameraDialog" ).hide();
    $( "#MarketTab" ).hide();
    $( "#ListingsTab" ).hide();
    $( "#PortfolioTab" ).hide();
    $( "#OptionsTab" ).hide();
    $( "#SettingsTab" ).hide();
    $( "#AccountTab" ).hide();
    $( "#WalletTab" ).hide();
    $( "#AboutTab" ).hide();

    if (bool) {
      $( "#QRDialog" ).hide();
      $( "#TabButtons" ).show();
    }
    else {
      $( "#QRDialog" ).show();
      $( "#TabButtons" ).hide();
    }
  }

  function challenge( chB64 ) {
    setMainScreen( false );
    QRDIALOG.showQR( true, chB64 );
  }

  function getSignature( hash, descrip ) {
    setMainScreen( false );
    QRDIALOG.showQR( false, hash, descrip );
  }

  function respond() {
    $( "#QRDialog" ).hide();
    $( "#CameraDialog" ).show();
    global.startQRScanner();
  }

  function cancelResponse() {
    global.pauseQRScanner();
    setMainScreen( true );
  }

  function qrScanned( rspHexStr ) {
    global.pauseQRScanner();

    // react only to hex signature not Base64 identity response
    if (!rspHexStr.match( /^([a-f0-9]+)$/ )) {
      console.log( 'COMMONCTRL: ignoring ident response' )
      return
    }

    try {
      let lc = rspHexStr.toLowerCase();
      if (!lc.startsWith('0x'))
        lc = '0x' + lc;

      let msgarray = COMMONMODEL.hexToBytes( lc );
      let recovid = msgarray.pop();

      let dersig = Uint8Array.from( msgarray );
      let sigobj = SECP256K1.signatureImport( dersig );
      let sigR = sigobj.subarray( 0, 32 );
      let sigS = sigobj.subarray( 32, 64 );

      // start here ...
      // https://ethereum.stackexchange.com/questions/42455/
      //   during-ecdsa-signing-how-do-i-generate-the-recovery-id

      let sigV = CHAINID * 2 + 35 + recovid;

      let thobj = pendingTxnQueue[0]

      let hextx = {
        nonce: thobj.nonce,
        gasPrice: thobj.gasPrice,
        gasLimit: thobj.gasLimit,
        to: thobj.to,
        value: thobj.value,
        data: thobj.data,
        v: sigV,
        r: sigR,
        s: sigS
      }

      pendingTxnQueue[0] = hextx
    }
    catch( e ) {
      console.log( e.toString() )
    }

    setMainScreen( true );
    setTimeout( processQueue, 100 )
  }

  function qTransaction( txho ) {
    pendingTxnQueue.push( txho )
  }

  function processQueue() {
    if (pendingTxnQueue.length == 0) {
      setMainScreen( true )
      return
    }

    let thobj = pendingTxnQueue[0]

    let descrip = thobj.description

    if (thobj.r && thobj.s && thobj.v) {
      let signedtx = ETHJS.Transaction.fromTxData( thobj );
      let serializedtx = '0x' + signedtx.serialize().toString('hex')
      COMMONMODEL.sendRawTx( serializedtx );
      pendingTxnQueue.shift() // removes first element
      setTimeout( function() { PubSub.publish('TransactionSent') }, 100 )
      setTimeout( processQueue, 100 )
      return
    }

    // needs user's sig
    let tx = ETHJS.Transaction.fromTxData( thobj );
    let hashToSign = COMMONMODEL.bytesToHex( tx.getMessageToSign() );
    getSignature( hashToSign, descrip )
  }

  async function rollTransaction( txobj, descrip ) {

    console.log( 'rolling:\n' + JSON.stringify(txobj) )

    let user = ACCOUNTMODEL.getUser();

    if (user.privkey) {
      let web3 = COMMONMODEL.getWeb3();
      let sigObj = await web3.eth.accounts.signTransaction(
        txobj, user.privkey.toString('hex') );

      web3.eth.sendSignedTransaction( sigObj.rawTransaction, (err,res) => {
        if (err)
          COMMONVIEW.userAlert( 'err: ' + err.toString() );
        else
          COMMONVIEW.userAlert( descrip + '\ntx: ' + res );
      } );
    } else {
      let hxo = {
        nonce: COMMONMODEL.toHex(txobj.nonce),
        gasPrice: COMMONMODEL.toHex(txobj.gasPrice),
        gasLimit: COMMONMODEL.toHex(txobj.gas),
        to: txobj.to,
        value: COMMONMODEL.toHex(txobj.value),
        data: txobj.data
      }
      hxo.description = descrip
      PubSub.publish( 'QueueTxnHex', hxo )
      processQueue()
    }
  }

  PubSub.subscribe( 'MainScreen', () => { setMainScreen(true) } )

  PubSub.subscribe( 'DoChallenge', (chB64) => { challenge(chB64) } )
  PubSub.subscribe( 'ScanResponse', () => { respond() } )
  PubSub.subscribe( 'QRScanned', (scan) => { qrScanned(scan) } )
  PubSub.subscribe( 'CancelResponse', () => { cancelResponse() } )

  PubSub.subscribe( 'QueueTxnHex', (txnhexobj) => { qTransaction(txnhexobj) } )

  return {
    setMainScreen:setMainScreen,
    respond:respond,
    cancelResponse:cancelResponse,
    qrScanned:qrScanned,
    processQueue:processQueue,
    rollTransaction:rollTransaction
  };

})();

