var SETTINGSCTRL = (function() {

  PubSub.subscribe( 'wsUrlChanged', () => { wsUrlChanged() } )

  function initSettingsTab() {

    SETTINGSVIEW.setSCA( chitfactory.sca() );

    SETTINGSVIEW.setChitSCA(chitfactory.chitsca())

    SETTINGSVIEW.setChitMarketSCA( CHITMARKET.mktsca() )

    chitfactory.balanceEth( res => {
      SETTINGSVIEW.setBalanceEth( res );
    } );

    chitfactory.makerFee( res => {
      SETTINGSVIEW.setMakerFee( res );
    } );

    chitfactory.takerFee( res => {
      SETTINGSVIEW.setTakerFee( res );
    } );

    COMMONMODEL.getGasPrice( err => {
      SETTINGSVIEW.setGasPrice( "" );
    }, gp => {
      SETTINGSVIEW.setGasPrice( gp );
    } );
  }

  function wsUrlChanged() {
    let url = SETTINGSVIEW.getWSUrl();

    COMMONMODEL.connect(
      url,

      errmsg => {
        console.log( errmsg );
        SETTINGSVIEW.connection( false );
      },

      res => {
        PubSub.publish( 'connected' );
        setTimeout( () => {
          SETTINGSVIEW.connection( true );
          SETTINGSVIEW.setGasPrice( res );
          ERC20.load();
          initSettingsTab();
        }, 500 )
      }
    );
  }

  return {
    initSettingsTab:initSettingsTab,
    wsUrlChanged:wsUrlChanged
  };

})();

