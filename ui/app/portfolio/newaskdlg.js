var NEWASKDLG = (function() {

  function showDialog() {
    $( "#PortfolioListings" ).hide();
    $( "#AsksDialog" ).hide();

    $( "#NewAskAssetChitIdValue" ).html('');
    $( "#NewAskAssetDescripValue" ).html('');
    $( "#NewAskItemTypeCB" ).val( 'ETH' );
    $( "#NewAskETH" ).val( '1.000000000000000000' );
    $( "#NewAskERC20SCA" ).val( '' );
    $( "#NewAskERC20Units" ).val( '1000000000000000000' );
    $( "#NewAskERC721SCA" ).val( '' );
    $( "#NewAskERC721TokenId" ).val( '0' );
    $( "#NewAskTxsValue" ).html( '' );

    $( '#NewAskETHFields' ).show()
    $( '#NewAskERC20Fields' ).hide()
    $( '#NewAskERC721Fields' ).hide()

    $( "#NewAskDialog" ).show();
  }

  function closeDialog() {
    $( "#NewAskDialog" ).hide();
    $( "#PortfolioListings" ).hide();
    $( "#AsksDialog" ).show();
  }

  async function setAssetChit( assetChitId ) {
    $( '#NewAskAssetChitIdValue' ).html( assetChitId )

    let chit = await chitfactory.getChit( assetChitId )

    if (!chit) return

    let desc = await COMMONVIEW.qtyToString(
      chit.itemType, chit.itemAmount.toString(), chit.itemTokenId )

    $( '#NewAskAssetDescripValue' ).html( desc )

    setTimeout( calcTxs, 100 )
  }

  function setTransactions( contents ) {
    $( "#NewAskTxsValue" ).html( '<pre>\n' + contents + '</pre>' );
  }

  async function calcTxs() {
    let askType = '';
    let askAmount = '0';
    let askTokenId = '0';

    if ( $("#NewAskItemTypeCB").val() === 'ETH') {
      askType = 'ether'
      askAmount = $( '#NewAskETH' ).val()
    } else if ( $("#NewAskItemTypeCB").val() === 'ERC20') {
      erc = await ERC20.fetchAsync( $("#NewAskERC20SCA").val() )
      if (erc) askType = 'ERC20:' + erc.symbol()
      else askType = '??? '
      askAmount = $( '#NewAskERC20Units' ).val()
    } else {
      erc = await ERC721.fetchAsync( $("#NewAskERC721SCA").val() )
      if (erc) askType = 'ERC721:' + erc.symbol()
      else askType = '??? '
      askTokenId = $( '#NewAskERC721TokenId' ).val()
    }

    let estimate = COMMONVIEW.estimateTxnDollars(
        CHITMARKET.ASKGAS(), SETTINGSVIEW.gasPrice(), 0 )

    let result =
      'CHITMARKET.ask(\n  assetChitId=' +
        $( '#NewAskAssetChitIdValue' ).html() + ',\n  ' +
      'askType=' + askType + ',\n  ' +
      'askAmount=' + askAmount + ',\n  ' +
      'askTokenId=' + askTokenId + ' )\n' +
      'value: 0\n' +
      'gas: ' + CHITMARKET.ASKGAS() + '\n' +
      'gasPrice: ' +
        COMMONMODEL.fromWei( SETTINGSVIEW.gasPrice(), 'Gwei' ) +
        ' Gwei' + '\n' +
      'Estimate: $' + estimate + '\n'

    setTransactions( result )
  }

  async function ok() {
    let user = ACCOUNTMODEL.getUser();
    if ( !user || !user.address || user.address.length == 0 ) {
      COMMONVIEW.userAlert( "Please LOGIN first" );
      return;
    }

    let askType = '';
    let askAmount = '0';
    let askTokenId = '0';

    if ( $("#NewAskItemTypeCB").val() === 'ETH') {
      askType = '0x0000000000000000000000000000000000000000'
      askAmount =
        COMMONVIEW.shiftValueRightDecimals( $('#NewAskETH').val(), 18 )
    } else if ( $("#NewAskItemTypeCB").val() === 'ERC20') {
      askType = $( "#NewAskERC20SCA" ).val()
      let erc20 = await ERC20.fetch( askType )
      askAmount = $('#NewAskERC20Units').val()
    } else {
      askType = $( '#NewAskERC721SCA' ).val()
      askTokenId = $( '#NewAskERC721TokenId' ).val()
    }

    CHITMARKET.ask( $('#NewAskAssetChitIdValue').html(),
                    askType,
                    askAmount,
                    askTokenId,
                    SETTINGSVIEW.gasPrice() )

    PORTFOLIOCTRL.initPortfolioTab()

    setTimeout( () => { PubSub.publish('MainScreen'), 200 } )
  }

  function canceled() {
    closeDialog();
  }

  PubSub.subscribe( 'MainScreen', () => { closeDialog() } )

  PubSub.subscribe( 'NewAsk', () => {
    showDialog()
    setAssetChit( $( '#AsksChitIdValue').html() )
  } )

  PubSub.subscribe( 'NewAskItemType', typ => {
    if (typ === 'ETH') {
      $( '#NewAskETHFields' ).show()
      $( '#NewAskERC20Fields' ).hide()
      $( '#NewAskERC721Fields' ).hide()
    }
    else if (typ === 'ERC20') {
      $( '#NewAskETHFields' ).hide()
      $( '#NewAskERC20Fields' ).show()
      $( '#NewAskERC721Fields' ).hide()
    }
    else {
      $( '#NewAskETHFields' ).hide()
      $( '#NewAskERC20Fields' ).hide()
      $( '#NewAskERC721Fields' ).show()
    }

    calcTxs()
  } )

  return {
    showDialog:showDialog,
    closeDialog:closeDialog,
    calcTxs:calcTxs,
    ok:ok,
    canceled:canceled
  };

})();

