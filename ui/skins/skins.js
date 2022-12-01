var SKINS = (function() {
  'use strict';

  function setSkin() {
    let skinname = $( "#SkinCB" ).val();
    let skinfile = 'skins/' + skinname + '.css';
    let skinurl = "url('skins/" + skinname + ".jpg')";

    $( "#PageSkin" ).attr( "href", skinfile );

    $( "body" ).css(
      {background:"#FFFFFF " + skinurl + " no-repeat left top"}
    );
  }

  return {
    setSkin:setSkin
  };

})();
