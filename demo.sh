#!/bin/bash

TESTPVTA='0x0bce878dba9cce506e81da71bb00558d1684979711cf2833bab06388f715c01a'
TESTPVTB='0xff7da9b82a2bd5d76352b9c385295a430d2ea8f9f6f405a7ced42a5b0e73aad7'
TESTPVTC='0x88da618f1e0812dfe2168fd4749df487aa4abe09e1fe2b5118e0fe42df15471f'
TESTACCTA='0x8c34f41f1cf2dfe2c28b1ce7808031c40ce26d38'
TESTACCTB='0x147b61187f3f16583ac77060cbc4f711ae6c9349'
TESTACCTC='0xa3fea6d261d82277b49c5a55ecf13bfebfd20aae'

echo CONFIRM running:
echo ""
echo -n ganache-cli ""
echo -n --account=\"$TESTPVTA,100000000000000000000\" ""
echo -n --account=\"$TESTPVTB,100000000000000000000\" ""
echo -n --account=\"$TESTPVTC,100000000000000000000\" ""
echo ""
echo ""
read -p '[N/y]: ' ans
if [[ $ans != "y" && $ans != "Y" ]]; then
  exit
fi

# Smart contracts must be deployed in same order from fresh start
SEX='0xf787dcab368efb11a9e8fd71fad4d7b10c2919b2'
SHT='0x0AC16f57845238b1FEE9DC1668D4343785d58c20'
CRP='0x3cbeD31DF5Ccd6Ebf619BdE9dDeE0254EA6663Ae'

MAKEFEE="300000000000000"
UPDTFEE="200000000000000"
CNCLFEE="100000000000000"
TAKEFEE="000000000000000"

echo ""
echo "===== deploying sexbot ====="
pushd ethereum
node cli.js 2 0 deploy $MAKEFEE $UPDTFEE $CNCLFEE $TAKEFEE
popd

echo ""
echo "===== deploying ERC20: SHIT ====="
pushd ERC20
node cli.js 2 0 deploy 1000000000000000000000 "Shit Token" 18 SHIT

echo ""
echo "===== deploying ERC20: CRAP ====="
node cli.js 2 0 deploy 1000000000000000 "Crap Token" 12 CRAP
echo ""
echo "===== setting test token balances ====="
node cli.js 2 $SHT setBalance $TESTACCTA 100000000000000000000
node cli.js 2 $CRP setBalance $TESTACCTB 100000000000000
popd
echo ""

echo ""
pushd ethereum
echo "===== adding tokens to safelist ====="
node cli.js 2 $SEX listToken $SHT "true"
node cli.js 2 $SEX listToken $CRP "true"
popd
echo DONE

