#!/bin/bash

TESTACCTA="0x8c34f41f1cf2dfe2c28b1ce7808031c40ce26d38"
TESTACCTB="0x147b61187f3f16583ac77060cbc4f711ae6c9349"
TESTACCTC="0x940855d6894bc2045fbd4d7d768623521948b904"
TESTPVTA="0x0bce878dba9cce506e81da71bb00558d1684979711cf2833bab06388f715c01a"
TESTPVTB="0xff7da9b82a2bd5d76352b9c385295a430d2ea8f9f6f405a7ced42a5b0e73aad7"
TESTPVTC="0x7451ce18c54780b24b4962aee05b26778ca4e3f42678bf589c608a3ad2c634c2"

#ganache
SCA="0xf68580c3263fb98c6eaee7164afd45ecf6189ebb"

# PROD
# SCA=""

echo CONFIRM is ganache running from a fresh start?:
read -p '[N/y]: ' ans
if [[ $ans != "y" && $ans != "Y" ]]; then
  echo ""
  echo Please run the following before this:
  echo ""
  echo -n ganache-cli ""
  echo -n --account=\"$TESTPVTA,100000000000000000000\" ""
  echo -n --account=\"$TESTPVTB,100000000000000000000\" ""
  echo  --account=\"$TESTPVTC,100000000000000000000\"
  echo ""
  exit
fi

echo
echo =======
echo DEPLOY
echo =======
echo

MF="300000000000000"
TF="500000000000000"

node ./cli.js 0 0 deploy $MF $TF

MISCADDR="0xcadc3c51e75c8c5abb42e1e2a316bfc5cd91e243"

node ./pay.js 0 $MISCADDR "1000000000000000000"


