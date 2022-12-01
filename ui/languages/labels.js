var STRINGS = {};
var LANG = "";

var LABELS = (function() {
  'use strict';

  function setLabels()
  {
    LANG = $( "#LanguageCB" ).val();

    // dialogs
    $( "#BackButton").html( STRINGS[LANG].BackButton );
    $( "#RespondButton").html( STRINGS[LANG].RespondButton );
    $( "#OopsButton").html( STRINGS[LANG].OopsButton );
    $( "#CameraLabel").html( STRINGS[LANG].CameraLabel );
    $( "#CancelResponseButton").html( STRINGS[LANG].CancelResponseButton );

    // tab button labels
    $( "#MarketTabButton").html( STRINGS[LANG].MarketTabButton );
    $( "#PortfolioTabButton").html( STRINGS[LANG].PortfolioTabButton );
    $( "#OptionsTabButton").html( STRINGS[LANG].OptionsTabButton );
    $( "#SettingsTabButton").html( STRINGS[LANG].SettingsTabButton );
    $( "#AccountTabButton").html( STRINGS[LANG].AccountTabButton );
    $( "#WalletTabButton").html( STRINGS[LANG].WalletTabButton );
    $( "#AboutTabButton").html( STRINGS[LANG].AboutTabButton );

    // Porfolio
    $( "#NewListingLabel").html( STRINGS[LANG].NewListingLabel );
    $( "#NewListingTitle").html( STRINGS[LANG].NewListingTitle );
    $( "#NewListingSellerLabel").html( STRINGS[LANG].NewListingSellerLabel );
    $( "#NewListingItemTypeLabel").html(STRINGS[LANG].NewListingItemTypeLabel);
    $( "#NewListingTxsLabel").html( STRINGS[LANG].NewListingTxsLabel );
    $( "#NewListingOkButton").html( STRINGS[LANG].NewListingOkButton );
    $( "#NewListingCancelButton").html( STRINGS[LANG].NewListingCancelButton );

    $( "#TakeListingTitle").html( STRINGS[LANG].TakeListingTitle );
    $( "#TakeListingIdLabel").html( STRINGS[LANG].TakeListingIdLabel )
    $( "#TakeAssetLabel" ).html( STRINGS[LANG].TakeAssetLabel )
    $( "#TakeListingTxsLabel").html( STRINGS[LANG].TakeListingTxsLabel )
    $( "#TakeListingOkButton" ).html( STRINGS[LANG].TakeListingOkButton )
    $( "#TakeListingCancelButton" ).html(
      STRINGS[LANG].TakeListingCancelButton )

    $( "#AsksDialogBackButton" ).html( STRINGS[LANG].AsksDialogBackButton )
    $( "#AsksDialogHeading").html( STRINGS[LANG].AsksDialogHeading )
    $( "#AsksChitIdLabel").html( STRINGS[LANG].AsksChitIdLabel )
    $( "#AsksAssetDescripLabel").html( STRINGS[LANG].AsksAssetDescripLabel )
    $( "#AsksNewAskLabel").html( STRINGS[LANG].AsksNewAskLabel )
    $( "#AsksNewAskButton").html( STRINGS[LANG].AsksNewAskButton )
    $( "#OffersDialogHeading").html( STRINGS[LANG].OffersDialogHeading )
    $( "#OffersAskIdLabel").html( STRINGS[LANG].OffersAskIdLabel )
    $( "#OffersAskDescripLabel").html( STRINGS[LANG].OffersAskDescripLabel )

    $( "#TakeChitButton" ).html( STRINGS[LANG].TakeChitButton )

    $( "#NewAskTitle" ).html( STRINGS[LANG].NewAskTitle )
    $( "#NewAskAssetChitIdLabel" ).html( STRINGS[LANG].NewAskAssetChitIdLabel )
    $( "#NewAskAssetDescripLabel" ).html(STRINGS[LANG].NewAskAssetDescripLabel)
    $( "#NewAskItemTypeLabel" ).html( STRINGS[LANG].NewAskItemTypeLabel )
    $( "#NewAskTxsLabel" ).html( STRINGS[LANG].NewAskTxsLabel )
    $( "#NewAskOkButton" ).html( STRINGS[LANG].GenericOkButton )
    $( "#NewAskCancelButton" ).html( STRINGS[LANG].GenericCancelButton )

    $( "#NewOfferTitle" ).html( STRINGS[LANG].NewOfferTitle )
    $( "#OfferAssetChitIdLabel" ).html( STRINGS[LANG].OfferAssetChitIdLabel )
    $( "#OfferAssetDescripLabel" ).html( STRINGS[LANG].OfferAssetDescripLabel )
    $( "#OfferAskIdLabel" ).html( STRINGS[LANG].OfferAskIdLabel )
    $( "#OfferAskDescripLabel" ).html( STRINGS[LANG].OfferAskDescripLabel )
    $( "#OfferChitListLabel" ).html( STRINGS[LANG].OfferChitListLabel )
    $( "#OfferTxsLabel" ).html( STRINGS[LANG].OfferTxsLabel )
    $( "#OfferOkButton" ).html( STRINGS[LANG].GenericOkButton )
    $( "#OfferCancelButton" ).html( STRINGS[LANG].GenericCancelButton )

    $( "#ListingsRadioLabel" ).html( STRINGS[LANG].ListingsRadioLabel )
    $( "#MyListingsLabel" ).html( STRINGS[LANG].MyListingsLabel )
    $( "#OtherListingsLabel" ).html( STRINGS[LANG].OtherListingsLabel )
    $( "#AllListingsLabel" ).html( STRINGS[LANG].AllListingsLabel )

    // Options
    $( "#MakeOptionTitle" ).html( STRINGS[LANG].MakeOptionTitle );
    $( "#OptionTypeLabel" ).html( STRINGS[LANG].OptionTypeLabel );
    $( "#OptionPairLabel" ).html( STRINGS[LANG].OptionPairLabel );
    $( "#OptionExpiresLabel" ).html( STRINGS[LANG].OptionExpiresLabel );
    $( "#OptionDataLabel" ).html( STRINGS[LANG].OptionDataLabel );
    $( "#MakeOptionTxLabel" ).html( STRINGS[LANG].MakeOptionTxLabel );
    $( "#ConfirmOptionOkButton" ).html( STRINGS[LANG].ConfirmOptionOkButton );
    $( "#ConfirmOptionCancelButton" ).html(
      STRINGS[LANG].ConfirmOptionCancelButton );

    $( "#OptionRadioLabel" ).html( STRINGS[LANG].OptionRadioLabel );
    $( "#MyOffersLabel" ).text( STRINGS[LANG].OptionRadio1Label );
    $( "#OtherOffersLabel" ).text( STRINGS[LANG].OptionRadio2Label );
    $( "#AllOffersLabel" ).text( STRINGS[LANG].OptionRadio3Label );
    $( "#MakeOptionButton" ).html( STRINGS[LANG].MakeOptionButton );

    // settings
    $( "#SkinLabel" ).html( STRINGS[LANG].SkinLabel );
    $( "#LanguageLabel" ).html( STRINGS[LANG].LanguageLabel );
    $( "#WSURLLabel" ).html( STRINGS[LANG].WSURLLabel );
    $( "#GasPriceLabel" ).html( STRINGS[LANG].GasPriceLabel );
    $( "#SEXBotSettingsLegend" ).html( STRINGS[LANG].SEXBotSettingsLegend );
    $( "#SCALabel" ).html( STRINGS[LANG].SCALabel );
    $( "#BotBalanceLabel" ).html( STRINGS[LANG].BotBalanceLabel );
    $( "#ChitSCALabel" ).html( STRINGS[LANG].ChitSCALabel );
    $( "#ChitMarketSCALabel" ).html( STRINGS[LANG].ChitMarketSCALabel );
    $( "#MakerFeeLabel" ).html( STRINGS[LANG].MakerFeeLabel );
    $( "#TakerFeeLabel" ).html( STRINGS[LANG].TakerFeeLabel );
    $( "#OptionsSettingsLegend" ).html( STRINGS[LANG].OptionsSettingsLegend );
    $( "#OptionsSCALabel" ).html( STRINGS[LANG].OptionsSCALabel );
    $( "#OptionNFTSCALabel" ).html( STRINGS[LANG].OptionNFTSCALabel );
    $( "#OptionsMakeFeeLabel" ).html( STRINGS[LANG].OptionsMakeFeeLabel );
    $( "#OptionsCancelFeeLabel" ).html( STRINGS[LANG].OptionsCancelFeeLabel );
    $( "#OptionsTakeFeeLabel" ).html( STRINGS[LANG].OptionsTakeFeeLabel );

    // account
    $( "#LoginLabel" ).html( STRINGS[LANG].LoginLabel );
    $( "#LoadRawKeyLabel" ).html( STRINGS[LANG].LoadRawKeyLabel );
    $( "#OrLabel" ).html( STRINGS[LANG].OrLabel );
    $( "#OrLabel2" ).html( STRINGS[LANG].OrLabel );
    $( "#ADILOSLabel" ).html( STRINGS[LANG].ADILOSLabel );
    $( "#ADILOSChallengeButton" ).html( STRINGS[LANG].ADILOSChallengeButton );

    $( "#PasteGethFileLabel" ).html( STRINGS[LANG].PasteGethFileLabel );
    $( "#AccountStatusLabel" ).html( STRINGS[LANG].AccountStatusLabel );
    $( "#AddrLabel" ).html( STRINGS[LANG].AddrLabel );
    $( "#MyBalanceLabel" ).html( STRINGS[LANG].MyBalanceLabel );
    $( "#TxCountLabel" ).html( STRINGS[LANG].TxCountLabel );
    $( "#PassphrasePrompt" ).html( STRINGS[LANG].PassphrasePrompt );

    // wallet
    $( "#SendFundsLabel" ).html( STRINGS[LANG].SendFundsLabel );
    $( "#SendToAddrLabel" ).html( STRINGS[LANG].SendToAddrLabel );
    $( "#SendAmountLabel" ).html( STRINGS[LANG].SendAmountLabel );
    $( "#SendCalldataLabel" ).html( STRINGS[LANG].SendCalldataLabel );
    $( "#SendEthTxLabel" ).html( STRINGS[LANG].SendEthTxLabel );
    $( "#SendEtherButton" ).html( STRINGS[LANG].SendEtherButton );
    $( "#TransferTokensLabel" ).html( STRINGS[LANG].TransferTokensLabel );
    $( "#TransferTokenTypeLabel" ).html( STRINGS[LANG].TransferTokenTypeLabel );
    $( "#SelectTokenLabel" ).html( STRINGS[LANG].SelectTokenLabel );
    $( "#MyTokenBalLabel" ).html( STRINGS[LANG].MyTokenBalLabel );
    $( "#TokenToLabel" ).html( STRINGS[LANG].TokenToLabel );
    $( "#TokenAmountLabel" ).html( STRINGS[LANG].TokenAmountLabel );
    $( "#TokenTxLabel" ).html( STRINGS[LANG].TokenTxLabel );
    $( "#TransferTokensButton" ).html( STRINGS[LANG].TransferTokensButton );

    // about
    $( "#AboutTextArea" ).val( STRINGS[LANG].AboutText );
  }

  return {
    setLabels:setLabels
  };

})();
