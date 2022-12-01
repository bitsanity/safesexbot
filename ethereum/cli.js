const fs = require('fs');
const Web3 = require('web3');
const web3 =
  new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8545"));
//new Web3(new Web3.providers.WebsocketProvider("ws://192.168.1.66:8546"));

const MYGASPRICE = '' + 6 * 1e9;

function getABI() {
  return JSON.parse(
    fs.readFileSync('./build/ChitFactory_sol_ChitFactory.abi').toString() );
}

function getBinary() {
  var binary =
    fs.readFileSync('./build/ChitFactory_sol_ChitFactory.bin').toString();
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
   'balance',
   'deploy',
   'events',
   'variables',
   'setAdmin',
   'make',
   'take',
   'setFee',
   'setClient'
  ];

function usage() {
  console.log(
    '\nUsage:\n$ node cli.js <acctindex> <SCA> <command> [arg]*\n',
     'Commands:\n',
     '\tbalance <address> |\n',
     '\tdeploy <makefee> <takefee> |\n',
     '\tevents |\n',
     '\tvariables |\n',
     '\tsetAdmin <newadmin> |\n',
     '\tmake <sellunits> <selltoken> <selltokenid> <data> |\n',
     '\ttake <tokenId> |\n',
     '\tsetFee <makefee> <takefee> |\n',
     '\tsetClient <ipfshash> |\n'
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
var sca = process.argv[3]; // sexbot sca

var eb;
web3.eth.getAccounts().then( async (res) => {
  eb = res[ebi];

  if (cmd == 'balance')
  {
    let addr = process.argv[5];
    web3.eth.getBalance( addr )
    .then( (bal) => {
      console.log( "bal: " + bal );
      process.exit(0);
    } )
    .catch( err => {
      console.log(err.toString());
      process.exit(1);
    } );
  }
  if (cmd == 'deploy')
  {
    let mf = process.argv[5];
    let tf = process.argv[6];

    let con = new web3.eth.Contract( getABI() );
    con.deploy( {data:getBinary(), arguments: [mf, tf]} )
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

    if (cmd == 'events')
    {
      con.getPastEvents('allEvents', {fromBlock: 0, toBlock: 'latest'})
      .then( (events) => {

        for (var ii = 0; ii < events.length; ii++)
          printEvent( events[ii] );

        process.exit(0);
      } )
      .catch( err => {
        console.log(err.toString());
        process.exit(1);
      } );
    }

    if (cmd == 'variables')
    {
      web3.eth.getBalance( sca ).then( (bal) => {
        console.log( "balance (wei): " + bal )
      } )
      .catch( err => { console.log(err.toString()) } );

      con.methods.admin_().call().then( (res) => {
        console.log( "admin: " + res )
      } )
      .catch( err => { console.log(err.toString()) } );

      con.methods.makerfee().call().then( (res) => {
        console.log( "makerfee: " + res )
      } )
      .catch( err => { console.log(err.toString()) } );
      con.methods.takerfee().call().then( (res) => {
        console.log( "takerfee: " + res )
      } )
      .catch( err => { console.log(err.toString()) } );
      con.methods.chit().call().then( (res) => {
        console.log( "Chit SCA: " + res )
      } )
      .catch( err => { console.log(err.toString()) } );
    }

    if (cmd == 'make')
    {
      let nftdata = (process.argv[8]) ? process.argv[8] : ""

      let args = { sellunits : process.argv[5],
                   selltoken : process.argv[6],
                   selltokid : process.argv[7],
                   data : Buffer.from(nftdata,"UTF-8") }

      let val = await con.methods.makerfee().call()
      if (/^0[xX]0+$/.test(args.selltoken)) {
        val = BigInt(args.sellunits) + val
      }

      con.methods.make(
        args.sellunits, args.selltoken, args.selltokid, args.data )
      .send( {from: eb,
              value: val.toString(),
              gas: 1000000,
              gasPrice: MYGASPRICE} )
      .then( () => { process.exit(0); } )
      .catch( err => {
        console.log(err.toString());
        process.exit(1);
      } );
    }

    if (cmd == 'take')
    {
      let tokenId = process.argv[5]
      let takefee = await con.methods.takerfee().call()

      con.methods.take( tokenId )
      .send( {from: eb,
              value: takefee,
              gas: 500000,
              gasPrice: MYGASPRICE} )
      .then( () => { process.exit(0); } )
      .catch( err => {
        console.log(err.toString());
        process.exit(1);
      } );
    }

    if (cmd == 'setFee')
    {
      let which = process.argv[5];
      let newfee = process.argv[6];

      con.methods.setFee( which, newfee )
      .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE} )
      .then( () => { process.exit(0); } )
      .catch( err => { console.log(err.toString()); process.exit(1); } );
    }
    if (cmd == 'setAdmin')
    {
      let newguy = process.argv[5];

      con.methods.setAdmin( newguy )
      .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE} )
      .then( () => { process.exit(0); } )
      .catch( err => { console.log(err.toString()); process.exit(1); } );
    }
    if (cmd == 'setClient')
    {
      let ipfshash = process.argv[5];
      con.methods.setClient( ipfshash )
      .send( {from: eb, gas: 75000, gasPrice: MYGASPRICE} )
      .then( () => { process.exit(0); } )
      .catch( err => { console.log(err.toString()); process.exit(1); } );
    }
  }
} );

