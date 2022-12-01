var NEWOFFERDLG = (function() {

  const YESFLAG = '<font color=green><b>YES</b></font>'
  const NOFLAG = '<font color=red><b>NO</b></font>'

  var selectedChitId = ''

  function showDialog() {
    selectedChitId = ''

    $( "#PortfolioListings" ).hide();
    $( "#AsksDialog" ).hide();

    $( "#OfferAssetChitIdValue" ).html( '' )
    $( "#OfferAssetDescripValue" ).html( '' )
    $( "#OfferAskIdValue" ).html( '' )
    $( "#OfferAskDescripValue" ).html( '' )
    $( "#GeneratedOfferCandidates" ).children().remove();

    $( "#NewOfferDialog" ).show();
  }

  function closeDialog() {
    $( "#NewOfferDialog" ).hide();
    $( "#NewAskDialog" ).hide();
    $( "#PortfolioListings" ).hide();
    $( "#AsksDialog" ).show();
  }

  async function setAsk( askId ) {

    let ask = await CHITMARKET.getAsk( askId )
    let assetChitId = ask.assetChitId
    $( '#OfferAssetChitIdValue' ).html( assetChitId )

    let chit = await chitfactory.getChit( assetChitId )
    if (!chit) return

    let desc = await COMMONVIEW.qtyToString(
      chit.itemType, chit.itemAmount.toString(), chit.itemTokenId )

    $( '#OfferAssetDescripValue' ).html( desc )
    $( '#OfferAskIdValue' ).html( askId )

    let desc2 = await COMMONVIEW.qtyToString(
      ask.askType, ask.askAmount.toString(), ask.askTokenId )

    $( "#OfferAskDescripValue" ).html( desc2 )

    makeChitList( askId )
    calcTxs()
  }

  async function makeChitList( askId ) {

    $( "#GeneratedOfferCandidates" ).children().remove();

    $( "#GeneratedOfferCandidates" ).append(
        '<tr class=rowheader>' +
        '<th>' + STRINGS[LANG].ChitIdHeading + '</th>' +
        '<th>' + STRINGS[LANG].AssetDescriptionHeading + '</th>' +
        '<th>' + STRINGS[LANG].OfferMeetsExceedsHeading + '</th>' +
        '</tr>' );

    let ask = CHITMARKET.getAsk( askId )
    let chitIds = chitfactory.myChits();

    chitIds.forEach( async (cid) => {
      let chit = await chitfactory.getChit( cid )
      let desc = await COMMONVIEW.qtyToString(
        chit.itemType, chit.itemAmount.toString(), chit.itemTokenId )

      let meetsExceeds =    chit.itemType == ask.askType
                         && chit.itemAmount >= ask.askAmount
                         && chit.itemTokenId == ask.askTokenId

      let row =
      '<tr>' +
      '<td>' + chit.chitId + '</td>' +
      '<td>' + desc + '</td>' +
      '<td>' + ((meetsExceeds) ? YESFLAG : NOFLAG) + '</td>' +
      '<td>' +
        '<button class=newbutton ' +
          ((!meetsExceeds) ? 'disabled ' : "") +
        ' onclick="PubSub.publish(\'OfferChitSelected\',' +
        chit.chitId + ')">' +
        STRINGS[LANG].SelectChitToOfferButton +
        '</button>' +
      '</td>' +
      '</tr>'

      $( "#GeneratedOfferCandidates" ).append( row )
    } )
  }

  function calcTxs() {
    let result = ''

    if (selectedChitId != 0) {

      let est1 = COMMONVIEW.estimateTxnDollars(
          ERC721.APPROVEGAS, SETTINGSVIEW.gasPrice(), 0 )

      let est2 = COMMONVIEW.estimateTxnDollars(
          CHITMARKET.OFFERGAS(), SETTINGSVIEW.gasPrice(), 0 )

      result =
      '1. CHIT.approve( spender=CHITMARKET, tokenId=' +
        selectedChitId + ' )\n' +
        'Estimate: $' + est1 + '\n\n' +
      '2. CHITMARKET.offer( ' +
      'askId=' + $( '#OfferAskIdValue' ).html() +
      ', payChitId=' + selectedChitId + ' )\n' +
      'value: 0\n' +
      'gas: ' + CHITMARKET.OFFERGAS() + '\n' +
      'gasPrice: ' +
        COMMONMODEL.fromWei( SETTINGSVIEW.gasPrice(), 'Gwei' ) + ' Gwei\n' +
      'Estimate: $' + est2 + '\n'
    }

    $( "#OfferTxsValue" ).html( '<pre>\n' + result + '</pre>' );
  }

  async function ok() {
    let user = ACCOUNTMODEL.getUser();
    if ( !user || !user.address || user.address.length == 0 ) {
      COMMONVIEW.userAlert( "Please LOGIN first" );
      return;
    }

    let askId= $( '#OfferAskIdValue' ).html()
    await CHITMARKET.offer( askId, selectedChitId )
    setTimeout( () => { PubSub.publish('MainScreen') }, 200 )
  }

  function canceled() {
    closeDialog();
  }

  PubSub.subscribe( 'MainScreen', () => { closeDialog() } )

  PubSub.subscribe( 'MakeOfferForAsk', (askId) => {
    showDialog()
    setAsk( askId )
  } )

  PubSub.subscribe( 'OfferChitSelected', chitId => {
    selectedChitId = chitId
    calcTxs()
  } )

  return {
    showDialog:showDialog,
    closeDialog:closeDialog,
    setAsk:setAsk,
    ok:ok,
    canceled:canceled
  };

})();

