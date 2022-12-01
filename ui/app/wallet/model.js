var WALLETMODEL = (function() {

  function sendEth( toacct, amtwei, calldata, gprix ) {

    let user = ACCOUNTMODEL.getUser();
    let cdat = (calldata && calldata.length > 0)
                 ?  COMMONMODEL.toUtf8Hex(calldata)
                 : '';

    COMMONMODEL.sendEth(
      user.address,
      user.nonce++,
      user.privkey,
      toacct,
      amtwei,
      cdat,
      gprix )
  }

  return {
    sendEth:sendEth
  };

})();

