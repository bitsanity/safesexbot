var MARKETCTRL = (function() {

  var widgets = null;

  function initMarketTab() {
    MARKETVIEW.refresh();
  }

  function setWidgets( arr ) {
    widgets = arr;
  }

  function onConnect() {
    widgets.forEach( widg => { widg.onConnect() } );
  }

  PubSub.subscribe( 'connected', () => {
    onConnect()
  } )

  return {
    initMarketTab:initMarketTab,
    setWidgets:setWidgets
  };

})();

