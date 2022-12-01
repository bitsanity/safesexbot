var COMMONVIEW = (function() {

  var ethusd

  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN',
                  'JUL','AUG','SEP','OCT','NOV','DEC' ]

  function openTab(evt, tabName) {
    var ii, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (ii = 0; ii < tabcontent.length; ii++) {
      tabcontent[ii].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (ii = 0; ii < tablinks.length; ii++) {
      tablinks[ii].className = tablinks[ii].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  function zeroPadLeft( str, digits ) {
    let result = '' + str;

    while (result.length < digits)
      result = '0' + result

    return result
  }

  // ethereum timestamps are seconds since epoch
  function timestampToZulu( ts_secs ) {
    let dt = new Date( ts_secs * 1000 );
    return zeroPadLeft(dt.getUTCDate(),2) + 
           MONTHS[dt.getUTCMonth()] +
           dt.getUTCFullYear() + ' ' +
           zeroPadLeft(dt.getUTCHours(),2) + ':' +
           zeroPadLeft(dt.getUTCMinutes(),2) + 'Z'
  }

  function userAlert( str ) {
    alert( str );
  }

  function userConfirm( msg ) {
    return confirm( msg );
  }

  function userPrompt( msg ) {
    return prompt( msg );
  }

  async function qtyToString( typ, amt, tid, inclImg=true ) {
    let result = ''

    if (/^0[xX]0+$/.test(typ)) {
      result += shiftValueLeftDecimals( amt, 18 ) + ' ether'
    }
    else { // some kind of token
      let erc = null
      let img = null
      let msg = ''

      if (amt != 0) { // ERC20
        erc = await ERC20.fetchAsync( typ )
        msg = 'ERC20\\n\\n' +
              'NAME: ' + erc.name() + '\\n' +
              'SYMBOL: ' + erc.symbol() + '\\n' +
              'DECIMALS: ' + erc.decimals() + '\\n' +
              'SCA: ' + typ

        img = '<img src=/images/help.svg width=14 height=14 ' +
              'onclick="alert(\'' + msg + '\')" />'

        result += shiftValueLeftDecimals( amt, erc.decimals() ) +
                  ' ' + erc.symbol() + ' ' +
                  ((inclImg) ? img : '')
      }
      else { // ERC721
        erc = await ERC721.fetchAsync( typ )
        msg = 'ERC721/NFT\\n\\n' +
              'NAME: ' + erc.name() + '\\n' +
              'SYMBOL: ' + erc.symbol() + '\\n' +
              'SCA: ' + typ

        let script = 'onclick="alert(\'' + msg + '\')"'

        img = '<img src=/images/help.svg width=14 height=14 '
              + script +
              ' />'
        result += erc.symbol() + ' ' +
          ((inclImg) ? img : '') + ' TokenId=' + tid
      }
    }

    return result;
  }

  function estimateTxnDollars( gasunits, gasprixwei, valwei ) {
    let gu = BigInt( gasunits ),
        gp = BigInt( gasprixwei ),
        vw = BigInt( valwei )

    let wei = gu * gp + vw
    let rate = Number(ethusd)
    let result = Number(wei) * Number(rate) / Number(1000000000000000000n)
    return Number(Math.floor(result * 100)) / 100
  }

  function userConfirmTransaction( command, acct, val, gas, gasprix ) {

    let msg = command + "\n" +
      "{from:" + acct + ",value:" + val + ",gas:" + gas + ",gasPrice:" +
      gasprix + "}";

    return confirm( msg );
  }

  function setHighlighted( widget, isHighlit ) {
    if (isHighlit)
      widget.style.backgroundColor = "yellow";
    else
      widget.style.backgroundColor = "initial";
  }

  function shiftValueRightDecimals( strval, decs ) {

    let working = strval;
    if (working.indexOf('.') == -1)
      working.concat( '.' );

    let decix = 0, wholepart = '', fracpart = '';

    for (let ii = 0; ii < decs; ii++) {
      decix = working.indexOf( '.' );

      wholepart = (decix != -1) ? working.substring( 0,decix ) : working;
      fracpart = (decix != -1) ? working.substring( decix+1 ) : '';

      if (fracpart.length == 0)
        working = wholepart + '0.';
      else
        working = wholepart +
                  fracpart[0] +
                  '.' +
                  fracpart.substring( 1 );
    }

    return working.substring( 0, working.indexOf('.') ).replace( /^0+/, '' );
  }

  function shiftValueLeftDecimals( strval, decs ) {
    if (!strval || strval.length == 0 || /^0+$/.test(strval))
      return "0";

    let working = strval;

    for (let ii = 0; ii < decs; ii++) {
      let parts = working.split( '.' );

      if ( parts.length > 1 ) { // fractional
        if (parts[0].length > 0) {
          working =   parts[0].substring( 0, parts[0].length - 1 )
                    + '.'
                    + parts[0][parts[0].length - 1]
                    + parts[1];
        }
        else {
          working = '.0' + parts[1];
        }
      }
      else { // whole number
        if (parts[0].length > 0) {
          working =   parts[0].substring( 0, parts[0].length - 1 )
                    + '.'
                    + parts[0][parts[0].length - 1];
        }
        else {
          working = '0';
        }
      }

      if (working.indexOf('.') != -1)
        working = working.replace( /0+$/, '' );
    }
  
    working = working.replace( /\.$/, '' );

    if (working.startsWith('.'))
      working = '0' + working;

    return working;
  }

  PubSub.subscribe( 'ETHUSD', val => {
    ethusd = val
  } )

  return {
    openTab:openTab,
    timestampToZulu:timestampToZulu,
    qtyToString:qtyToString,
    userAlert:userAlert,
    userConfirm:userConfirm,
    userPrompt:userPrompt,
    userConfirmTransaction:userConfirmTransaction,
    setHighlighted:setHighlighted,
    shiftValueRightDecimals:shiftValueRightDecimals,
    shiftValueLeftDecimals:shiftValueLeftDecimals,
    estimateTxnDollars:estimateTxnDollars
  };

})();

