var OPTIONSCTRL = (function() {

  const SECSPERDAY = 60 * 60 * 24;

  function init() {
    OPTIONFACTORY.fetchEvents()
    setTimeout( () => { refreshListings(true,true) }, 500 )
    setPairLabels( $( "#OptionTypeCB" ).val() )
  }

  function setPairLabels( otype ) {
    if (otype === 'CALL') {
      $( "#OptionPairFirstLabel" ).html( STRINGS[LANG].OptionCollateralLabel )
      $( "#OptionPairSecondLabel" ).html( STRINGS[LANG].OptionSettlementLabel )
    }
    else {
      $( "#OptionPairFirstLabel" ).html( STRINGS[LANG].OptionSettlementLabel )
      $( "#OptionPairSecondLabel" ).html( STRINGS[LANG].OptionCollateralLabel )
    }
  }

  function expiryFieldsToDate() {
    return new Date(
      Date.UTC(
        $( '#ExpiresYearField' ).val(),
        $( '#ExpiresMonField' ).val() - 1,
        $( '#ExpiresDayField' ).val(),
        $( '#ExpiresTimeField' ).val().substring(0,2),
        $( '#ExpiresTimeField' ).val().substring(2,4),
        0, //seconds
        0  //milliseconds
      )
    )
  }

  async function refreshListings( showMine, showOthers ) {
    $( '#GeneratedOptionsListings' ).children().remove()
    $( '#GeneratedOptionsListings' ).append(
        '<tr class=rowheader>' +
        '<th>' + STRINGS[LANG].OptionTokenIDHeading + '</th>' +
        '<th>' + STRINGS[LANG].OptionAgeHeading + '</th>' +
        '<th>' + STRINGS[LANG].OptionTypeHeading + '</th>' +
        '<th>' + STRINGS[LANG].OptionPairHeading + '</th>' +
        '<th>' + STRINGS[LANG].OptionExpiresHeading + '</th>' +
        '</tr>' )

    let tokIds = []
    if (showMine && !showOthers) {
      tokIds = OPTIONFACTORY.myOpenOffers()
    }
    if (!showMine && showOthers) {
      tokIds = OPTIONFACTORY.offersFromOthers()
    }
    if (showMine && showOthers) {
      tokIds = OPTIONFACTORY.allOpenOffers()
    }

    tokIds.forEach( async (id) => {
      let nft = await OPTIONFACTORY.getToken( id )
      if (!nft) return

      let tid = '' + id

      // agedays = current time (in seconds) - nft timestamp (in seconds)
      //           divided by seconds per day
      let agedays = Math.floor(
        ((new Date().getTime() / 1000) - nft.tstamp) / SECSPERDAY
      )

      agedays = '' + agedays

      let otype = (nft.optionType == 0) ? 'PUT' : 'CALL'
      let expiresDate = new Date( nft.expiration * 1000 )
      let expires = COMMONVIEW.timestampToZulu( expiresDate.getTime() / 1000 )

      let pair = await COMMONVIEW.qtyToString(
        nft.collatType, nft.collatAmount, nft.collatTokenId ) +
        ' / ' +
        await COMMONVIEW.qtyToString(
          nft.settleType, nft.settleAmount, nft.settleTokenId )

      let cancelbutton = '&nbsp;',
          takebutton = '&nbsp;'

      let onft = await ERC721.fetchAsync( OPTIONFACTORY.nftSCA() )
      let owner = (await onft.owner( id )).toLowerCase()

      if (ACCOUNTMODEL.getUser().address === owner) {
        cancelbutton =
          '<button class=cancelbutton ' +
          "onclick=\"PubSub.publish('CancelOption'," + id + ")\">" +
          STRINGS[LANG].CancelOptionButton + '</button>'

        takebutton = '<button class=okbutton ' +
          'onclick="PubSub.publish(\'TakeOption\',' + id + ')">' +
          STRINGS[LANG].TakeOptionButton + '</button>'
      }

      $( '#GeneratedOptionsListings' ).append(
        '<tr valign=top>' +
        '<td align=right>' + tid + '</td>' +
        '<td align=right>' + agedays + '</td>' +
        '<td align=right>' + otype + '</td>' +
        '<td align=left>' + pair + '</td>' +
        '<td align=right>' + expires + '</td>' +
        '<td>' + cancelbutton + '</td>' +
        '<td>' + takebutton + '</td>' +
        '</tr>' )
    } )
  }

  function newOptionAAAType(val) {
    $( '#OptionPairCB1' ).val( val )

    if (val == 'ETH') {
      $( '#ETHFields1' ).show()
      $( '#ERC20Fields1' ).hide()
      $( '#ERC721Fields1' ).hide()
    }

    if (val == 'ERC20') {
      $( '#ETHFields1' ).hide()
      $( '#ERC20Fields1' ).show()
      $( '#ERC721Fields1' ).hide()
    }

    if (val == 'ERC721') {
      $( '#ETHFields1' ).hide()
      $( '#ERC20Fields1' ).hide()
      $( '#ERC721Fields1' ).show()
    }
    calcTxs()
  }

  function newOptionBBBType(val) {
    $( '#OptionPairCB2' ).val( val )

    if (val == 'ETH') {
      $( '#ETHFields2' ).show()
      $( '#ERC20Fields2' ).hide()
      $( '#ERC721Fields2' ).hide()
    }

    if (val == 'ERC20') {
      $( '#ETHFields2' ).hide()
      $( '#ERC20Fields2' ).show()
      $( '#ERC721Fields2' ).hide()
    }

    if (val == 'ERC721') {
      $( '#ETHFields2' ).hide()
      $( '#ERC20Fields2' ).hide()
      $( '#ERC721Fields2' ).show()
    }
    calcTxs()
  }

  PubSub.subscribe( 'InitOptionsTab', () => {
    init()

    $( '#MakeOptionDialog' ).hide()
    $( '#OptionsTabContent' ).show()

    newOptionAAAType( 'ETH' )
    newOptionBBBType( 'ERC20' )

    let now = new Date()

    $( '#ExpiresDayField' ).val(
      (now.getUTCDate() < 10) ? '0' + now.getUTCDate() : now.getUTCDate() )
    let um = now.getUTCMonth() + 1
    $( '#ExpiresMonField' ).val( (um < 10) ? '0' + um : um )
    $( '#ExpiresYearField' ).val( now.getUTCFullYear() )
    let hrmm = now.getUTCHours() + '' + now.getUTCMinutes()
    while (hrmm.length < 4) hrmm = '0' + hrmm;
    $( '#ExpiresTimeField' ).val( hrmm )
  } )

  PubSub.subscribe( 'NewOptionCalcTxs', () => {
    calcTxs()
  } )

  // View toggles -----

  PubSub.subscribe( 'ShowMyOffers', () => {
    refreshListings( true, false )
  } )

  PubSub.subscribe( 'ShowOtherOffers', () => {
    refreshListings( false, true )
  } )

  PubSub.subscribe( 'ShowAllOffers', () => {
    refreshListings( true, true )
  } )

  // ----- View toggles

  PubSub.subscribe( 'MakeOption', () => {
    $( '#OptionsTabContent' ).hide()
    $( '#MakeOptionDialog' ).show()

    calcTxs()
  } )

  PubSub.subscribe( 'NewOptionAAAType', (val) => {
    newOptionAAAType( val )
    calcTxs()
  } )

  PubSub.subscribe( 'NewOptionBBBType', (val) => {
    newOptionBBBType( val )
    calcTxs()
  } )

  PubSub.subscribe( 'ConfirmOptionOk', () => {
    let it = expiryFieldsToDate()
    if (!it instanceof Date || isNaN(it.valueOf())) {
      alert( 'invalid date' )
      return
    }

    let now = new Date();
    if (it.getTime() <= now.getTime()) {
      alert( 'expiry date must be in the future' )
      return
    }

    let val = 0;

    if ( $('#OptionTypeCB').val() == 'CALL' ) {
      if ( $('#OptionPairCB1').val() == 'ETH' ) {
        val +=
          COMMONVIEW.shiftValueRightDecimals( $('#NewOptionETH1').val(), 18 )
      }
    }
    else { // is a put
      if ( $('#OptionPairCB2').val() == 'ETH' ) {
        val +=
          COMMONVIEW.shiftValueRightDecimals( $('#NewOptionETH2').val(), 18 )
      }
    }

    let isCall = $('#OptionTypeCB').val() === "CALL"

    let aaaType = OPTIONFACTORY.ZEROADDRESS, aaaAmount = 0, aaaTokenId = 0, 
        bbbType = OPTIONFACTORY.ZEROADDRESS, bbbAmount = 0, bbbTokenId = 0,
        data = $( '#OptionDataField').val()

    if ($('#OptionPairCB1').val() === "ETH") {
      aaaAmount =
        COMMONVIEW.shiftValueRightDecimals( $('#NewOptionETH1').val(), 18 )
    }
    else if ($('#OptionPairCB1').val() === "ERC20") {
      aaaType = $('#OptionPairERC20SCA1').val()
      aaaAmount = $('#NewOptionERC20Units1').val()
    }
    else {
      aaaType = $('#OptionPairERC721SCA1').val()
      aaaTokenId = $('#NewOptionERC721TokenId1').val()
    }

    if ($('#OptionPairCB2').val() === "ETH") {
      bbbAmount =
        COMMONVIEW.shiftValueRightDecimals( $('#NewOptionETH2').val(), 18 )
    }
    else if ($('#OptionPairCB2').val() === "ERC20") {
      bbbType = $('#OptionPairERC20SCA2').val()
      bbbAmount = $('#NewOptionERC20Units2').val()
    }
    else {
      bbbType = $('#OptionPairERC721SCA2').val()
      bbbTokenId = $('#NewOptionERC721TokenId2').val()
    }

    OPTIONFACTORY.make(
      $('#OptionTypeCB').val() === "CALL",
      aaaType, aaaAmount, aaaTokenId,
      bbbType, bbbAmount, bbbTokenId,
      Math.floor(it.getTime() / 1000), // date option expires, in seconds
      data )

    PubSub.publish( 'InitOptionsTab' )
  } )

  async function toSymbol( fieldname, sca ) {
    if (!sca || sca.length == 0)
      return null

    let sym = null

    if ( $(fieldname).val() == 'ETH' ) {
      sym = 'ETH'
    }
    else if ( $(fieldname).val() == 'ERC20' ) {
      sym = (await ERC20.fetchAsync( sca )).symbol()
    }
    else if ( $(fieldname).val() == 'ERC721' ) {
      sym = (await ERC721.fetchAsync( sca )).symbol()
    }

    return sym
  }

  async function calcTxs() {
    let msg = '<pre>'

    // work out the currency pair symbols
    let sym1, sym2
    if ( $('#OptionPairCB1').val() == 'ETH' )
      sym1 = 'ETH'
    else if ( $('#OptionPairCB1').val() == 'ERC20' )
      sym1 = await toSymbol( '#OptionPairCB1',
                               $('#OptionPairERC20SCA1').val() )
    else if ( $('#OptionPairCB1').val() == 'ERC721' )
      sym1 = await toSymbol( '#OptionPairCB1',
                               $('#OptionPairERC721SCA1').val() )

    if ( $('#OptionPairCB2').val() == 'ETH' )
      sym2 = 'ETH'
    else if ( $('#OptionPairCB2').val() == 'ERC20' )
      sym2 = await toSymbol( '#OptionPairCB2',
                             $('#OptionPairERC20SCA2').val() )
    else if ( $('#OptionPairCB2').val() == 'ERC721' )
      sym2 = await toSymbol( '#OptionPairCB2',
                             $('#OptionPairERC721SCA2').val() )

    // assemble result
    if ( $('#OptionTypeCB').val() == 'CALL' ) {
      if ( $('#OptionPairCB1').val() == 'ETH' ) {
        msg += '1. Provide ' + $('#NewOptionETH1').val() +
               ' eth to OPTIONFACTORY.make()\n\n'
      }
      if ( $('#OptionPairCB1').val() == 'ERC20' ) {
        let est = COMMONVIEW.estimateTxnDollars(
          ERC20.APPROVEGAS, SETTINGSVIEW.gasPrice(), 0 )

        msg += '1. ERC20.approve( OPTIONFACTORY, ' +
               $('#NewOptionERC20Units1').val() + ' units )\n' +
               'gas: ' + ERC20.APPROVEGAS + '\n' +
               'Estimate: $' + msg + '\n\n'
      }
      if ( $('#OptionPairCB1').val() == 'ERC721' ) {
        let est = COMMONVIEW.estimateTxnDollars(
          ERC721.APPROVEGAS, SETTINGSVIEW.gasPrice(), 0 )

        msg += '1. ERC721.approve( OPTIONFACTORY, tokenId=' +
               $('#NewOptionERC721TokenId1').val() + ' )\n' +
               'gas: ' + ERC721.APPROVEGAS + '\n' +
               'Estimate: $' + msg + '\n\n'
      }
    }
    else { // is a put
      if ( $('#OptionPairCB2').val() == 'ERC20' ) {
        let est = COMMONVIEW.estimateTxnDollars(
          ERC20.APPROVEGAS, SETTINGSVIEW.gasPrice(), 0 )

        msg += '1. ERC20.approve( OPTIONFACTORY, ' +
               $('#NewOptionERC20Units2').val() + ' units )\n' +
               'gas: ' + ERC20.APPROVEGAS + '\n' +
               'Estimate: $' + est + '\n\n'
      }
      if ( $('#OptionPairCB2').val() == 'ERC721' ) {
        let est = COMMONVIEW.estimateTxnDollars(
          ERC721.APPROVEGAS, SETTINGSVIEW.gasPrice(), 0 )

        msg += '1. ERC721.approve( OPTIONFACTORY, tokenId=' +
               $('#NewOptionERC721TokenId2').val() + ' )\n' +
               'gas: ' + ERC721.APPROVEGAS + '\n' +
               'Estimate: $' + est + '\n\n'
      }
      if ( $('#OptionPairCB2').val() == 'ETH' ) {
        msg += '1. Provide ' + $('#NewOptionETH2').val() +
               ' eth to OPTIONFACTORY.make()\n\n'
      }
    }

    let exdate = expiryFieldsToDate()
    let expiry = COMMONVIEW.timestampToZulu( exdate.getTime() / 1000 )

    let est = COMMONVIEW.estimateTxnDollars(
                OPTIONFACTORY.MAKEGAS(), SETTINGSVIEW.gasPrice(), 0 )

    msg += '2. OPTIONFACTORY.make( type=' + $('#OptionTypeCB').val() + ', ' +
               'pair=' +
               ((sym1) ? sym1 : '???') + '/' +
               ((sym2) ? sym2 : '???') + ', expiry=' + expiry +
           ' )\n' +
           'gas: ' + OPTIONFACTORY.MAKEGAS() + '\n' +
           'Estimate: $' + est + ' plus ETH value' + '\n'

    msg += '</pre>'
    $( "#MakeOptionTxValue" ).html( msg )
  }

  PubSub.subscribe( 'ConfirmOptionCancel', () => {
    $( '#MakeOptionDialog' ).hide()
    $( '#OptionsTabContent' ).show()
  } )

  PubSub.subscribe( 'OptionFactorySCA', res => {
    $( '#OptionsSCAValue' ).html( res )
  } )
  PubSub.subscribe( 'OptionMakeFee', res => {
    let fee = COMMONMODEL.fromWei( res.toString(), 'szabo' ) + ' szabo';
    $( '#OptionsMakeFeeValue' ).html( fee )
  } )
  PubSub.subscribe( 'OptionCancelFee', res => {
    let fee = COMMONMODEL.fromWei( res.toString(), 'szabo' ) + ' szabo';
    $( '#OptionsCancelFeeValue' ).html( fee )
  } )
  PubSub.subscribe( 'OptionTakeFee', res => {
    let fee = COMMONMODEL.fromWei( res.toString(), 'szabo' ) + ' szabo';
    $( '#OptionsTakeFeeValue' ).html( fee )
  } )
  PubSub.subscribe( 'OptionNFTSCA', res => {
    $( '#OptionNFTSCAValue' ).html( res )
  } )

  PubSub.subscribe( 'NewOptionTypeChanged', val => {
    setPairLabels( val )
    calcTxs()
  } );

  PubSub.subscribe( 'CancelOption', async id => {
    let onft = await OPTIONFACTORY.getToken( id )
    let erc721 = null

    if (!/^0[xX]0+$/.test(onft.collatType) && onft.collatAmount == 0 ) {
      erc721 = await ERC721.fetchAsync( onft.collatType )
    }

    let est1 = COMMONVIEW.estimateTxnDollars(
          ERC721.APPROVEGAS, SETTINGSVIEW.gasPrice(), 0 )

    let est2 = COMMONVIEW.estimateTxnDollars(
          OPTIONFACTORY.CANCELGAS(), SETTINGSVIEW.gasPrice(), 0 )

    let est3 = COMMONVIEW.estimateTxnDollars(
          ERC721.TRANSFERFROMGAS, SETTINGSVIEW.gasPrice(), 0 )

    let msg =
      'Transactions:\n\n' +
      '1. OPTIONNFT.approve( OPTIONFACTORY, tokenId=' + id + ' ) \n' +
      '2. OPTIONFACTORY.cancel( tokenId=' + id + ' )\n'

    let estimate = Number(est1) + Number(est2)

    if (erc721) {
      estimate += Number(est3)

      msg += '3. ' + erc721.symbol() +
      '.transferFrom( OPTIONFACTORY, tokenId=' + onft.collatTokenId + ' )\n'
    }

    msg += 'Estimate: $' + estimate + '\n'

    let ok = COMMONVIEW.userConfirm( msg )
    if (!ok) return

    await OPTIONFACTORY.cancel( id )

    if (erc721) {
      await erc721.transferFrom( OPTIONFACTORY.SCA,
                                 ACCOUNTMODEL.getUser().address,
                                 onft.collatTokenId )
    }

    PubSub.publish( 'InitOptionsTab' )
  } )

  PubSub.subscribe( 'TakeOption', async (id) => {
    let nft = await OPTIONFACTORY.getToken( id )
    let msg = 'Transactions:\n\n'
    let settleEth = /^0[xX]0+$/.test(nft.settleType)
    let collatEth = /^0[xX]0+$/.test(nft.collatType)
    let settleERC = null
    let collatERC = null

    if (settleEth) { // ETH
      msg += '1. Provide ' +
             COMMONVIEW.shiftValueLeftDecimals(nft.settleAmount,18) +
             ' eth to OPTIONFACTORY.take()\n'
    }
    else {
      if (nft.settleAmount == 0) { // must be ERC721
        settleERC = await ERC721.fetchAsync( nft.settleType )
        msg += '1. ' + settleERC.symbol() +
               '.approve( OPTIONFACTORY, settleTokenId=' +
               nft.settleTokenId + ' )\n'
      }
      else { // gotta be ERC20
        settleERC = await ERC20.fetchAsync( nft.settleType )
        msg += '1. ' + settleERC.symbol() +
               '.approve( OPTIONFACTORY, settleAmount=' +
               nft.settleAmount + ' units )\n'
      }
    }

    msg += '2. OPTIONNFT.approve( OPTIONFACTORY, tokenId=' + id + ' )\n' +
           '3. OPTIONFACTORY.take()\n'

    if (!collatEth && nft.collatAmount == 0) { // ERC721
      collatERC = await ERC721.fetchAsync( nft.collatType )
      msg += '4. ' + collatERC.symbol() +
             '.transferFrom( OPTIONFACTORY, tokenId=' +
             nft.collatTokenId + ' )\n'
    }

    let ok = COMMONVIEW.userConfirm( msg )
    if (!ok) return

    await OPTIONFACTORY.take( id )

    if (!collatEth && nft.collatAmount == 0) { // ERC721
      await collatERC.transferFrom(
        OPTIONFACTORY.SCA,
        ACCOUNTMODEL.getUser().address,
        nft.collatTokenId )
    }

    init()
  } )

  return {
    init:init
  };

})();

