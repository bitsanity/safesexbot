var ASKSDIALOG = (function() {

  function showDialog() {
    $( "#PortfolioListings" ).hide();
    $( "#NewListingDialog" ).hide();
    $( "#NewOfferDialog" ).hide();

    $( "#AsksChitIdValue" ).html( "" )
    $( "#AsksAssetDescripValue" ).html( "" )
    $( "#OffersAskIdValue" ).html( "" )
    $( "#OffersAskDescripValue" ).html( "" )

    $( "#AsksDialog" ).show();
  }

  function closeDialog() {
    $( "#AsksDialog" ).hide();
    $( "#NewListingDialog" ).hide();
    $( "#PortfolioListings" ).show();
  }

  async function setAssetChitId( chitId ) {
    $( "#AsksChitIdValue" ).html( chitId )
    $( "#GeneratedAsksTable" ).children().remove();
    $( "#GeneratedOffersTable" ).children().remove();

    let chit = await chitfactory.getChit( chitId )
    if (!chit) return

    $( "#AsksNewAskButton" ).attr( "disabled",
      !chit || chit.owner !== ACCOUNTMODEL.getUser().address )

    $( "#AsksAssetDescripValue" ).html(
      await COMMONVIEW.qtyToString( chit.itemType,
                                    chit.itemAmount.toString(),
                                    chit.itemTokenId) )

    $( "#GeneratedAsksTable" ).append(
        '<tr class=rowheader>' +
        '<th>' + STRINGS[LANG].AskIdHeading + '</th>' +
        '<th>' + STRINGS[LANG].AsksDescriptionHeading + '</th>' +
        '<th>' + STRINGS[LANG].AsksOffersExistHeading + '</th>' +
        '</tr>' );

    let askids = CHITMARKET.getAskIds( chitId )

    if (askids) {
      askids.forEach( async (askid,ix) => {

        let ask = await CHITMARKET.getAsk( askid )
        let desc = await COMMONVIEW.qtyToString(
          ask.askType, ask.askAmount.toString(), ask.askTokenId )

        let isMine = chit.owner === ACCOUNTMODEL.getUser().address

        let offerIds = CHITMARKET.getOfferIds( askid )

        $( "#GeneratedAsksTable" ).append(
          '<tr>' +
          '<td>' + askid + '</td>' +
          '<td>' + desc + '</td>' +
          '<td>' + 
          '<button class=okbutton ' +
              'onclick="PubSub.publish(\'AskSelected\',' + askid + ')">' +

          STRINGS[LANG].AskSelectedOfferButton + ': ' +
            ((offerIds) ? offerIds.length : '0') +
          '</button>' +
          '</td>' +
          '<td>' +

          ( (isMine)
            ? '<button class=cancelbutton ' +
                'onclick="PubSub.publish(\'CancelAsk\',' + askid + ')">' +
                STRINGS[LANG].CancelAskButton +
              '</button>'
            : '<button class=newbutton ' +
                'onclick="PubSub.publish(\'MakeOfferForAsk\',' + askid + ')">' +
                STRINGS[LANG].MakeOfferButton +
              '</button>' ) +

          '</td>' +
          '</tr>'
        )
      } )
    }
  }

  async function setOffers( askId ) {

    $( "#GeneratedOffersTable" ).children().remove();
    $( "#OffersAskIdValue" ).html( askId )

    let ask = await CHITMARKET.getAsk( askId )
    let desc = await COMMONVIEW.qtyToString(
      ask.askType, ask.askAmount.toString(), ask.askTokenId )

    $( "#OffersAskDescripValue" ).html( desc )

    $( "#GeneratedOffersTable" ).append(
      '<tr class=rowheader>' +
        '<th>' + STRINGS[LANG].OfferIdHeading + '</th>' +
        '<th>' + STRINGS[LANG].AskIdHeading + '</th>' +
        '<th>' + STRINGS[LANG].PayChitIdHeading + '</th>' +
        '<th>' + STRINGS[LANG].ItemOfferedHeading + '</th>' +
      '</tr>' )

    let offers = CHITMARKET.getOfferIds( askId )
    if (offers) {
      offers.forEach( async (offerId,ix) => {

        let offer = CHITMARKET.getOffer( offerId )
        let payChitId = offer.payChitId
        let payChit = await chitfactory.getChit( payChitId )
        let ask = CHITMARKET.getAsk( offer.askId )
        let assetChit = await chitfactory.getChit( ask.assetChitId )
        let isMyAsset = assetChit.owner === ACCOUNTMODEL.getUser().address
        let isMyOffer = payChit.owner === ACCOUNTMODEL.getUser().address

        let odesc = await COMMONVIEW.qtyToString(
          payChit.itemType,
          payChit.itemAmount.toString(),
          payChit.itemTokenId )

        $( "#GeneratedOffersTable" ).append(
          '<tr>' +
            '<td>' + offerId + '</td>' +
            '<td>' + askId + '</td>' +
            '<td>' + payChitId + '</td>' +
            '<td>' + odesc + '</td>' +
            '<td>' +

          ( (isMyOffer)
            ? ('<button class=cancelbutton ' +
                'onclick="PubSub.publish(\'CancelOffer\',' + offerId +
                ')">' + STRINGS[LANG].CancelOfferButton + '</button>&nbsp;')
            : "" ) +

          ( (isMyAsset)
            ? ('<button class=okbutton ' +
                'onclick="PubSub.publish(\'AcceptOffer\',' + offerId +
                ')">' + STRINGS[LANG].AcceptOfferButton + '</button>')
            : '' ) +

          '</td>' +
          '</tr>' )
      } )
    }
  }

  function setTransactions( contents ) {
    $( "#NewListingTxsValue" ).html( '<pre>\n' + contents + '</pre>' );
  }

  PubSub.subscribe( 'MainScreen', () => { closeDialog() } )
  PubSub.subscribe( 'AsksDialogBack', () => { closeDialog() } )
  PubSub.subscribe( 'Asks', (assetChitId) => {
    showDialog()
    setAssetChitId( assetChitId )
  } )

  PubSub.subscribe( 'AskSelected', (askId) => {
    setOffers( askId )
  } )

  PubSub.subscribe( 'CancelAsk', askId => {
    setTimeout( () => { PubSub.publish('MainScreen') }, 200 )
  } )

  PubSub.subscribe( 'CancelOffer', (offerId) => {
    setTimeout( () => { PubSub.publish('MainScreen') }, 200 )
  } )

  return {
    showDialog:showDialog,
    closeDialog:closeDialog
  };

})();

