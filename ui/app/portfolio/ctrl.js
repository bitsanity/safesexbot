var PORTFOLIOCTRL = (function() {

  async function initPortfolioTab() {
    $( "#NewOfferDialog" ).hide();
    $( "#NewAskDialog" ).hide();
    $( "#AsksDialog" ).hide();
    $( "#NewListingDialog" ).hide();
    $( "#TakeListingDialog" ).hide();
    $( "#PortfolioListings" ).show();

    await CHITMARKET.refreshCaches()

    PORTFOLIOVIEW.refreshListings()
  }

  PubSub.subscribe( 'CancelAsk', askId => {
    let estimate = COMMONVIEW.estimateTxnDollars(
        CHITMARKET.CANCELASKGAS(), SETTINGSVIEW.gasPrice(), 0 )

    if (COMMONVIEW.userConfirm(
      'CHITMARKET.cancelAsk( askId=' + askId + ' )\n' +
      'value: 0\n' +
      'gas: ' + CHITMARKET.CANCELASKGAS() + '\n' +
      'gasPrice: ' + SETTINGSVIEW.gasPrice() + '\n' +
      'Estimate: $' + estimate )) {
      CHITMARKET.cancelAsk( askId )
    }
  } )

  PubSub.subscribe( 'CancelOffer', offerId => {
    let payChitId = CHITMARKET.getOffer(offerId).payChitId

    let est1 = COMMONVIEW.estimateTxnDollars(
        ERC721.APPROVEGAS, SETTINGSVIEW.gasPrice(), 0 )

    let est2 = COMMONVIEW.estimateTxnDollars(
        CHITMARKET.CANCELOFFERGAS(), SETTINGSVIEW.gasPrice(), 0 )

    let answer = COMMONVIEW.userConfirm(
      '1. CHIT.approve( to="0x0", tokenId=' + payChitId + ' )\n' +
      'value: 0\n' +
      'gas: ' + ERC721.APPROVEGAS + '\n' +
      'gasPrice: ' + SETTINGSVIEW.gasPrice() + '\n' +
      'Estimate: $' + est1 + '\n\n' +
      '2. CHITMARKET.cancelOffer( offerId=' + offerId + ' )\n' +
      'value: 0\n' +
      'gas: ' + CHITMARKET.CANCELOFFERGAS() + '\n' +
      'gasPrice: ' + SETTINGSVIEW.gasPrice() + '\n' +
      'Estimate: $' + est2 + '\n'
    )

    if (answer)
      CHITMARKET.cancelOffer( offerId )
  } )

  PubSub.subscribe( 'AcceptOffer', async offerId => {
    let offer = CHITMARKET.getOffer( offerId )
    let ask = CHITMARKET.getAsk( offer.askId )

    let est1 = COMMONVIEW.estimateTxnDollars(
        ERC721.APPROVEGAS, SETTINGSVIEW.gasPrice(), 0 )

    let est2 = COMMONVIEW.estimateTxnDollars(
        CHITMARKET.ACCEPTGAS(), SETTINGSVIEW.gasPrice(), 0 )

    let answer = COMMONVIEW.userConfirm(
      '1. CHIT.approve( to=CHITMARKET, tokenId=' + ask.assetChitId + ' )\n' +
      'value: 0\n' +
      'gas: ' + ERC721.APPROVEGAS + '\n' +
      'gasPrice: ' + SETTINGSVIEW.gasPrice() + '\n' +
      'Estimate: $' + est1 + '\n\n' +
      '2. CHITMARKET.accept( offerId=' + offerId + ' )\n' +
      'value: 0\n' +
      'gas: ' + CHITMARKET.ACCEPTGAS() + '\n' +
      'gasPrice: ' + SETTINGSVIEW.gasPrice() + '\n' +
      'Estimate: $' + est2 + '\n'
    )

    if (answer) {
      await CHITMARKET.accept( offerId )
    }
  } );

  return {
    initPortfolioTab:initPortfolioTab,
  };

})();

