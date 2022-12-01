var BUYLISTINGDLG = (function() {

  var chit

  async function showDialog( chitId ) {
    $( "#PortfolioListings" ).hide();
    $( "#TakeListingDialog" ).show();
    $( "#TakeListingIdValue" ).html( chitId )

    chit = await chitfactory.getChit( chitId )

    if (chit) {
      let desc = await COMMONVIEW.qtyToString(
        chit.itemType, chit.itemAmount.toString(), chit.itemTokenId )

      $( '#TakeAssetValue' ).html( desc )
    }
    else
      $( '#TakeAssetValue' ).html( '???' )

    calcTxs()
  }

  function closeDialog() {
    $( "#TakeListingDialog" ).hide();
    $( "#PortfolioListings" ).show();
  }

  async function calcTxs() {

    chitfactory.takerFee( async tf => {

      let estimate = COMMONVIEW.estimateTxnDollars(
        ERC721.APPROVEGAS, SETTINGSVIEW.gasPrice(), 0 )

      let val = "CHIT.approve( CHITFACTORY, tokenId=" + chit.chitId + " )\n" +
                "{ gas: " + ERC721.APPROVEGAS + ",\n" +
                "  gasPrice: " + SETTINGSVIEW.gasPrice() + ",\n" +
                "  value: 0 }\n" +
                "Estimate: $" + estimate + "\n\n"

      estimate = COMMONVIEW.estimateTxnDollars(
        chitfactory.TAKEGAS(), SETTINGSVIEW.gasPrice(), tf )

         val += "CHITFACTORY.take( chitId=" + chit.chitId + " )\n" +
                "{ gas: " + chitfactory.TAKEGAS() + ",\n" +
                "  gasPrice: " + SETTINGSVIEW.gasPrice() + ",\n" +
                "  value: " + tf + " }\n" +
                "Estimate: $" + estimate + "\n\n"

      if (chit.itemAmount == 0) {
        let erc = await ERC721.fetchAsync( chit.itemType )
        val += 'ERC721: ' + erc.symbol() +
               '.transferFrom( from=CHITFACTORY, to=me, tokenId=' +
               chit.itemTokenId + ' )\n' +
                "{ gas: " + ERC721.TRANSFERFROMGAS + ",\n" +
                "  gasPrice: " + SETTINGSVIEW.gasPrice() + ",\n" +
                "  value: 0 }\n\n"
      }
      else if (! /^0[xX]0+$/.test(chit.itemType)) {
        let erc = await ERC20.fetchAsync( chit.itemType )
        val += 'ERC20: ' + erc.symbol() +
               '.transferFrom( from=CHITFACTORY, to=me, amount=' +
               chit.itemAmount + ' )\n' +
                "{ gas: " + ERC20.TRANSFERFROMGAS + ",\n" +
                "  gasPrice: " + SETTINGSVIEW.gasPrice() + ",\n" +
                "  value: 0 }\n\n"
      }

      $( "#TakeListingTxsValue" ).html( '<pre>' + val + '</pre>' );
    } )
  }

  async function ok() {

    let user = ACCOUNTMODEL.getUser();
    if ( !user || !user.address || user.address.length == 0 ) {
      COMMONVIEW.userAlert( "Please LOGIN first" );
      return;
    }

    await chitfactory.take( chit.chitId, SETTINGSVIEW.gasPrice() )

    if (! /^0[xX]0+$/.test(chit.itemType)) {
      if (chit.itemAmount == 0) {
        let erc = await ERC721.fetchAsync( chit.itemType )
        erc.transferFrom( chitfactory.sca(), user.address, chit.itemTokenId )
      }
      else {
        let erc = await ERC20.fetchAsync( chit.itemType )
        await erc.transferFrom( chitfactory.sca(),
                                user.address,
                                chit.itemAmount.toString() )
      }
    }

    PORTFOLIOVIEW.refreshListings()
    closeDialog()
  }

  function canceled() {
    closeDialog();
  }

  PubSub.subscribe( 'MainScreen', () => { closeDialog() } )

  PubSub.subscribe( 'TakeListing', id => {
    showDialog( id );
  } )

  return {
    showDialog:showDialog,
    closeDialog:closeDialog,
    ok:ok,
    canceled:canceled
  };

})();

