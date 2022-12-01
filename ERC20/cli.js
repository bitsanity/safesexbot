const fs = require('fs');
const Web3 = require('web3');
const web3 =
  new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8545"));

const MYGASPRICE = '' + 1 * 1e9;

function getABI() {
  return JSON.parse(
    fs.readFileSync('./build/ERC20_sol_ERC20.abi').toString() );
}

function getBinary() {
  var binary =
    fs.readFileSync('./build/ERC20_sol_ERC20.bin').toString();
  if (!binary.startsWith('0x')) binary = '0x' + binary;
  return binary;
}

function getContract(sca) {
  return new web3.eth.Contract( getABI(), sca );
}

function printEvent(evt) {
  console.log( 'LabelRegistered: ' + JSON.stringify(evt) );
}

const cmds =
  [
   'deploy',
   'events',
   'variables',
   'balanceOf',
   'setBalance'
  ];

function usage() {
  console.log(
    '\nUsage:\n$ node cli.js <acctindex> <SCA> <command> [arg]*\n',
     'Commands:\n',
     '\tdeploy <supply> <name> <decimals> <symbol> |\n',
     '\tevents |\n',
     '\tvariables |\n',
     '\tbalanceOf <address>|\n',
     '\tsetBalance <address> <amount> |\n'
  );
}

var cmd = process.argv[4];

let found = false;
for (let ii = 0; ii < cmds.length; ii++)
  if (cmds[ii] == cmd) found = true;

if (!found) {
  usage();
  process.exit(1);
}

var ebi = process.argv[2]; // local account index
var sca = process.argv[3]; // ERC20

var eb;
web3.eth.getAccounts().then( (res) => {
    eb = res[ebi];

    if (cmd == 'deploy')
    {
      let supply = process.argv[5];
      let name = process.argv[6];
      let decimals = process.argv[7];
      let sym = process.argv[8];

      let con = new web3.eth.Contract( getABI() );

      con.deploy( { data:getBinary(), arguments: [supply,name,decimals,sym] } )
      .send({from: eb, gas: 3000000, gasPrice: MYGASPRICE}, (err, hash) => {
        if (err) console.log( err );
      } )
      .on('error', (err) => { console.log("err: ", err); })
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

      if (cmd == 'events')
      {
        console.log( 'events:\n' );

        con.getPastEvents('allEvents', {fromBlock: 0, toBlock: 'latest'})
           .then( (events) => {
          for (var ii = 0; ii < events.length; ii++)
            printEvent( events[ii] );

          process.exit( 0 );
        } )
        .catch( err => { console.log(err.toString()) } );
      }

      if (cmd == 'variables') {
      }

      if (cmd == 'balanceOf') {
        let acct = process.argv[5];

        con.methods.balanceOf( acct ).call()
        .then( (bal) => {
          console.log( acct + ' bal: ' + bal );
          process.exit(0);
        } )
        .catch( (err) => {
          console.log( err.toString() );
        } );
      }

      if (cmd == 'setBalance') {
        let acct = process.argv[5];
        let newbal = process.argv[6];

        con.methods.setBalance( acct, newbal )
        .send( {from:eb,gas:100000,gasPrice:MYGASPRICE} )
        .then( () => {
          process.exit(0);
        } )
        .catch( (err) => {
          console.log( err.toString() );
        } );
      }
    }
} );

