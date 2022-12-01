var PORTFOLIOVIEW = (function() {

  const YESFLAG = '<b>Y</b>'
  const NOFLAG = '<b>N</b>'

  function clear() {
    $( "#GeneratedPortfolioListings" ).children().remove();
  }

  async function refreshListings() {
    clear();

    // header
    $( "#GeneratedPortfolioListings" ).append(
        '<tr class=rowheader>' +
        '<th>' + STRINGS[LANG].ChitIdHeading + '</th>' +
        '<th>' + STRINGS[LANG].BlocktimeHeading + '</th>' +
        '<th>' + STRINGS[LANG].AssetDescriptionHeading + '</th>' +
        '<th>' + STRINGS[LANG].AsksHeading + '</th>' +
        '<th>' + STRINGS[LANG].IsOfferedHeading + '</th>' +
        '</tr>' );

    let chitIds = []

    if ($( '#MyListings' ).prop( 'checked' ))
      chitIds = chitfactory.myChits();

    if ($( '#OtherListings' ).prop( 'checked' ))
      chitIds = chitfactory.othersChits();

    if ($( '#AllListings' ).prop( 'checked' ))
      chitIds = chitfactory.allChits();

    for (let k in chitIds) {
      $( "#GeneratedPortfolioListings" ).append( await toHtml(chitIds[k]) );
    }
  }

  async function toHtml( chitId ) {

    let listing = await chitfactory.getChit( chitId )

    let isWrapped = listing.itemType === chitfactory.chitsca().toLowerCase()
    let isOption = listing.itemType === OPTIONFACTORY.nftSCA().toLowerCase()
    let isMine = (listing.owner === ACCOUNTMODEL.getUser().address)

    let desc = await COMMONVIEW.qtyToString(
      listing.itemType, listing.itemAmount.toString(), listing.itemTokenId )

    let askIds = CHITMARKET.getAskIds( listing.chitId )
    let offerId = CHITMARKET.chitToOfferId( listing.chitId )
    let offer = (offerId) ? CHITMARKET.getOffer( offerId ) : null

    let result = '<tr>' +
      '<td align=right>' + listing.chitId + '</td>' +
      '<td>' + COMMONVIEW.timestampToZulu(listing.tstamp) + '</td>' +
      '<td>' +

      ((isWrapped)
        ? ('<button onclick="PubSub.publish(\'ShowWrappedChit\',' +
          listing.chitId +
          ')"><img src=/images/wrap.svg width=14 height=14 /></button>') : '') +

      ((isOption)
        ? ('<button onclick="PubSub.publish(\'ShowOptionDetails\',' +
           listing.chitId +
           ')"><img src=/images/eoption.svg width=14 height=14 /></button>')
        : "") +

      '&nbsp;' + desc + '</td>' +

      '<td>' +
      '<button class=newbutton onclick="PubSub.publish(\'Asks\',' +
          listing.chitId + ')">' +
        STRINGS[LANG].AsksButton + ':' + ((askIds) ? askIds.length : 0) +
      '</button>' +
      '</td>' +
      '<td align=center>'

      if (offer && offer.askId != 0) {
        let ask = CHITMARKET.getAsk( offer.askId )

        if (ask && ask.assetChitId != 0) {
          if (isMine) {
            result += '<button class=cancelbutton ' +
                        'onclick="PubSub.publish(\'CancelOffer\',' +
                        offerId + ')">' +
                        STRINGS[LANG].CancelOfferButton +
                      '</button>'
          }
          else result += YESFLAG
        }
        else result += NOFLAG
      }
      else result += NOFLAG

      result += '</td>' +
        '<td>' +
          ((isMine) ? ('<button class=okbutton ' +
                      'onclick="PubSub.publish(\'TakeListing\',' +
                      listing.chitId + ')">' +
                      STRINGS[LANG].TakeChitButton +
                      '</button>' )
                    : ('') ) +
        '</td>' +
        '</tr>'

    return result;
  }

  PubSub.subscribe( 'ShowMyListings', () => { refreshListings() } )
  PubSub.subscribe( 'ShowOtherListings', () => { refreshListings() } )
  PubSub.subscribe( 'ShowAllListings', () => { refreshListings() } )

  PubSub.subscribe( 'ShowWrappedChit', async chitId => {
    let text = 'Wrapped Chit\n\n'
    let chit = await chitfactory.getChit( chitId )
    let ix = 1

    while (chit) {
      text += ix++ + '. ' +
        await COMMONVIEW.qtyToString(
                chit.itemType,
                chit.itemAmount.toString(),
                chit.itemTokenId,
                false ) +
        '\n'

      if (chit.itemType === chitfactory.chitsca().toLowerCase())
        chit = await chitfactory.getChit( chit.itemTokenId )
      else
        chit = null
    }

    COMMONVIEW.userAlert( text )
  } )

  PubSub.subscribe( 'ShowOptionDetails', async chitId => {
    let chit = await chitfactory.getChit( chitId )
    let option = await OPTIONFACTORY.getToken( chit.itemTokenId )

    let desc = 'OPTION:\n\n' +
      'TYPE:  ' + (option.optionType == 0 ? "PUT" : "CALL") + '\n' +
      'COLLATERAL:  ' + await COMMONVIEW.qtyToString(
        option.collatType,
        option.collatAmount,
        option.collatTokenId, false ) + '\n' +
      'SETTLEMENT:  ' + await COMMONVIEW.qtyToString(
        option.settleType,
        option.settleAmount,
        option.settleTokenId, false ) + '\n' +
      'EXPIRATION:  ' + COMMONVIEW.timestampToZulu(option.expiration) + '\n'

    COMMONVIEW.userAlert( desc )
  } )

  return {
    refreshListings:refreshListings
  };

})();

