var NEWLISTINGDLG = (function() {

  function showDialog() {
    $( "#PortfolioListings" ).hide();

    $( "#NewListingSellerValue" ).html( ACCOUNTMODEL.getUser().address );
    $( "#NewListingItemTypeCB" ).val( 'ETH' );
    $( "#NewListingETH" ).val( '1.000000000000000000' );
    $( "#NewListingERC20SCA" ).val( '' );
    $( "#NewListingERC20Units" ).val( '1000000000000000000' );
    $( "#NewListingERC721SCA" ).val( '' );
    $( "#NewListingERC721TokenId" ).val( '0' );
    $( "#NewListingTxsValue" ).html( '' );

    $( '#NewListingItemType' ).val( 'ETH' )
    $( '#NewListingETHFields' ).show()
    $( '#NewListingERC20Fields' ).hide()
    $( '#NewListingERC721Fields' ).hide()
    $( '#ChitNFTDataValue' ).val('')
    $( "#NewListingDialog" ).show();

    setTimeout( calcTxs, 100 )
  }

  function closeDialog() {
    $( "#NewListingDialog" ).hide();
    $( "#AsksDialog" ).hide();
    $( "#PortfolioListings" ).show();
  }

  function setTransactions( contents ) {
    $( "#NewListingTxsValue" ).html( '<pre>\n' + contents + '</pre>' );
  }

  function calcTxs() {

    chitfactory.makerFee( async makefee => {

      let val = BigInt(makefee)

      let erc = null
      let contents = ''
      let gas = 0
      let gwei = COMMONMODEL.fromWei( SETTINGSVIEW.gasPrice(), 'Gwei' );

      if ( $("#NewListingItemTypeCB").val() === 'ETH' ) {
        let weistr =
          COMMONVIEW.shiftValueRightDecimals( $("#NewListingETH").val(), 18 )
        val += BigInt( weistr )
        gas = COMMONMODEL.ethTransferGasUnits()
      } else if ( $("#NewListingItemTypeCB").val() === 'ERC20' ) {
        gas = ERC20.APPROVEGAS
        erc = await ERC20.fetchAsync( $("#NewListingERC20SCA").val() )
        if (erc) {
          contents += erc.symbol()
        }
        else {
          contents += $("#NewListingERC20SCA").val()
        }

        let estimate = COMMONVIEW.estimateTxnDollars(
          gas, SETTINGSVIEW.gasPrice(), 0 )

        contents += '.approve( spender=CHITFACTORY, units=' +
                     $("#NewListingERC20Units").val() + ' )\n' +
                    'value: 0\n' +
                    'gas: ' + gas + '\n' +
                    'gasPrice: ' + gwei + ' Gwei\n' +
                    'Estimate: $' + estimate + '\n\n'
      }
      else {
        gas = ERC721.APPROVEGAS
        erc = await ERC721.fetchAsync( $( "#NewListingERC721SCA" ).val() )
        if (erc) {
          contents += erc.symbol()
        }
        else {
          contents += $("#NewListingERC721SCA").val()
        }

        let est2 = COMMONVIEW.estimateTxnDollars(
          gas, SETTINGSVIEW.gasPrice(), 0 )

        contents += '.approve( spender=CHITFACTORY, tokenId=' +
                     $("#NewListingERC721TokenId").val() + ' )\n' +
                    'value: 0\n' +
                    'gas: ' + gas + '\n' +
                    'gasPrice: ' + gwei + ' Gwei\n' +
                    'Estimate: $' + est2 + '\n\n'
      }

      let est3 = COMMONVIEW.estimateTxnDollars(
          chitfactory.MAKEGAS(), SETTINGSVIEW.gasPrice(), val.toString() )

      contents +=
        'CHITFACTORY.make()\n' +
        'value: ' + COMMONMODEL.fromWei(val.toString(), 'szabo') + ' szabo\n' +
        'gas: ' + chitfactory.MAKEGAS() + '\n' +
        'gasPrice: ' + gwei + ' Gwei\n' +
        'Estimate: $' + est3 + '\n'

      setTransactions( contents );
    } );
  }

  async function ok() {
    let user = ACCOUNTMODEL.getUser();
    if ( !user || !user.address || user.address.length == 0 ) {
      COMMONVIEW.userAlert( "Please LOGIN first" );
      return;
    }

    let itemType = '0x0000000000000000000000000000000000000000'
    let itemAmount = $("#NewListingETH").val()
    let itemTokenId = 0
    let nftdata = $("#ChitNFTDataValue").val()

    if ( $("#NewListingItemTypeCB").val() === 'ETH' ) {
      itemAmount = COMMONVIEW.shiftValueRightDecimals( itemAmount, 18 )
      if (BigInt(itemAmount) == BigInt(0) ) {
        COMMONVIEW.userAlert( "Invalid ether amount" );
        return
      }
    }

    if ( $("#NewListingItemTypeCB").val() === 'ERC20' ) {
      itemType = $("#NewListingERC20SCA").val()
      itemAmount = $( "#NewListingERC20Units" ).val()
      if (itemAmount == 0) {
        COMMONVIEW.userAlert( "Invalid token units" );
        return
      }

      let erc = await ERC20.fetchAsync( itemType )
      await erc.approve( chitfactory.sca(), itemAmount )
    }

    if ( $("#NewListingItemTypeCB").val() === 'ERC721' ) {
      itemType = $("#NewListingERC721SCA").val()
      itemTokenId = parseInt( $("#NewListingERC721TokenId").val() )
      itemAmount = 0
      let erc = await ERC721.fetchAsync( itemType )
      erc.approve( chitfactory.sca(), itemTokenId )
    }

    if ( itemType.length != 42 || !/^0[xX][a-fA-F0-9]+$/.test(itemType) ) {
      COMMONVIEW.userAlert( "Invalid SCA" );
      return
    }

    await chitfactory.make( itemAmount, itemType, itemTokenId, nftdata,
                            SETTINGSVIEW.gasPrice() )

    closeDialog()
  }

  function canceled() {
    closeDialog()
  }

  PubSub.subscribe( 'MainScreen', () => { closeDialog() } )
  PubSub.subscribe( 'MakeNewListing', () => { showDialog() } )

  PubSub.subscribe( 'NewListingItemType', typ => {
    if (typ === 'ETH') {
      $( '#NewListingETHFields' ).show()
      $( '#NewListingERC20Fields' ).hide()
      $( '#NewListingERC721Fields' ).hide()
    }
    else if (typ === 'ERC20') {
      $( '#NewListingETHFields' ).hide()
      $( '#NewListingERC20Fields' ).show()
      $( '#NewListingERC721Fields' ).hide()
    }
    else {
      $( '#NewListingETHFields' ).hide()
      $( '#NewListingERC20Fields' ).hide()
      $( '#NewListingERC721Fields' ).show()
    }
    calcTxs()
  } )

  PubSub.subscribe( 'NewListingUseOptionNFTSCA', () => {
    let sca = OPTIONFACTORY.nftSCA()
    if (!sca) return
    $( "#NewListingERC721SCA" ).val( sca )
  } )

  PubSub.subscribe( 'NewListingUseChitNFTSCA', () => {
    let sca = chitfactory.chitsca()
    if (!sca) return
    $( "#NewListingERC721SCA" ).val( sca )
  } )

  return {
    showDialog:showDialog,
    closeDialog:closeDialog,
    calcTxs:calcTxs,
    ok:ok,
    canceled:canceled
  };

})();

