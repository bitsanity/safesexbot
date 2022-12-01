var COMMONMODEL = (function() {

  var web3;

  function ethTransferGasUnits() {
    // 21000 plus a little for fallback logic - remember excess is returned
    return 33000;
  }

  function tokTransferGasUnits() {
    // should be around 67k but allow more for any extra callbacks
    return 100000;
  }

  function nftTransferGasUnits() {
    // should be around 67k but allow more for any extra callbacks
    return 200000;
  }

  function Ξconnect( wsurl, errcb, rescb ) {
    web3 = new Web3( new Web3.providers.WebsocketProvider(wsurl) );
    ΞgetGasPrice(
      er => { errcb( wsurl + ' ' + er.toString() ); },
      gp => { rescb( gp ); }
    );
  }

  function ΞgetWeb3() {
    return web3;
  }

  function ΞgetGasPrice( errcb, rescb ) {
    web3.eth.getGasPrice()
    .then( gp => {
      rescb( gp );
    } )
    .catch( err => { errcb( err ); } );
  }

  function Ξkeccak( something ) {
    return web3.utils.sha3( something );
  }

  function ΞbytesToHex( bytes ) {
    return web3.utils.bytesToHex( bytes );
  }

  function ΞhexToBytes( hexstr ) {
    return web3.utils.hexToBytes( hexstr );
  }

  function ΞfromWei( amt, units ) {
    return web3.utils.fromWei( amt, units );
  }

  function amountToWei( str ) {
    let parts = str.split( " ", 3 );

    if (parts.length == 0) return 0;
    if (parts.length == 1) // no units so must be in wei
      return parseInt( str );

    if (parts.length == 2)
      return web3.utils.toWei( parts[0], parts[1] );
  }

  function toUtf8Hex( str ) {
    if (!str || str.length == 0) return "";
    return web3.utils.utf8ToHex( str );
  }

  function toHex( any ) {
    return web3.utils.toHex( any );
  }

  // caller must increment nonce
  function sendEth(
    fromacct,
    nonceval,
    privkey,
    toacct,
    amtwei,
    calldata,
    gprix ) {

    let gasu = ethTransferGasUnits();

    if (calldata)
      gasu += calldata.length * 100; // 68 plus 32 safety = 100

    let txobj = { from: fromacct,
                  to: toacct,
                  nonce: nonceval,
                  value: amtwei,
                  gas: gasu,
                  gasPrice: gprix }

    if (calldata) txobj.data = '' + calldata;

    web3.eth.accounts.signTransaction( txobj, privkey.toString('hex') )
    .then( sigtx => {

      web3.eth.sendSignedTransaction(
        sigtx.rawTransaction,
        (err,res) => {
          if (err)
            COMMONVIEW.userAlert( err );
          else
            COMMONVIEW.userAlert( res );
        } );
    } )
    .catch( err => {
      COMMONVIEW.userAlert( err );
    } );
  }

  function sendRawTx( txhex ) {
    web3.eth.sendSignedTransaction( txhex, (err,res) => {
      if (err) {
        setTimeout( COMMONVIEW.userAlert( err ), 250 );
        return;
      }

      setTimeout( COMMONVIEW.userAlert( "Tx: " + res ), 250 );
    } );
  }

  return {
    ethTransferGasUnits:ethTransferGasUnits,
    tokTransferGasUnits:tokTransferGasUnits,
    nftTransferGasUnits:nftTransferGasUnits,
    connect:Ξconnect,
    getWeb3:ΞgetWeb3,
    getGasPrice:ΞgetGasPrice,
    keccak:Ξkeccak,
    bytesToHex:ΞbytesToHex,
    hexToBytes:ΞhexToBytes,
    fromWei:ΞfromWei,
    amountToWei:amountToWei,
    toUtf8Hex:toUtf8Hex,
    toHex:toHex,
    sendEth:sendEth,
    sendRawTx:sendRawTx
  };

})();
