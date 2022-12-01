var WALLETVIEW = (function() {

  function getToAddress() {
    return $( "#SendToAddrValue" ).val();
  }

  function getAmount() {
    return $( "#SendAmountValue" ).val();
  }

  function getCalldata() {
    return $( "#SendCalldataValue" ).val();
  }

  function setTransaction( val ) {
    $( "#SendEthTxValue" ).html( '<pre>' + val + '</pre>' );
  }

  function getSelectedTokenType() {
    return $( "#XferTokenType" ).val();
  }

  function getTokenSCA() {
    let result = $( "#TokenSCAValue" ).val();
    if (result) result = result.toLowerCase()
    return result
  }

  function getTokenToAddress() {
    return $( "#TokenToValue" ).val();
  }

  function getTokenAmount() {
    return $( "#TokenAmountValue" ).val();
  }

  function getTokenId() {
    return $( "#TokenAmountValue" ).val();
  }

  function setTokenTransaction( val ) {
    $( "#TokenTxValue" ).html( '<pre>' + val + '</pre>' );
  }

  function clearFields() {
    $( "#SendToAddrValue" ).val( "" );
    $( "#SendAmountValue" ).val( "" );
    $( "#SendCalldataValue" ).val( "" );
    $( "#SendEthTxValue" ).html( "" );
    $( "#TokenSCAValue" ).val( "" );
    $( "#TokenToValue" ).val( "" );
    $( "#TokenAmountValue" ).val( "" );
    $( "#TokenTxValue" ).html( "" );

   $( "#WalletUseONFT" ).hide()
   $( "#XferTokenType" ).val( 'ERC20' );
  }

  function setTokenBalance( val ) {
    $( '#MyTokenBalValue' ).html( val );
  }

  return {
    getToAddress:getToAddress,
    getAmount:getAmount,
    getCalldata:getCalldata,
    setTransaction:setTransaction,
    clearFields:clearFields,

    setTokenBalance:setTokenBalance,

    getSelectedTokenType:getSelectedTokenType,
    getTokenSCA:getTokenSCA,
    getTokenToAddress:getTokenToAddress,
    getTokenAmount:getTokenAmount,
    getTokenId:getTokenId,
    setTokenTransaction:setTokenTransaction
  };

})();

