#!/bin/bash

commd=$1

if [ -z $commd ]
then
  echo compiling ...
  solcjs --abi --bin -o ./build ERC20.sol
fi

if [ "$commd" = "clean" ]
then
  echo cleaning ...
  rm -rf build
fi
