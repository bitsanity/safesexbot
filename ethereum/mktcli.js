const fs = require('fs');
const Web3 = require('web3');
const web3 =
  new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8545"));
//new Web3(new Web3.providers.WebsocketProvider("ws://192.168.1.66:8546"));

const MYGASPRICE = '' + 4 * 1e9;

function getABI() {
  return JSON.parse(
    fs.readFileSync('./build/ChitMarket_sol_ChitMarket.abi').toString() );
}

function getBinary() {
  var binary =
    fs.readFileSync('./build/ChitMarket_sol_ChitMarket.bin').toString();
  if (!binary.startsWith('0x')) binary = '0x' + binary;
  return binary;
}

function getContract(sca) {
  return new web3.eth.Contract( getABI(), sca );
}

function printEvent(evt) {
  console.log( evt.event + ': ' + JSON.stringify(evt.returnValues) + '\n' );
}

const cmds = [
   'deploy',
   'variables',
   'getAsk',
   'getOffer',
   'ask',
   'cancelAsk',
   'offer',
   'cancelOffer',
   'accept'
  ];

function usage() {
  console.log(
    '\nUsage:\n$ node cli.js <acctindex> <SCA> <command> [arg]*\n',
     'Commands:\n',
     '\tdeploy <chit sca> |\n',
     '\tvariables |\n',
     '\tgetAsk <askid> |\n',
     '\tgetOffer <offerId> |\n',
     '\task <assetchitId> <asktype> <askamount> <asktokenid> |\n',
     '\tcancelAsk <askid> |\n',
     '\toffer <askid> <payment chitid> |\n',
     '\tcancelOffer <offerId> |\n',
     '\taccept <offerId> |\n'
  );
}

var cmd = process.argv[4];

let found = false;
for (let ii = 0; ii < cmds.length; ii++)
  if (cmds[ii] == cmd) found = true;

if (!found) {
  process.argv.forEach( arg => console.log(arg) );
  console.log( "" );
  usage();
  process.exit(1);
}

var ebi = process.argv[2]; // local account index
var sca = process.argv[3]; // chitmarket sca

var eb;
web3.eth.getAccounts().then( async (res) => {
  eb = res[ebi];

  if (cmd == 'deploy')
  {
    let chitsca = process.argv[5];

    let con = new web3.eth.Contract( getABI() );
    con.deploy( {data:getBinary(), arguments: [chitsca]} )
      .send({from: eb, gas: 2500000, gasPrice: MYGASPRICE}, (err, hash) => {
        if (err) console.log( err.toString() );
      } )
      .on('error', (err) => { console.log("err: ", err.toString()); })
      .on('transactionHash', (h) => { console.log( "hash: ", h ); } )
      .on('receipt', (r) => { console.log( 'rcpt: ' + r.contractAddress); } )
      .on('confirmation', (cn, rcpt) => { console.log( 'cn: ', cn ); } )
      .then( (nin) => {
        console.log( "SCA: ", nin.options.address );
        process.exit(0);
      } );
  }
  else
  {
    let con = new web3.eth.Contract( getABI(), sca );

    if (cmd == 'variables') {
      console.log( 'Chit addr: ' + await con.methods.chit().call() );
      console.log( 'askCounter: ' + await con.methods.askCounter().call() );
      console.log( 'offerCounter: ' + await con.methods.offerCounter().call() );
      process.exit(0);
    }

    if (cmd == 'getAsk') {
      let askid = parseInt( process.argv[5] )
      let ask = await con.methods.asks(askid).call();
      console.log( ask );
      process.exit(0);
    }

    if (cmd == 'getOffer') {
      let offerId = parseInt( process.argv[5] )
      let offer = await con.methods.offers(offerId).call();
      console.log( 'offer: ' + JSON.stringify(offer) )
      process.exit(0);
    }

    if (cmd == 'ask') {
      let chitid = parseInt( process.argv[5] )
      let askType = process.argv[6]
      let askAmount = BigInt( process.argv[7] )
      let askTokenId = parseInt( process.argv[8] )

      con.methods.ask( assetChitId, askType, askAmount, askTokenId )
      .send({from: eb, gas: 250000, gasPrice: MYGASPRICE}, (err, hash) => {
        console.log( 'ask created' )
        process.exit(0);
      })
      .catch( e => { console.log(e) } )
    }

    if (cmd == 'cancelAsk') {
      let askid = parseInt( process.argv[5] )

      con.methods.cancelAsk( askid )
      .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE}, (err, hash) => {
        console.log( 'ask ' + askid + ' canceled' )
        process.exit(0);
      } )
      .catch( e => { console.log(e) } )
    }

    if (cmd == 'offer') {
      let askid = parseInt( process.argv[5] )
      let paychitid = parseInt( process.argv[6] )

      con.methods.offer( askid, paychitid )
      .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE}, (err, hash) => {
        console.log( 'offer made on ask ' + askid +
                     ' to pay with ' + paychitid )
        process.exit(0);
      } )
      .catch( e => { console.log(e) } )
    }

    if (cmd == 'cancelOffer') {
      let offerId = parseInt( process.argv[5] )

      con.methods.cancelOffer( offerId )
      .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE}, (err, hash) => {
        console.log( 'offer of chit ' + paychitid + ' canceled' )
        process.exit(0);
      } )
      .catch( e => { console.log(e) } )
    }

    if (cmd == 'accept') {
      let offerId = parseInt( process.argv[5] )

      con.methods.accept( offerId )
      .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE}, (err, hash) => {
        console.log( 'accepted payment chit ' + paychitid )
        process.exit(0);
      } )
      .catch( e => { console.log(e) } )
    }
  }
} );

