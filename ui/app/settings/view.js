var SETTINGSVIEW = (function() {

  function getWSUrl() {
    return $( "#WSURLValue" ).val();
  }

  function connection( isup ) {
    let fld = $( "#WSURLValue" );

    if (isup) {
      fld.attr( "class", "data" );
    }
    else {
      fld.attr( "class", "reddata" );
    }
  }

  function gasPrice() {
    return $( "#GasTextValue" ).val();
  }

  function setGasPrice( gpwei ) {
    $( "#GasTextValue" ).val( gpwei );
    $( "#GasPriceGwei" ).html(
      '(' + COMMONMODEL.fromWei(gpwei,'Gwei') + ' Gwei)' );
  }

  function setSCA( sca ) {
    $( "#SCAValue" ).html( sca );
  }

  function setChitSCA( sca ) {
    $( "#ChitSCAValue" ).html( sca )
  }

  function setChitMarketSCA( sca ) {
    $( "#ChitMarketSCAValue" ).html( sca )
  }

  function setBalanceEth( bal ) {
    $( "#BotBalanceValue" ).html( bal + ' eth' );
  }

  function setFee( widget, feewei ) {
    let fee = COMMONMODEL.fromWei( feewei, 'szabo' ) + ' szabo';
    widget.html( fee );
  }

  function setMakerFee( f ) {
    setFee( $("#MakerFeeValue"), f );
  }

  function setTakerFee( f ) {
    setFee( $("#TakerFeeValue"), f );
  }

  function setUpdateFee( f ) {
    setFee( $("#UpdateFeeValue"), f );
  }

  function setCancelFee( f ) {
    setFee( $("#CancelFeeValue"), f );
  }

  return {
    getWSUrl:getWSUrl,
    connection:connection,
    gasPrice:gasPrice,
    setGasPrice:setGasPrice,
    setSCA:setSCA,
    setChitSCA:setChitSCA,
    setChitMarketSCA:setChitMarketSCA,
    setBalanceEth:setBalanceEth,
    setMakerFee:setMakerFee,
    setTakerFee:setTakerFee,
    setUpdateFee:setUpdateFee,
    setCancelFee:setCancelFee
  };

})();

