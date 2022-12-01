var ACCOUNTCTRL = (function() {

  var challengeB64;
  var userpubkey;

  function initAccountTab() {

    ACCOUNTMODEL.refreshTxCount();

    setTimeout( () => {
      ACCOUNTMODEL.currentUserBalance( bal => {
        ACCOUNTVIEW.setUserFields(
          ACCOUNTMODEL.getUser().address, bal, ACCOUNTMODEL.getUser().nonce );
      } );
    }, 250 );
  }

  function ingestRawKey() {
    let hexstr = ACCOUNTVIEW.getRawKey();
    ACCOUNTMODEL.loadUserByRawKey( hexstr,
      err => { ACCOUNTVIEW.rawKeyLoaded( false ); },
      () => {
        ACCOUNTVIEW.rawKeyLoaded( true );
        setTimeout( initAccountTab, 100 ); // yield thread
      }
    );
  }

  function ingestGeth() {
    let gethobjstr = ACCOUNTVIEW.getGethVal();
    let passphrase = ACCOUNTVIEW.getPassphraseFromUser();

    ACCOUNTMODEL.loadUserByGeth( gethobjstr, passphrase,
      err => { ACCOUNTVIEW.gethObjLoaded( false ) },
      () => {
        ACCOUNTVIEW.gethObjLoaded( true );
        setTimeout( initAccountTab, 100 ); // yield thread
      }
    );
  }

  function identityChallenge() {
    let randomSessionKey = CRYPTO.randomBytes(32);
    challengeB64 = ADILOS.makeChallenge( randomSessionKey );
    PubSub.publish( 'DoChallenge', challengeB64 )
  }

  function qrScanned( scan ) {
    try {
      userpubkey = ADILOS.validateResponse( scan, challengeB64 );
    }
    catch( ex ) {
      console.log( 'ACCOUNTCTRL: scan is not an ADILOS identity response.' )
    }

    if (userpubkey) {
      ACCOUNTMODEL.loadUserByPublicKey( userpubkey );
      PubSub.publish( 'MainScreen' )
    }
  }

  function userPubkey() { return userpubkey }

  PubSub.subscribe( 'QRScanned', scan => { qrScanned(scan) } )

  return {
    initAccountTab:initAccountTab,
    ingestRawKey:ingestRawKey,
    ingestGeth:ingestGeth,
    identityChallenge:identityChallenge,
    qrScanned:qrScanned,
    userPubkey:userPubkey
  };

})();

