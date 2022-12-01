var WALLETCTRL = (function() {

  function initWalletTab() {
    WALLETVIEW.clearFields();
  }

  function calcTx() {
    let amt = WALLETVIEW.getAmount();
    let cdat = WALLETVIEW.getCalldata();
    let gas = COMMONMODEL.ethTransferGasUnits();
    if (cdat) gas += cdat.length * 100; // should be 68, but safety margin
    let valwei = COMMONVIEW.shiftValueRightDecimals( amt, 18 )

    let estimate = COMMONVIEW.estimateTxnDollars(
      gas, SETTINGSVIEW.gasPrice(), valwei )

    WALLETVIEW.setTransaction(
      '{ from: ' + ACCOUNTMODEL.getUser().address + ',\n' +
      '  to: ' + WALLETVIEW.getToAddress() + ',\n' +
      '  value: ' + valwei + ',\n' +
      (cdat ? ('  data: ' + COMMONMODEL.toUtf8Hex(cdat) + ',\n') : '') +
      '  gas: ' + gas + ',\n' +
      '  gasPrice: ' + SETTINGSVIEW.gasPrice() + ' }' + '\n' +
      'Estimate: $' + estimate + '\n'
    );
  }

  function sendEther() {
    let toaddr = WALLETVIEW.getToAddress();
    let gprix = SETTINGSVIEW.gasPrice();
    let calldata = WALLETVIEW.getCalldata();
    let amtwei =
      COMMONVIEW.shiftValueRightDecimals( WALLETVIEW.getAmount(), 18 );

    WALLETMODEL.sendEth( toaddr, amtwei, calldata, gprix )
    WALLETVIEW.clearFields();
    initWalletTab();
  }

  async function tokenSelected( sca ) {
    let tok = await ERC20.fetchAsync( sca );

    if (null == tok || !sca || /^0[xX]0+$/.test(sca) ) {
      WALLETVIEW.setTokenBalance( 0 );
      return;
    }

    tok.balanceOf(
      ACCOUNTMODEL.getUser().address,
      err => { console.log( err.toString() ) },
      res => {
        if (res == 0)
          res = "0" + "0".repeat(tok.decimals);

        let val = COMMONVIEW.shiftValueLeftDecimals( res, tok.decimals() );
        WALLETVIEW.setTokenBalance( val );
      }
    );

    calcTokenTx();
  }

  async function calcTokenTx() {

    let is20 = WALLETVIEW.getSelectedTokenType() === 'ERC20'; // else ERC721
    let sca = WALLETVIEW.getTokenSCA()
    let to = WALLETVIEW.getTokenToAddress();
    let amt = ""
    let tid = ""
    let method = 'transfer'
    let erc = null
    let gas = 0

    if (is20) {
      erc = await ERC20.fetchAsync( sca );
      gas = ERC20.TRANSFERGAS
      amt = WALLETVIEW.getTokenAmount()
      if (amt) amt = COMMONVIEW.shiftValueRightDecimals( amt, erc.decimals() )
    }
    else {
      erc = await ERC721.fetchAsync( sca );
      gas = ERC721.APPROVEGAS
      tid = WALLETVIEW.getTokenId()
      method = 'approve'
    }

    let estimate = COMMONVIEW.estimateTxnDollars(
      gas, SETTINGSVIEW.gasPrice(), 0 )

    WALLETVIEW.setTokenTransaction(
      ((erc) ? erc.symbol() : "") + '.' + method + '(to=' + to + ', ' +
      ((is20) ? ('amt=' + amt) : ('tokenId=' + tid)) +
      ')\n' +
      '{ from: ' + ACCOUNTMODEL.getUser().address + ',\n' +
      '  to: ' + to + ',\n' +
      '  gas: ' + gas + ',\n' +
      '  gasPrice: ' + SETTINGSVIEW.gasPrice() + ' }' + '\n' +
      'Estimate: $' + estimate + '\n'
    );
  }

  async function transferTokens() {

    let is20 = WALLETVIEW.getSelectedTokenType() === 'ERC20'; // else ERC721
    let sca = WALLETVIEW.getTokenSCA()
    let to = WALLETVIEW.getTokenToAddress();
    let amt = ""
    let tid = ""

    let erc = null

    if (is20) {
      erc = await ERC20.fetchAsync( WALLETVIEW.getTokenSCA() );
      amt = WALLETVIEW.getTokenAmount()
      if (amt) amt = COMMONVIEW.shiftValueRightDecimals( amt, erc.decimals() )
      erc.transfer( to, amt )
    }
    else {
      erc = await ERC721.fetchAsync( WALLETVIEW.getTokenSCA() );
      tid = WALLETVIEW.getTokenId()
      erc.approve( to, tid )
    }

    initWalletTab();
  }

  PubSub.subscribe( 'NewXferTokenType', typ => {
    if (typ === 'ERC20') {
      $( "#TokenAmountLabel" ).html( STRINGS[LANG].TokenAmountLabel );
      $( "#WalletUseONFT" ).hide()
    }
    else { // ERC721
      $( "#TokenAmountLabel" ).html( 'TokenId:' )
      $( "#WalletUseONFT" ).show()
    }

    calcTokenTx()
  } )

  PubSub.subscribe( 'TransferTokenSCAChanged', async sca => {
    if ( $('#XferTokenType').val() === 'ERC20') {
      tokenSelected(sca)
      return
    }

    if (!sca || sca.length == 0) {
      WALLETVIEW.setTokenBalance( '' )
      return
    }

    let tok = await ERC721.fetchAsync( sca.toLowerCase() )
    if (null == tok) return

    tok.balanceOf( ACCOUNTMODEL.getUser().address, err => {
      console.log( err )
    }, res => {
      WALLETVIEW.setTokenBalance( res )
    } )

    calcTokenTx()
  } )

  PubSub.subscribe( 'WalletUseONFTSCA', async () => {

    $( "#TokenSCAValue" ).val( OPTIONFACTORY.nftSCA() )
    let erc = await ERC721.fetchAsync( OPTIONFACTORY.nftSCA() )
    if (!erc) return

    erc.balanceOf( ACCOUNTMODEL.getUser().address, err => {
      console.log( err )
    }, res => {
      WALLETVIEW.setTokenBalance( res )
    } )
  } )

  return {
    initWalletTab:initWalletTab,
    calcTx:calcTx,
    sendEther:sendEther,
    tokenSelected:tokenSelected,
    calcTokenTx:calcTokenTx,
    transferTokens:transferTokens
  };

})();

